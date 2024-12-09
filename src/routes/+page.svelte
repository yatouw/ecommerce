<script lang="ts">
    import { onMount } from 'svelte';

    interface Product {
        id: number;
        name: string;
        price: number;
        description: string;
        category: string;
        image: string;
    }

    let products: Product[] = [];
    let filteredProducts: Product[] = [];
    let errorMessage: string | null = null;
    let selectedCategory: string = 'All';

    const categories = ['All', 'Laptop', 'Cellphone', 'Accessory'];

    onMount(async () => {
        try {
            const response = await fetch('/api/product');
            const data = await response.json();

            if (response.ok) {
                products = data;
                filterProducts();
            } else {
                errorMessage = data.error || 'Failed to fetch products';
            }
        } catch (error) {
            errorMessage = 'Failed to fetch products';
            console.error(error);
        }
    });

    function filterProducts() {
        filteredProducts = selectedCategory === 'All' 
            ? products 
            : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    function handleCategoryChange(category: string) {
        selectedCategory = category;
        filterProducts();
    }
</script>

<div class="max-w-7xl mx-auto px-4 py-6">

    <div class="flex justify-center space-x-4 mb-6">
        {#each categories as category}
            <button 
                class="px-4 py-2 rounded-md transition-all duration-300 {selectedCategory === category 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-gray-200 hover:bg-primary hover:text-white'}"
                on:click={() => handleCategoryChange(category)}
            >
                {category}
            </button>
        {/each}
    </div>

    {#if errorMessage}
        <div class="text-red-500 text-center mt-4">{errorMessage}</div>
    {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {#each filteredProducts as product (product.id)}
            <div class="bg-white rounded-lg shadow-elevated transition-all hover:shadow-hover overflow-hidden">
                <img src={product.image} alt={product.name} class="w-full h-64 object-cover transition-transform duration-300 hover:scale-105" />
                <div class="p-4">
                    <h3 class="text-xl font-semibold text-primary">{product.name}</h3>
                    <p class="text-gray-700">{product.description}</p>
                    <p class="text-sm text-gray-500">Category: {product.category}</p>
                    <div class="mt-4 flex justify-between items-center">
                        <span class="text-lg font-bold text-accent">₱{product.price}</span>
                       
                    </div>
                </div>
            </div>
        {/each}
    </div>
    
    {/if}
</div>