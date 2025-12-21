<script>
	import { onMount } from 'svelte';
	
	let subscriptions = [];
	let foods = [];
	let loading = true;
	let error = null;
	
	// 從真實 API 獲取數據
	onMount(async () => {
		await loadData();
	});
	
	async function loadData() {
		try {
			loading = true;
			error = null;
			
			// 並行獲取訂閱和食品數據
			const [subscriptionsResponse, foodsResponse] = await Promise.all([
				fetch('/api/subscriptions'),
				fetch('/api/foods')
			]);
			
			if (subscriptionsResponse.ok) {
				subscriptions = await subscriptionsResponse.json();
			} else {
				console.warn('Failed to fetch subscriptions:', subscriptionsResponse.status);
				subscriptions = [];
			}
			
			if (foodsResponse.ok) {
				foods = await foodsResponse.json();
			} else {
				console.warn('Failed to fetch foods:', foodsResponse.status);
				foods = [];
			}
			
			loading = false;
		} catch (err) {
			console.error('Error loading data:', err);
			error = err.message;
			loading = false;
		}
	}
	
	// 計算即將到期的項目
	function getItemsExpiringSoon(items, dateField, days) {
		const now = new Date();
		const targetDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
		
		return items.filter(item => {
			const itemDate = new Date(item[dateField]);
			return itemDate <= targetDate && itemDate >= now;
		});
	}
	
	// 格式化日期
	function formatDate(date) {
		if (!date) return '未設定';
		return new Date(date).toLocaleDateString('zh-TW', {
			month: 'short',
			day: 'numeric'
		});
	}
	
	// 計算距離天數
	function getDaysUntil(date) {
		if (!date) return 0;
		const now = new Date();
		const target = new Date(date);
		const diffTime = target - now;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}
	
	// 使用真實數據結構的響應式計算
	$: subscriptionsIn3Days = getItemsExpiringSoon(subscriptions, 'nextdate', 3);
	$: subscriptionsIn7Days = getItemsExpiringSoon(subscriptions, 'nextdate', 7);
	$: foodsIn7Days = getItemsExpiringSoon(foods, 'todate', 7);
	$: foodsIn30Days = getItemsExpiringSoon(foods, 'todate', 30);
</script>

<svelte:head>
	<title>儀表板 - 鋒兄AI資訊系統</title>
</svelte:head>

<div class="dashboard">
	<div class="container">
		<header class="dashboard-header">
			<h1>📊 儀表板</h1>
			<p>系統概覽與重要提醒</p>
		</header>
		
		{#if loading}
			<div class="loading">
				<div class="spinner"></div>
				<p>載入中...</p>
			</div>
		{:else if error}
			<div class="error">
				<p>載入數據時發生錯誤: {error}</p>
				<button class="retry-btn" on:click={loadData}>重新載入</button>
			</div>
		{:else}
			<!-- 統計卡片 -->
			<div class="stats-grid">
				<div class="stat-card">
					<div class="stat-icon">💳</div>
					<div class="stat-content">
						<h3>訂閱服務</h3>
						<div class="stat-number">{subscriptions.length}</div>
						<p>個活躍訂閱</p>
					</div>
				</div>
				
				<div class="stat-card">
					<div class="stat-icon">🍽️</div>
					<div class="stat-content">
						<h3>食品項目</h3>
						<div class="stat-number">{foods.length}</div>
						<p>個食品項目</p>
					</div>
				</div>
				
				<div class="stat-card urgent">
					<div class="stat-icon">⚠️</div>
					<div class="stat-content">
						<h3>緊急提醒</h3>
						<div class="stat-number">{subscriptionsIn3Days.length + foodsIn7Days.length}</div>
						<p>個項目需注意</p>
					</div>
				</div>
				
				<div class="stat-card warning">
					<div class="stat-icon">📅</div>
					<div class="stat-content">
						<h3>近期提醒</h3>
						<div class="stat-number">{subscriptionsIn7Days.length + foodsIn30Days.length}</div>
						<p>個項目需關注</p>
					</div>
				</div>
			</div>
			
			<!-- 主要內容區域 -->
			<div class="content-grid">
				<!-- 訂閱管理區塊 -->
				<div class="content-section">
					<div class="section-header">
						<h2>💳 訂閱管理</h2>
						<a href="/subscriptions" class="view-all-btn">查看全部</a>
					</div>
					
					<div class="alert-sections">
						{#if subscriptionsIn3Days.length > 0}
							<div class="alert-group urgent">
								<h3>🚨 3天內付款 ({subscriptionsIn3Days.length})</h3>
								<div class="item-list">
									{#each subscriptionsIn3Days as subscription}
										<div class="item-card urgent">
											<div class="item-info">
												<h4>{subscription.name}</h4>
												<p>下次付款: {formatDate(subscription.nextdate)}</p>
												<p class="amount">NT$ {subscription.price || 0}</p>
											</div>
											<div class="item-status">
												<span class="days-badge urgent">{getDaysUntil(subscription.nextdate)}天</span>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
						
						{#if subscriptionsIn7Days.length > 0}
							<div class="alert-group warning">
								<h3>📅 7天內付款 ({subscriptionsIn7Days.length})</h3>
								<div class="item-list">
									{#each subscriptionsIn7Days as subscription}
										<div class="item-card warning">
											<div class="item-info">
												<h4>{subscription.name}</h4>
												<p>下次付款: {formatDate(subscription.nextdate)}</p>
												<p class="amount">NT$ {subscription.price || 0}</p>
											</div>
											<div class="item-status">
												<span class="days-badge warning">{getDaysUntil(subscription.nextdate)}天</span>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
				
				<!-- 食品管理區塊 -->
				<div class="content-section">
					<div class="section-header">
						<h2>🍽️ 食品管理</h2>
						<a href="/foods" class="view-all-btn">查看全部</a>
					</div>
					
					<div class="alert-sections">
						{#if foodsIn7Days.length > 0}
							<div class="alert-group urgent">
								<h3>🚨 7天內到期 ({foodsIn7Days.length})</h3>
								<div class="item-list">
									{#each foodsIn7Days as food}
										<div class="item-card urgent">
											<div class="item-info">
												<h4>{food.name}</h4>
												<p>保存期限: {formatDate(food.todate)}</p>
												<p class="category">{food.shop || '未知來源'} × {food.amount || 1}</p>
											</div>
											<div class="item-status">
												<span class="days-badge urgent">{getDaysUntil(food.todate)}天</span>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
						
						{#if foodsIn30Days.length > 0}
							<div class="alert-group warning">
								<h3>📅 30天內到期 ({foodsIn30Days.length})</h3>
								<div class="item-list">
									{#each foodsIn30Days as food}
										<div class="item-card warning">
											<div class="item-info">
												<h4>{food.name}</h4>
												<p>保存期限: {formatDate(food.todate)}</p>
												<p class="category">{food.shop || '未知來源'} × {food.amount || 1}</p>
											</div>
											<div class="item-status">
												<span class="days-badge warning">{getDaysUntil(food.todate)}天</span>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.dashboard {
		min-height: 100vh;
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
	}
	
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}
	
	.dashboard-header {
		text-align: center;
		margin-bottom: 40px;
	}
	
	.dashboard-header h1 {
		font-size: 2.5rem;
		margin: 0 0 10px 0;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.dashboard-header p {
		color: #666;
		font-size: 1.1rem;
		margin: 0;
	}
	
	.loading, .error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
		color: #666;
	}
	
	.error {
		color: #e74c3c;
	}
	
	.retry-btn {
		margin-top: 16px;
		padding: 10px 20px;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 14px;
		transition: background-color 0.3s;
	}
	
	.retry-btn:hover {
		background: #5a67d8;
	}
	
	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #667eea;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 20px;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		margin-bottom: 40px;
	}
	
	.stat-card {
		background: white;
		border-radius: 16px;
		padding: 24px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		gap: 20px;
		transition: transform 0.3s, box-shadow 0.3s;
	}
	
	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
	}
	
	.stat-card.urgent {
		border-left: 4px solid #e74c3c;
	}
	
	.stat-card.warning {
		border-left: 4px solid #f39c12;
	}
	
	.stat-icon {
		font-size: 2.5rem;
		flex-shrink: 0;
	}
	
	.stat-content h3 {
		margin: 0 0 8px 0;
		color: #2c3e50;
		font-size: 1rem;
		font-weight: 600;
	}
	
	.stat-number {
		font-size: 2rem;
		font-weight: 700;
		color: #667eea;
		margin: 0;
	}
	
	.stat-content p {
		margin: 4px 0 0 0;
		color: #666;
		font-size: 0.9rem;
	}
	
	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 30px;
	}
	
	.content-section {
		background: white;
		border-radius: 16px;
		padding: 24px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		padding-bottom: 16px;
		border-bottom: 2px solid #f8f9fa;
	}
	
	.section-header h2 {
		margin: 0;
		color: #2c3e50;
		font-size: 1.4rem;
	}
	
	.view-all-btn {
		color: #667eea;
		text-decoration: none;
		font-weight: 500;
		padding: 8px 16px;
		border-radius: 8px;
		transition: background-color 0.3s;
	}
	
	.view-all-btn:hover {
		background-color: #f8f9ff;
	}
	
	.alert-sections {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	
	.alert-group h3 {
		margin: 0 0 16px 0;
		font-size: 1.1rem;
		font-weight: 600;
	}
	
	.alert-group.urgent h3 {
		color: #e74c3c;
	}
	
	.alert-group.warning h3 {
		color: #f39c12;
	}
	
	.item-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	
	.item-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px;
		border-radius: 12px;
		border: 1px solid #e9ecef;
		transition: all 0.3s;
	}
	
	.item-card:hover {
		transform: translateX(4px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
	
	.item-card.urgent {
		border-left: 4px solid #e74c3c;
		background: #fdf2f2;
	}
	
	.item-card.warning {
		border-left: 4px solid #f39c12;
		background: #fef9f3;
	}
	
	.item-info h4 {
		margin: 0 0 4px 0;
		color: #2c3e50;
		font-size: 1rem;
		font-weight: 600;
	}
	
	.item-info p {
		margin: 2px 0;
		color: #666;
		font-size: 0.9rem;
	}
	
	.amount {
		font-weight: 600;
		color: #27ae60 !important;
	}
	
	.category {
		color: #8e44ad !important;
	}
	
	.days-badge {
		padding: 6px 12px;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 600;
		color: white;
	}
	
	.days-badge.urgent {
		background: #e74c3c;
	}
	
	.days-badge.warning {
		background: #f39c12;
	}
	
	@media (max-width: 768px) {
		.container {
			padding: 16px;
		}
		
		.dashboard-header h1 {
			font-size: 2rem;
		}
		
		.stats-grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}
		
		.content-grid {
			grid-template-columns: 1fr;
			gap: 20px;
		}
		
		.stat-card {
			padding: 20px;
		}
		
		.content-section {
			padding: 20px;
		}
		
		.section-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}
		
		.item-card {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}
		
		.item-status {
			align-self: flex-end;
		}
	}
</style>