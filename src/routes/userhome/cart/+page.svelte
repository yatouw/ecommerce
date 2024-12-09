<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { CheckCircle, Circle } from 'lucide-svelte';
    
    interface CartItem {
        cartId: number;
        productId: number;
        name: string;
        price: number;
        quantity: number;
        description: string;
        category: string;
        image: string;
        isSelected?: boolean;
    }

    let cartItems: CartItem[] = [];
    let totalPrice = 0;
    let errorMessage: string | null = null;
    let showModal = false;

    onMount(async () => {
        await loadCart();
    });

    async function loadCart() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            errorMessage = 'Please log in to view your cart';
            goto('/login');
            return;
        }

        try {
            const response = await fetch(`/api/cart?userId=${userId}`);
            if (response.ok) {
                cartItems = await response.json();
                // Initialize all items as unselected
                cartItems = cartItems.map(item => ({
                    ...item, 
                    isSelected: false
                }));
                calculateTotal();
            } else {
                const error = await response.json();
                errorMessage = error.message || 'Failed to load cart';
            }
        } catch (error) {
            errorMessage = 'Error loading cart';
            console.error(error);
        }
    }

    function calculateTotal() {
        totalPrice = cartItems
            .filter(item => item.isSelected)
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    function toggleItemSelection(cartId: number) {
        const updatedItems = cartItems.map(item => 
            item.cartId === cartId 
                ? { ...item, isSelected: !item.isSelected } 
                : item
        );
        cartItems = updatedItems;
        calculateTotal();
    }

    async function removeFromCart(cartId: number) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            errorMessage = 'Please log in to remove items';
            return;
        }

        try {
            const response = await fetch(`/api/cart/${cartId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: parseInt(userId) })
            });

            if (response.ok) {
                cartItems = cartItems.filter(item => item.cartId !== cartId);
                calculateTotal();
            } else {
                const error = await response.json();
                errorMessage = error.message || 'Failed to remove item';
            }
        } catch (error) {
            errorMessage = 'Error removing item';
            console.error(error);
        }
    }

    async function updateQuantity(cartId: number, newQuantity: number) {
        if (newQuantity < 1) return;

        const userId = localStorage.getItem('userId');
        if (!userId) {
            errorMessage = 'Please log in to update quantities';
            return;
        }

        try {
            const response = await fetch(`/api/cart/${cartId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    quantity: newQuantity
                })
            });

            if (response.ok) {
                const updatedItem = cartItems.find(item => item.cartId === cartId);
                if (updatedItem) {
                    updatedItem.quantity = newQuantity;
                    cartItems = [...cartItems];
                    calculateTotal();
                }
            } else {
                const error = await response.json();
                errorMessage = error.message || 'Failed to update quantity';
            }
        } catch (error) {
            errorMessage = 'Error updating quantity';
            console.error(error);
        }
    }

    async function handleCheckout() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            errorMessage = 'Please log in to checkout';
            return;
        }

        const selectedCartIds = cartItems
            .filter(item => item.isSelected)
            .map(item => item.cartId);

        if (selectedCartIds.length === 0) {
            errorMessage = 'Please select items to checkout';
            return;
        }

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    cartIds: selectedCartIds
                })
            });

            if (response.ok) {
                cartItems = cartItems.filter(item => !item.isSelected);
                totalPrice = 0;
                errorMessage = null;
                showModal = true; // Show the modal instead of alert
            } else {
                const error = await response.json();
                errorMessage = error.message || 'Failed to checkout';
            }
        } catch (error) {
            errorMessage = 'Error during checkout';
            console.error(error);
        }
    }

    function closeModal() {
        showModal = false;
    }
</script>

<div class="max-w-7xl mx-auto px-4 py-6">
    <!-- Keep your existing cart content -->
    <h2 class="text-3xl font-bold text-center text-gray-800">Your Cart</h2>

    {#if errorMessage}
        <div class="text-red-500 text-center mt-4">{errorMessage}</div>
    {/if}

    {#if cartItems.length === 0}
        <div class="text-center mt-4 text-gray-600">Your cart is empty.</div>
    {:else}
        <!-- Keep your existing cart items display -->
        <div class="grid grid-cols-1 gap-6 mt-6">
            {#each cartItems as item (item.cartId)}
                <div class="flex items-center justify-between bg-white p-6 rounded-lg shadow-lg transition-shadow hover:shadow-xl border border-gray-200">
                    <!-- Keep your existing cart item content -->
                    <div class="flex items-center">
                        <button 
                            on:click={() => toggleItemSelection(item.cartId)}
                            class="mr-6 focus:outline-none"
                        >
                            {#if item.isSelected}
                                <CheckCircle class="text-green-500 w-6 h-6" />
                            {:else}
                                <Circle class="text-gray-300 w-6 h-6 hover:text-gray-400" />
                            {/if}
                        </button>

                        <img src={item.image} alt={item.name} class="w-20 h-20 object-cover rounded-lg border border-gray-300 shadow-sm" />
                        <div class="ml-6">
                            <h3 class="text-lg font-semibold text-gray-800">{item.name}</h3>
                            <p class="text-gray-600 text-sm mt-1">{item.description}</p>
                            <div class="text-gray-700 mt-2">
                                Price: <span class="font-semibold">₱{item.price.toFixed(2)}</span>
                                <span class="mx-1">x</span>
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={item.quantity}
                                    on:change={(e) => updateQuantity(item.cartId, parseInt(e.currentTarget.value))}
                                    class="w-16 px-2 py-1 border rounded-lg text-center focus:ring focus:ring-green-500 focus:border-green-500 transition"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col items-end">
                        <div class="mb-4 text-gray-700">
                            Subtotal: <span class="font-semibold">₱{(item.price * item.quantity).toFixed(2)}</span>
                            {#if item.isSelected}
                                <span class="ml-2 text-green-500 text-sm">(Selected)</span>
                            {/if}
                        </div>
                        <button
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-transform transform hover:scale-105 focus:outline-none"
                            on:click={() => removeFromCart(item.cartId)}>
                            Remove
                        </button>
                    </div>
                </div>
            {/each}
        </div>

        <div class="mt-8 text-right">
            <h3 class="text-xl font-bold text-gray-800">
                Total (Selected Items): <span class="text-green-600">₱{totalPrice.toFixed(2)}</span>
            </h3>
            <button 
                disabled={totalPrice === 0}
                on:click={handleCheckout}
                class="mt-4 px-8 py-3 rounded-lg shadow-sm text-white font-medium focus:outline-none transition-transform transform hover:scale-105
                    {totalPrice > 0 ? 'bg-green-600 hover:bg-green-700 focus:ring focus:ring-green-500' : 'bg-gray-400 cursor-not-allowed'}"
            >
                Proceed to Checkout
            </button>
        </div>
    {/if}

    <!-- Add the Modal -->
    {#if showModal}
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div class="bg-white rounded-lg p-8 max-w-sm w-full mx-4 transform transition-all">
                <div class="text-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Checkout Successful!</h3>
                    <p class="text-sm text-gray-500 mb-6">Your items have been successfully checked out.</p>
                    <button
                        on:click={closeModal}
                        class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>