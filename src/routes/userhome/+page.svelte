<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    interface Product {
        id: number;
        name: string;
        price: number;
        description: string;
        category: string;
        image: string;
    }

    let products: Product[] = [];
    let errorMessage: string | null = null;
    let cartItemCount = 0;

    onMount(async () => {
        try {
            const response = await fetch('/api/product');
            const data = await response.json();

            if (response.ok) {
                products = data;
            } else {
                errorMessage = data.error || 'Failed to fetch products';
            }

            await updateCartCount();
        } catch (error) {
            errorMessage = 'Failed to fetch products';
            console.error(error);
        }
    });

    async function updateCartCount() {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const response = await fetch(`/api/cart?userId=${userId}`);
        if (response.ok) {
            const cart = await response.json();
            cartItemCount = cart.length;
        }
    }

    async function addToCart(product: Product) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            errorMessage = 'You must be logged in to add items to your cart';
            goto('/login');
            return;
        }

        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    productId: product.id,
                    quantity: 1 
                })
            });

            if (response.ok) {
                await updateCartCount();
            } else {
                const errorData = await response.json();
                errorMessage = errorData.error || 'Failed to add product to cart';
            }
        } catch (error) {
            errorMessage = 'Failed to add product to cart';
            console.error(error);
        }
    }
</script>

<div class="max-w-7xl mx-auto px-4 py-6">
    <h2 class="text-3xl font-bold text-center">Featured Products</h2>

    {#if errorMessage}
        <div class="text-red-500 text-center mt-4">{errorMessage}</div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {#each products as product (product.id)}
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <img src={product.image} alt={product.name} class="w-full h-64 object-cover" />
                    <div class="p-4">
                        <h3 class="text-xl font-semibold">{product.name}</h3>
                        <p class="text-gray-700">{product.description}</p>
                        <div class="mt-4 flex justify-between items-center">
                            <span class="text-lg font-bold">₱{product.price}</span>
                            <button
                                class="px-4 py-2 bg-primary text-white rounded-md"
                                on:click={() => addToCart(product)}>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
