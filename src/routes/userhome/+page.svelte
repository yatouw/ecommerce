<script lang="ts">
    import { onMount } from 'svelte';

    // Define the product type
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

    // Fetch products when the component mounts
    onMount(async () => {
        try {
            const response = await fetch('/api/product');
            const data = await response.json();

            if (response.ok) {
                products = data; // Populate the products array with fetched data
            } else {
                errorMessage = data.error || 'Failed to fetch products';
            }

            // Initialize cart item count
            const cart = await fetchCart();
            cartItemCount = cart.length;
        } catch (error) {
            errorMessage = 'Failed to fetch products';
            console.error(error);
        }
    });

    // Fetch cart from the server for the logged-in user
    async function fetchCart() {
        const userId = localStorage.getItem('userId');
        if (!userId) return [];

        const response = await fetch(`/api/cart?userId=${userId}`);
        const data = await response.json();
        return response.ok ? data : [];
    }

    // Add product to the cart
    async function addToCart(product: Product) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            errorMessage = 'You must be logged in to add items to your cart';
            return;
        }

        // Send the product to the server to be added to the cart
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                body: JSON.stringify({ userId, productId: product.id }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                // Update cart item count
                const cart = await fetchCart();
                cartItemCount = cart.length;
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

<!-- Display products on the landing page -->
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
                            <span class="text-lg font-bold">${product.price}</span>
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
