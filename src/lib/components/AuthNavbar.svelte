<script lang="ts">
  import { goto } from '$app/navigation';

  let cartItemCount = 0;
  
  function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    goto('/');  
  }
</script>

<nav class="bg-gray-800 text-white px-4 py-3">
  <div class="container mx-auto flex justify-between items-center">
      <a href="/userhome" class="text-lg font-bold">E-Commerce</a>
      <div class="flex items-center space-x-4">
          <a href="/userhome/cart" class="relative">
              <i class="fa-solid fa-cart-shopping text-xl"></i>
              {#if cartItemCount > 0}
                  <span class="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-2">{cartItemCount}</span>
              {/if}
          </a>

          <!-- Logout Button with aria-label for accessibility -->
          <button class="px-3 py-1" aria-label="Logout" on:click={logout}>
              <i class="fa-solid fa-right-from-bracket text-xl"></i>
          </button>
      </div>
  </div>
</nav>
