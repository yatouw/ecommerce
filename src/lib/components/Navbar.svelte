<script>
  export let currentPage = '';
</script>

<nav class="bg-primary text-white shadow-elevated">
  <div class="container mx-auto flex justify-between items-center px-6 py-4">
    <!-- Logo -->
     <!-- Elegant Logo -->
     <a href="/" class="text-3xl font-display font-bold tracking-wider text-transparent bg-clip-text 
     bg-gradient-to-r from-white via-gray-200 to-gray-400 
     hover:from-gray-100 hover:via-white hover:to-gray-300 
     transition-all duration-300 ease-in-out">
     Elec<span class="text-accent">.</span>
   </a>

    <!-- Navigation Links -->
    <div class="flex space-x-6">
      <a
        href="/login"
        class="px-4 py-2 rounded-lg font-medium transition-all hover:bg-secondary hover:text-white focus:ring focus:ring-secondary focus:outline-none"
        class:underline={currentPage === 'login'}
      >
        Login
      </a>
      <a
        href="/register"
        class="px-4 py-2 rounded-lg font-medium transition-all hover:bg-secondary hover:text-white focus:ring focus:ring-secondary focus:outline-none"
        class:underline={currentPage === 'register'}
      >
        Register
      </a>
    </div>
  </div>
</nav>
