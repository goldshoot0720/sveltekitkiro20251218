<script>
	import { onMount } from 'svelte';
	
	let stats = {
		videos: 0,
		images: 0,
		totalSize: '0 MB'
	};
	
	let loading = true;
	
	onMount(async () => {
		await loadStats();
	});
	
	async function loadStats() {
		try {
			// 載入圖片統計
			const imagesResponse = await fetch('/api/images');
			const imagesData = await imagesResponse.json();
			
			if (imagesData.success) {
				stats.images = imagesData.total;
			}
			
			// 影片數量暫時硬編碼，可以後續添加 API
			stats.videos = 2;
			stats.totalSize = '150 MB';
			
			loading = false;
		} catch (error) {
			console.error('載入統計失敗:', error);
			loading = false;
		}
	}
</script>

<div class="home-page">
	<div class="hero-section">
		<div class="hero-content">
			<h1 class="hero-title">
				<span class="hero-icon">🤖</span>
				鋒兄AI資訊系統
			</h1>
			<p class="hero-description">
				集中管理您的影片和圖片收藏，支援智能分類和快速搜尋
			</p>
			
			<div class="hero-footer">
				<div class="copyright">
					<p class="copyright-text">鋒兄塗哥公關資訊© 版權所有 2025～2125</p>
				</div>
				
				<div class="tech-info">
					<div class="tech-stack">
						<div class="tech-item">
							<span class="tech-icon">⚡</span>
							<span class="tech-label">前端：Svelte (SvelteKit)</span>
						</div>
						<div class="tech-item">
							<span class="tech-icon">🗄️</span>
							<span class="tech-label">後端：Sanity</span>
						</div>
						<div class="tech-item">
							<span class="tech-icon">🌐</span>
							<span class="tech-label">網頁存放：DigitalOcean</span>
						</div>
						<div class="tech-item">
							<span class="tech-icon">🎬</span>
							<span class="tech-label">影片存放：Sanity</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="stats-section">
		<div class="stats-container">
			<h2 class="section-title">📊 媒體統計</h2>
			
			{#if loading}
				<div class="loading">
					<div class="loading-spinner">⏳</div>
					<p>載入統計中...</p>
				</div>
			{:else}
				<div class="stats-grid">
					<div class="stat-card videos">
						<div class="stat-icon">🎬</div>
						<div class="stat-content">
							<div class="stat-number">{stats.videos}</div>
							<div class="stat-label">影片</div>
						</div>
					</div>
					
					<div class="stat-card images">
						<div class="stat-icon">🖼️</div>
						<div class="stat-content">
							<div class="stat-number">{stats.images}</div>
							<div class="stat-label">圖片</div>
						</div>
					</div>
					
					<div class="stat-card storage">
						<div class="stat-icon">💾</div>
						<div class="stat-content">
							<div class="stat-number">{stats.totalSize}</div>
							<div class="stat-label">總大小</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="features-section">
		<div class="features-container">
			<h2 class="section-title">✨ 功能特色</h2>
			
			<div class="features-grid">
				<div class="feature-card">
					<div class="feature-icon">🎬</div>
					<h3 class="feature-title">影片管理</h3>
					<p class="feature-description">
						支援多種影片格式，提供線上播放和快取管理功能
					</p>
					<a href="/videos" class="feature-link">
						前往影片庫 →
					</a>
				</div>
				
				<div class="feature-card">
					<div class="feature-icon">🖼️</div>
					<h3 class="feature-title">圖片庫</h3>
					<p class="feature-description">
						智能分類您的圖片，支援快速搜尋和全螢幕預覽
					</p>
					<a href="/gallery" class="feature-link">
						前往圖片庫 →
					</a>
				</div>
				
				<div class="feature-card">
					<div class="feature-icon">🔍</div>
					<h3 class="feature-title">智能搜尋</h3>
					<p class="feature-description">
						根據檔名、分類和內容快速找到您需要的媒體文件
					</p>
				</div>
				
				<div class="feature-card">
					<div class="feature-icon">📱</div>
					<h3 class="feature-title">響應式設計</h3>
					<p class="feature-description">
						完美適配桌面和行動裝置，隨時隨地管理您的媒體
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="quick-actions">
		<div class="actions-container">
			<h2 class="section-title">🚀 快速操作</h2>
			
			<div class="actions-grid">
				<a href="/videos" class="action-btn primary">
					<span class="action-icon">🎬</span>
					<span class="action-text">瀏覽影片</span>
				</a>
				
				<a href="/gallery" class="action-btn secondary">
					<span class="action-icon">🖼️</span>
					<span class="action-text">瀏覽圖片</span>
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	.home-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}
	
	.hero-section {
		text-align: center;
		padding: 60px 0;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		margin: -20px -20px 40px -20px;
		border-radius: 0 0 32px 32px;
		color: white;
	}
	
	.hero-content {
		max-width: 600px;
		margin: 0 auto;
		padding: 0 20px;
	}
	
	.hero-title {
		font-size: 48px;
		font-weight: 700;
		margin: 0 0 20px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
	}
	
	.hero-icon {
		font-size: 56px;
	}
	
	.hero-description {
		font-size: 18px;
		margin: 0 0 32px 0;
		opacity: 0.9;
		line-height: 1.6;
	}
	
	.hero-footer {
		margin-top: 24px;
		padding-top: 24px;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
	}
	
	.copyright {
		margin-bottom: 20px;
	}
	
	.copyright-text {
		font-size: 14px;
		margin: 0;
		opacity: 0.8;
		font-weight: 500;
	}
	
	.tech-info {
		margin-top: 16px;
	}
	
	.tech-stack {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 12px;
		max-width: 800px;
		margin: 0 auto;
	}
	
	.tech-item {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 8px 16px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 20px;
		backdrop-filter: blur(10px);
		font-size: 13px;
		opacity: 0.9;
	}
	
	.tech-icon {
		font-size: 16px;
	}
	
	.tech-label {
		font-weight: 500;
		white-space: nowrap;
	}
	
	.stats-section {
		margin-bottom: 60px;
	}
	
	.stats-container {
		background: white;
		padding: 40px;
		border-radius: 24px;
		box-shadow: 0 4px 16px rgba(0,0,0,0.1);
	}
	
	.section-title {
		text-align: center;
		font-size: 28px;
		margin: 0 0 32px 0;
		color: #2c3e50;
	}
	
	.loading {
		text-align: center;
		padding: 40px;
		color: #7f8c8d;
	}
	
	.loading-spinner {
		font-size: 48px;
		margin-bottom: 16px;
		animation: spin 2s linear infinite;
	}
	
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 24px;
	}
	
	.stat-card {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 24px;
		border-radius: 16px;
		transition: transform 0.3s;
	}
	
	.stat-card:hover {
		transform: translateY(-4px);
	}
	
	.stat-card.videos {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}
	
	.stat-card.images {
		background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
		color: white;
	}
	
	.stat-card.storage {
		background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
		color: white;
	}
	
	.stat-icon {
		font-size: 48px;
		flex-shrink: 0;
	}
	
	.stat-content {
		flex: 1;
	}
	
	.stat-number {
		font-size: 32px;
		font-weight: 700;
		margin-bottom: 4px;
	}
	
	.stat-label {
		font-size: 16px;
		opacity: 0.9;
	}
	
	.features-section {
		margin-bottom: 60px;
	}
	
	.features-container {
		background: white;
		padding: 40px;
		border-radius: 24px;
		box-shadow: 0 4px 16px rgba(0,0,0,0.1);
	}
	
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 24px;
	}
	
	.feature-card {
		padding: 32px 24px;
		border: 2px solid #f1f3f4;
		border-radius: 16px;
		text-align: center;
		transition: all 0.3s;
	}
	
	.feature-card:hover {
		border-color: #667eea;
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
	}
	
	.feature-icon {
		font-size: 48px;
		margin-bottom: 16px;
	}
	
	.feature-title {
		font-size: 20px;
		font-weight: 600;
		margin: 0 0 12px 0;
		color: #2c3e50;
	}
	
	.feature-description {
		font-size: 14px;
		color: #7f8c8d;
		line-height: 1.6;
		margin: 0 0 20px 0;
	}
	
	.feature-link {
		display: inline-block;
		color: #667eea;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}
	
	.feature-link:hover {
		color: #5a6fd8;
	}
	
	.quick-actions {
		margin-bottom: 40px;
	}
	
	.actions-container {
		background: white;
		padding: 40px;
		border-radius: 24px;
		box-shadow: 0 4px 16px rgba(0,0,0,0.1);
	}
	
	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 20px;
	}
	
	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 20px 32px;
		border-radius: 16px;
		text-decoration: none;
		font-weight: 600;
		font-size: 16px;
		transition: all 0.3s;
	}
	
	.action-btn.primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}
	
	.action-btn.secondary {
		background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
		color: white;
	}
	
	.action-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0,0,0,0.15);
	}
	
	.action-icon {
		font-size: 24px;
	}
	
	@media (max-width: 768px) {
		.home-page {
			padding: 0 16px;
		}
		
		.hero-section {
			padding: 40px 0;
			margin: -16px -16px 32px -16px;
		}
		
		.hero-title {
			font-size: 36px;
			flex-direction: column;
			gap: 8px;
		}
		
		.hero-icon {
			font-size: 48px;
		}
		
		.hero-description {
			font-size: 16px;
		}
		
		.tech-stack {
			grid-template-columns: 1fr;
			gap: 8px;
		}
		
		.tech-item {
			padding: 6px 12px;
			font-size: 12px;
		}
		
		.tech-icon {
			font-size: 14px;
		}
		
		.copyright-text {
			font-size: 12px;
		}
		
		.stats-container,
		.features-container,
		.actions-container {
			padding: 24px;
		}
		
		.section-title {
			font-size: 24px;
		}
		
		.stats-grid {
			grid-template-columns: 1fr;
		}
		
		.stat-card {
			padding: 20px;
		}
		
		.stat-icon {
			font-size: 40px;
		}
		
		.stat-number {
			font-size: 28px;
		}
		
		.features-grid {
			grid-template-columns: 1fr;
		}
		
		.feature-card {
			padding: 24px 20px;
		}
		
		.actions-grid {
			grid-template-columns: 1fr;
		}
	}
</style>