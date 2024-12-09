<script lang="ts">
  import { goto } from '$app/navigation';

  let cartItemCount = 0;

  function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    goto('/');
  }
</script>

<nav class="bg-primary text-white shadow-elevated">
  <div class="container mx-auto flex justify-between items-center px-6 py-4">
    <!-- Logo -->
    <a href="/userhome" class="text-3xl font-display font-bold tracking-wider text-transparent bg-clip-text 
    bg-gradient-to-r from-white via-gray-200 to-gray-400 
    hover:from-gray-100 hover:via-white hover:to-gray-300 
    transition-all duration-300 ease-in-out">
    Elec<span class="text-accent">.</span>
  </a>

    <!-- Navigation Links -->
    <div class="flex items-center space-x-6">
      <!-- Cart Icon -->
      <a href="/userhome/cart" class="relative group">
        <i class="fa-solid fa-cart-shopping text-2xl transition-transform group-hover:scale-110"></i>
        {#if cartItemCount > 0}
          <span
            class="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-hover">
            {cartItemCount}
          </span>
        {/if}
      </a>

      <!-- Logout Button -->
      <button
        class="flex items-center space-x-2 px-4 py-2 bg-secondary rounded-lg text-white font-medium shadow-hover transition-all hover:bg-accent focus:ring focus:ring-secondary focus:outline-none"
        aria-label="Logout"
        on:click={logout}
      >
        <i class="fa-solid fa-right-from-bracket text-lg"></i>
        <span class="hidden sm:inline">Logout</span>
      </button>
    </div>
  </div>
</nav>