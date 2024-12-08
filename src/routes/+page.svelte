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
        } catch (error) {
            errorMessage = 'Failed to fetch products';
            console.error(error);
        }
    });
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
                            <span class="text-lg font-bold">₱{product.price}</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
