<script>
    export let currentPage = '';
  </script>
  
  <nav class="bg-gray-800 text-white px-4 py-3">
    <div class="container mx-auto flex justify-between items-center">
      <a href="/" class="text-lg font-bold">E-Commerce</a>
      <div>
        <a
          href="/login"
          class:underline={currentPage === 'login'}
          class="px-3 py-1"
          >Login</a
        >
        <a
          href="/register"
          class:underline={currentPage === 'register'}
          class="px-3 py-1"
          >Register</a
        >
      </div>
    </div>
  </nav>
  
  