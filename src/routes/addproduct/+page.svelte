<script lang="ts">
    import { onMount } from 'svelte';

    let name = '';
    let price = '';
    let description = '';
    let category = '';
    let image: File | null = null;

    async function handleAddProduct() {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('category', category);
        if (image) formData.append('image', image);

        const response = await fetch('/api/product', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            alert('Product added successfully!');
        } else {
            alert(`Failed to add product: ${result.error}`);
        }
    }
</script>

<form on:submit|preventDefault={handleAddProduct} class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6 animate-[slide-in_0.5s_ease-out]">
    <h2 class="text-2xl font-semibold text-center text-primary">Add New Product</h2>

    <div class="space-y-4">
        <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Product Name</label>
            <input 
                id="name"
                type="text" 
                bind:value={name} 
                placeholder="Enter product name" 
                required 
                class="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
        </div>

        <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Price ($)</label>
            <input 
                id="price"
                type="number" 
                bind:value={price} 
                placeholder="Enter price" 
                step="0.001" 
                required 
                class="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
        </div>

        <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
                id="description"
                bind:value={description} 
                placeholder="Enter product description" 
                required 
                class="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            ></textarea>
        </div>

        <div>
            <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
            <input 
                id="category"
                type="text" 
                bind:value={category} 
                placeholder="Enter category" 
                required 
                class="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
        </div>

        <div>
            <label for="image" class="block text-sm font-medium text-gray-700">Product Image</label>
            <input 
                id="image"
                type="file" 
                accept="image/*" 
                on:change={(e) => (image = (e.target as HTMLInputElement).files?.[0] || null)} 
                required 
                class="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
        </div>
    </div>

    <button 
        type="submit" 
        class="w-full py-3 mt-6 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
    >
        Add Product
    </button>
</form>