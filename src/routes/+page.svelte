<script>
	let subscriptionCount = 0;
	let foodCount = 0;
	let totalCost = 0;
</script>

<div class="dashboard">
	<div class="hero-card">
		<div class="hero-icon">🏢</div>
		<h1>鋒兄塗哥公開資訊</h1>
		<p class="subtitle">PROFESSIONAL BUSINESS SOLUTIONS</p>
		<p class="copyright">©版權所有 2025～2125 | 專業管理系統解決方案</p>
		<p class="tech-stack">
			前端使用Svelte（SvelteKit） | 後端使用 Sanity | 影片存放於 Sanity | 
			網頁存放於 DigitalOcean（App Platform）
		</p>
	</div>

	<h2 class="section-title">鋒兄儀表板</h2>

	<div class="stats-grid">
		<div class="stat-card blue">
			<div class="stat-icon">📋</div>
			<div class="stat-content">
				<h3>訂閱數量</h3>
				<div class="stat-value">{subscriptionCount}</div>
				<div class="stat-label">項目</div>
			</div>
			<button class="stat-action">✏️</button>
		</div>

		<div class="stat-card green">
			<div class="stat-icon">🍱</div>
			<div class="stat-content">
				<h3>食物庫存</h3>
				<div class="stat-value">{foodCount}</div>
				<div class="stat-label">項目</div>
			</div>
			<button class="stat-action">📊</button>
		</div>

		<div class="stat-card orange">
			<div class="stat-icon">💰</div>
			<div class="stat-content">
				<h3>每月總計</h3>
				<div class="stat-value">NT$ {totalCost}</div>
				<div class="stat-label">約定總計</div>
			</div>
			<button class="stat-action">🗑️</button>
		</div>
	</div>
</div>

<style>
	.dashboard {
		max-width: 800px;
		margin: 0 auto;
	}

	.hero-card {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 48px 32px;
		border-radius: 24px;
		text-align: center;
		margin-bottom: 32px;
		box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
	}

	.hero-icon {
		font-size: 64px;
		margin-bottom: 16px;
	}

	.hero-card h1 {
		margin: 0 0 8px 0;
		font-size: 28px;
	}

	.subtitle {
		font-size: 12px;
		letter-spacing: 2px;
		opacity: 0.9;
		margin: 0 0 16px 0;
	}

	.copyright {
		font-size: 14px;
		margin: 0 0 8px 0;
	}

	.tech-stack {
		font-size: 12px;
		opacity: 0.85;
		margin: 0;
		line-height: 1.6;
	}

	.section-title {
		font-size: 24px;
		margin: 32px 0 24px 0;
		color: #2c3e50;
	}

	.stats-grid {
		display: grid;
		gap: 20px;
		grid-template-columns: 1fr;
	}

	.stat-card {
		background: white;
		border-radius: 16px;
		padding: 24px;
		display: flex;
		align-items: center;
		gap: 16px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
		position: relative;
	}

	.stat-icon {
		font-size: 48px;
		width: 72px;
		height: 72px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 16px;
	}

	.stat-card.blue .stat-icon {
		background: #e3f2fd;
	}

	.stat-card.green .stat-icon {
		background: #e8f5e9;
	}

	.stat-card.orange .stat-icon {
		background: #fff3e0;
	}

	.stat-content {
		flex: 1;
	}

	.stat-content h3 {
		margin: 0 0 8px 0;
		font-size: 14px;
		color: #666;
	}

	.stat-value {
		font-size: 28px;
		font-weight: 700;
		margin-bottom: 4px;
	}

	.stat-card.blue .stat-value {
		color: #2196f3;
	}

	.stat-card.green .stat-value {
		color: #4caf50;
	}

	.stat-card.orange .stat-value {
		color: #ff9800;
	}

	.stat-label {
		font-size: 12px;
		color: #999;
	}

	.stat-action {
		background: none;
		border: none;
		font-size: 20px;
		cursor: pointer;
		padding: 8px;
		opacity: 0.6;
		transition: opacity 0.2s;
	}

	.stat-action:hover {
		opacity: 1;
	}

	@media (min-width: 768px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
