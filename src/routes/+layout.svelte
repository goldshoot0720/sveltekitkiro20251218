<script>
	import Navigation from '$lib/components/Navigation.svelte';
	import '../app.css';
</script>

<Navigation />

<main class="main-content">
	<slot />
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #f8f9fa;
		color: #2c3e50;
		line-height: 1.6;
	}
	
	:global(*) {
		box-sizing: border-box;
	}
	
	.main-content {
		min-height: calc(100vh - 64px);
		padding: 20px 0;
	}
	
	@media (max-width: 768px) {
		.main-content {
			padding: 16px 0;
		}
	}
</style>