<script>
	import { page } from '$app/stores';
	import '../app.css';
	
	let menuOpen = false;
	let darkMode = false;
	
	const menuItems = [
		{ icon: '📊', label: '儀表板', path: '/' },
		{ icon: '📋', label: '訂閱管理', path: '/subscriptions' },
		{ icon: '🍱', label: '食物管理', path: '/food' },
		{ icon: '🎬', label: '影片庫', path: '/videos' },
		{ icon: '🖼️', label: '圖片庫', path: '/images' }
	];
	
	function toggleMenu() {
		menuOpen = !menuOpen;
	}
	
	function toggleDarkMode() {
		darkMode = !darkMode;
	}
</script>

<div class="app" class:dark={darkMode}>
	<!-- Mobile Header -->
	<header class="mobile-header">
		<button class="menu-btn" on:click={toggleMenu}>☰</button>
		<div class="header-title">
			<span class="icon">📁</span>
			<span>{menuItems.find(item => item.path === $page.url.pathname)?.label || '鋒兄管理系統'}</span>
		</div>
		<button class="theme-btn" on:click={toggleDarkMode}>🌙</button>
	</header>

	<!-- Desktop Sidebar -->
	<aside class="sidebar" class:open={menuOpen}>
		<div class="sidebar-header">
			<div class="logo">
				<span class="logo-icon">📁</span>
				<span class="logo-text">鋒兄管理系統</span>
			</div>
			<p class="subtitle">PROFESSIONAL MANAGEMENT</p>
		</div>
		
		<nav class="nav">
			{#each menuItems as item}
				<a 
					href={item.path} 
					class="nav-item" 
					class:active={$page.url.pathname === item.path}
					on:click={() => menuOpen = false}
				>
					<span class="nav-icon">{item.icon}</span>
					<span class="nav-label">{item.label}</span>
				</a>
			{/each}
		</nav>
	</aside>

	<!-- Overlay for mobile -->
	{#if menuOpen}
		<div class="overlay" on:click={toggleMenu}></div>
	{/if}

	<!-- Main Content -->
	<main class="main-content">
		<slot />
	</main>
	
	<!-- FAB Button -->
	<button class="fab">+</button>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft JhengHei', sans-serif;
		background: #f5f5f5;
	}
	
	.app {
		min-height: 100vh;
		display: flex;
	}
	
	.app.dark {
		background: #1a1a1a;
		color: #fff;
	}
	
	/* Mobile Header */
	.mobile-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 56px;
		background: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		z-index: 100;
	}
	
	.menu-btn, .theme-btn {
		background: none;
		border: none;
		font-size: 24px;
		cursor: pointer;
		padding: 8px;
	}
	
	.header-title {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 18px;
		font-weight: 600;
		color: #5b7cff;
	}
	
	/* Sidebar */
	.sidebar {
		position: fixed;
		left: -280px;
		top: 0;
		bottom: 0;
		width: 280px;
		background: #2c3e50;
		color: white;
		transition: left 0.3s;
		z-index: 200;
		overflow-y: auto;
	}
	
	.sidebar.open {
		left: 0;
	}
	
	.sidebar-header {
		padding: 24px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}
	
	.logo {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 8px;
	}
	
	.logo-icon {
		font-size: 32px;
	}
	
	.subtitle {
		margin: 0;
		font-size: 11px;
		opacity: 0.9;
		letter-spacing: 1px;
	}
	
	.nav {
		padding: 16px 0;
	}
	
	.nav-item {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 16px 24px;
		color: rgba(255,255,255,0.8);
		text-decoration: none;
		transition: all 0.2s;
	}
	
	.nav-item:hover {
		background: rgba(255,255,255,0.1);
		color: white;
	}
	
	.nav-item.active {
		background: #5b7cff;
		color: white;
	}
	
	.nav-icon {
		font-size: 20px;
	}
	
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.5);
		z-index: 150;
	}
	
	/* Main Content */
	.main-content {
		flex: 1;
		padding: 72px 16px 80px;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}
	
	/* FAB */
	.fab {
		position: fixed;
		bottom: 24px;
		right: 24px;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		font-size: 32px;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
		z-index: 50;
	}
	
	/* Desktop */
	@media (min-width: 768px) {
		.mobile-header {
			display: none;
		}
		
		.sidebar {
			left: 0;
			width: 240px;
		}
		
		.main-content {
			margin-left: 240px;
			padding: 32px;
		}
		
		.overlay {
			display: none;
		}
	}
</style>
