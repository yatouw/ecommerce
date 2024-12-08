<script lang="ts">
    import { onMount } from 'svelte';

    interface Product {
        id: number;
        name: string;
        price: number;
        quantity: number;
        description: string;
        category: string;
        image: string;
    }

    let cartItems: Product[] = [];
    let totalPrice = 0;

    onMount(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cartItems = cart;

        // Calculate total price
        totalPrice = cart.reduce((sum: number, item: Product) => sum + item.price * item.quantity, 0);
    });

    // Remove item from cart
    function removeFromCart(productId: number) {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Update the cartItems and totalPrice
        cartItems = updatedCart;
        totalPrice = updatedCart.reduce((sum: number, item: Product) => sum + item.price * item.quantity, 0);
    }
</script>

<div class="max-w-7xl mx-auto px-4 py-6">
    <h2 class="text-3xl font-bold text-center">Your Cart</h2>

    {#if cartItems.length === 0}
        <div class="text-center mt-4">Your cart is empty.</div>
    {:else}
        <div class="grid grid-cols-1 gap-6 mt-6">
            {#each cartItems as item (item.id)}
                <div class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
                    <div class="flex items-center">
                        <img src={item.image} alt={item.name} class="w-16 h-16 object-cover mr-4" />
                        <div>
                            <h3 class="text-lg font-semibold">{item.name}</h3>
                            <p class="text-gray-700">{item.description}</p>
                            <div class="text-gray-500">Price: ${item.price} x {item.quantity}</div>
                        </div>
                    </div>
                    <button
                        class="px-4 py-2 bg-red-600 text-white rounded-md"
                        on:click={() => removeFromCart(item.id)}>
                        Remove
                    </button>
                </div>
            {/each}
        </div>

        <div class="mt-6 text-right">
            <h3 class="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</h3>
            <button class="mt-4 px-6 py-2 bg-green-600 text-white rounded-md">Checkout</button>
        </div>
    {/if}
</div>
