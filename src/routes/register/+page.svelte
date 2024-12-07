<script>
    import { goto } from '$app/navigation';

    let username = '';
    let password = '';

    async function handleRegister() {
        const response = await fetch('/api', {
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

<form on:submit|preventDefault={handleRegister}>
    <input type="text" bind:value={username} placeholder="Username" required />
    <input type="password" bind:value={password} placeholder="Password" required />
    <button type="submit">Register</button>
</form>
