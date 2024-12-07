<script>
    import { goto } from '$app/navigation';

    let username = '';
    let password = '';

    async function handleLogin() {
    const response = await fetch('/api', {
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

<form on:submit|preventDefault={handleLogin}>
    <input type="text" bind:value={username} placeholder="Username" required />
    <input type="password" bind:value={password} placeholder="Password" required />
    <button type="submit">Login</button>
</form>
