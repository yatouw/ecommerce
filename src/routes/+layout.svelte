<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import AuthNavbar from '$lib/components/AuthNavbar.svelte';
	import { page } from '$app/stores';

	// Reactive tracking of the current route
	$: currentPage = $page.url.pathname;
</script>

{#if currentPage.startsWith('/userhome')}
	<!-- Show AuthNavbar for authenticated pages -->
	<AuthNavbar />
{:else}
	<!-- Show Navbar for public pages -->
	<Navbar />
{/if}

<slot />
