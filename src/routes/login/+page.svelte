<script>
    import { goto } from '$app/navigation';

    let username = '';
    let password = '';

    async function handleLogin() {
    const response = await fetch('/api/login', {
        method: 'PUT',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        goto('/userhome');
    } else {
        const errorResponse = await response.json();
        alert(`Login failed! ${errorResponse.error || 'Unknown error'}`);
        console.error('Error response:', errorResponse);  
    }
}

</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
    <form
        class="bg-white shadow-elevated p-8 rounded-lg w-96 space-y-4 animate-slide-in"
        on:submit|preventDefault={handleLogin}
    >
        <h2 class="text-2xl font-bold text-center text-gray-800">Login</h2>
        <input
            type="text"
            bind:value={username}
            placeholder="Username"
            required
            class="w-full p-3 border rounded focus:ring-primary focus:border-primary"
        />
        <input
            type="password"
            bind:value={password}
            placeholder="Password"
            required
            class="w-full p-3 border rounded focus:ring-primary focus:border-primary"
        />
        <button
            type="submit"
            class="w-full py-3 text-white bg-gray-800 rounded hover:bg-primary/90 transition"
        >
            Login
        </button>
    </form>
</div>
