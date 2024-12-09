<script>
    import { goto } from '$app/navigation';
  
    let username = '';
    let password = '';
  
    async function handleRegister() {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        goto('/login');
      } else {
        alert('Registration failed!');
      }
    }
  </script>
  
  <div class="flex items-center justify-center min-h-screen bg-background">
    <form
      class="bg-white shadow-elevated p-8 rounded-lg w-96 space-y-6 animate-slide-in"
      on:submit|preventDefault={handleRegister}
    >
      <h2 class="text-3xl font-bold text-center text-primary">Create Account</h2>
      <p class="text-center text-gray-500">Join our platform today!</p>
      <input
        type="text"
        bind:value={username}
        placeholder="Enter your username"
        required
        class="w-full p-3 border rounded-lg focus:ring-primary focus:border-primary"
      />
      <input
        type="password"
        bind:value={password}
        placeholder="Enter your password"
        required
        class="w-full p-3 border rounded-lg focus:ring-primary focus:border-primary"
      />
      <button
        type="submit"
        class="w-full py-3 text-white bg-primary rounded-lg hover:bg-primary/90 transition"
      >
        Register
      </button>
    </form>
  </div>