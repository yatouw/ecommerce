<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    interface CartItem {
        cartId: number;  
        productId: number;
        name: string;
        price: number;
        quantity: number;
        description: string;
        category: string;
        image: string;
    }

    let cartItems: CartItem[] = [];
    let totalPrice = 0;
    let errorMessage: string | null = null;

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
        totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
</script>

<div class="max-w-7xl mx-auto px-4 py-6">
    <h2 class="text-3xl font-bold text-center">Your Cart</h2>

    {#if errorMessage}
        <div class="text-red-500 text-center mt-4">{errorMessage}</div>
    {/if}

    {#if cartItems.length === 0}
        <div class="text-center mt-4">Your cart is empty.</div>
    {:else}
        <div class="grid grid-cols-1 gap-6 mt-6">
            {#each cartItems as item (item.cartId)}
                <div class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
                    <div class="flex items-center">
                        <img src={item.image} alt={item.name} class="w-16 h-16 object-cover mr-4" />
                        <div>
                            <h3 class="text-lg font-semibold">{item.name}</h3>
                            <p class="text-gray-700">{item.description}</p>
                            <div class="text-gray-500">
                                Price: ${item.price.toFixed(2)} x 
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={item.quantity}
                                    on:change={(e) => updateQuantity(item.cartId, parseInt(e.currentTarget.value))}
                                    class="w-16 px-2 py-1 border rounded"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col items-end">
                        <div class="mb-2 font-semibold">
                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button
                            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            on:click={() => removeFromCart(item.cartId)}>
                            Remove
                        </button>
                    </div>
                </div>
            {/each}
        </div>

        <div class="mt-6 text-right">
            <h3 class="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</h3>
            <button class="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Proceed to Checkout
            </button>
        </div>
    {/if}
</div>