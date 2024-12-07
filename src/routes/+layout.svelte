<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import AuthNavbar from '$lib/components/AuthNavbar.svelte';
	import { page } from '$app/stores';

	$: currentPage = $page.url.pathname;
</script>

{#if currentPage.startsWith('/userhome')}
	<AuthNavbar />
{:else}
	<Navbar />
{/if}
<slot />
