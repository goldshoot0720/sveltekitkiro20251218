<script>
	import { page } from '$app/stores';
	
	$: currentPath = $page.url.pathname;
</script>

<nav class="main-nav">
	<div class="nav-container">
		<div class="nav-brand">
			<a href="/" class="brand-link">
				<span class="brand-icon">🤖</span>
				<span class="brand-text">鋒兄AI資訊系統</span>
			</a>
		</div>
		
		<div class="nav-links">
			<a 
				href="/dashboard" 
				class="nav-link {currentPath === '/dashboard' ? 'active' : ''}"
			>
				<span class="nav-icon">📊</span>
				<span class="nav-text">儀表板</span>
			</a>
			
			<a 
				href="/videos" 
				class="nav-link {currentPath === '/videos' ? 'active' : ''}"
			>
				<span class="nav-icon">🎬</span>
				<span class="nav-text">影片庫</span>
			</a>
			
			<a 
				href="/gallery" 
				class="nav-link {currentPath === '/gallery' ? 'active' : ''}"
			>
				<span class="nav-icon">🖼️</span>
				<span class="nav-text">圖片庫</span>
			</a>
			
			<a 
				href="/subscriptions" 
				class="nav-link {currentPath === '/subscriptions' ? 'active' : ''}"
			>
				<span class="nav-icon">💳</span>
				<span class="nav-text">訂閱管理</span>
			</a>
			
			<a 
				href="/foods" 
				class="nav-link {currentPath === '/foods' ? 'active' : ''}"
			>
				<span class="nav-icon">🍽️</span>
				<span class="nav-text">食品管理</span>
			</a>
		</div>
	</div>
</nav>

<style>
	.main-nav {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		box-shadow: 0 2px 12px rgba(102, 126, 234, 0.3);
		position: sticky;
		top: 0;
		z-index: 100;
	}
	
	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
	}
	
	.nav-brand {
		flex-shrink: 0;
	}
	
	.brand-link {
		display: flex;
		align-items: center;
		gap: 12px;
		text-decoration: none;
		color: white;
		font-weight: 700;
		font-size: 20px;
		transition: opacity 0.2s;
	}
	
	.brand-link:hover {
		opacity: 0.9;
	}
	
	.brand-icon {
		font-size: 28px;
	}
	
	.brand-text {
		display: none;
	}
	
	.nav-links {
		display: flex;
		gap: 8px;
	}
	
	.nav-link {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 20px;
		border-radius: 12px;
		text-decoration: none;
		color: rgba(255, 255, 255, 0.8);
		font-weight: 500;
		transition: all 0.3s;
		position: relative;
		overflow: hidden;
	}
	
	.nav-link::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.1);
		opacity: 0;
		transition: opacity 0.3s;
	}
	
	.nav-link:hover::before {
		opacity: 1;
	}
	
	.nav-link:hover {
		color: white;
		transform: translateY(-1px);
	}
	
	.nav-link.active {
		background: rgba(255, 255, 255, 0.2);
		color: white;
		backdrop-filter: blur(10px);
	}
	
	.nav-link.active::before {
		opacity: 0;
	}
	
	.nav-icon {
		font-size: 20px;
	}
	
	.nav-text {
		font-size: 14px;
		white-space: nowrap;
	}
	
	@media (min-width: 640px) {
		.brand-text {
			display: block;
		}
		
		.nav-text {
			font-size: 16px;
		}
		
		.nav-link {
			padding: 12px 24px;
		}
	}
	
	@media (max-width: 480px) {
		.nav-container {
			padding: 0 16px;
		}
		
		.nav-links {
			gap: 4px;
		}
		
		.nav-link {
			padding: 10px 16px;
		}
		
		.nav-text {
			display: none;
		}
	}
</style>