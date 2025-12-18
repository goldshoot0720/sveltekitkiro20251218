<script>
	import { onMount } from 'svelte';
	
	let subscriptions = [];
	let totalMonthlySpend = 0;
	let loading = true;
	let error = null;
	let showAddModal = false;
	let editingSubscription = null;
	
	// 新增/編輯表單資料 - 匹配 Sanity schema
	let formData = {
		name: '',
		site: '',
		price: '',
		nextdate: '',
		note: '',
		account: ''
	};
	
	onMount(async () => {
		await loadSubscriptions();
	});
	
	async function loadSubscriptions() {
		try {
			loading = true;
			const response = await fetch('/api/subscriptions');
			if (!response.ok) throw new Error('Failed to fetch');
			subscriptions = await response.json();
			calculateTotalSpend();
			loading = false;
		} catch (err) {
			error = err.message;
			loading = false;
		}
	}
	
	async function saveSubscription() {
		// 前端驗證 (只驗證必填字段)
		if (!formData.name.trim()) {
			alert('請輸入服務名稱');
			return;
		}
		
		if (!formData.nextdate) {
			alert('請選擇下次付款日期');
			return;
		}
		
		try {
			const method = editingSubscription ? 'PATCH' : 'POST';
			const body = editingSubscription 
				? { id: editingSubscription._id, ...formData }
				: formData;
			
			console.log('Sending data:', body); // Debug log
			
			const response = await fetch('/api/subscriptions', {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
			
			if (!response.ok) {
				const errorData = await response.json();
				console.error('API Error:', errorData); // Debug log
				
				if (response.status === 403) {
					alert(`權限不足: ${errorData.details}\n\n建議: ${errorData.suggestion || '請聯繫管理員更新 API Token 權限'}`);
				} else if (response.status === 400 && errorData.details) {
					// 顯示詳細的驗證錯誤
					const errors = Object.values(errorData.details).filter(Boolean);
					alert(`驗證錯誤:\n${errors.join('\n')}`);
				} else {
					alert('儲存失敗: ' + (errorData.error || 'Unknown error'));
				}
				return;
			}
			
			await loadSubscriptions();
			closeModal();
		} catch (err) {
			console.error('Save error:', err); // Debug log
			alert('儲存失敗: ' + err.message);
		}
	}
	
	async function deleteSubscriptionHandler(id) {
		if (!confirm('確定要刪除此訂閱嗎？')) return;
		
		try {
			const response = await fetch('/api/subscriptions', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});
			
			if (!response.ok) {
				const errorData = await response.json();
				
				if (response.status === 403) {
					alert(`權限不足: ${errorData.details}\n\n建議: ${errorData.suggestion || '請聯繫管理員更新 API Token 權限'}`);
				} else {
					throw new Error(errorData.error || 'Failed to delete');
				}
				return;
			}
			
			await loadSubscriptions();
		} catch (err) {
			alert('刪除失敗: ' + err.message);
		}
	}
	
	function openAddModal() {
		editingSubscription = null;
		formData = {
			name: '',
			site: '',
			price: '',
			nextdate: '',
			note: '',
			account: ''
		};
		showAddModal = true;
	}
	
	function openEditModal(subscription) {
		editingSubscription = subscription;
		formData = { ...subscription };
		showAddModal = true;
	}
	
	function closeModal() {
		showAddModal = false;
		editingSubscription = null;
	}
	
	function calculateTotalSpend() {
		totalMonthlySpend = subscriptions.reduce((total, sub) => {
			// 所有訂閱都視為啟用狀態，價格以 TWD 計算
			return total + (sub.price || 0);
		}, 0);
	}
	
	function getStatusColor(status) {
		switch (status) {
			case 'active': return '#10b981';
			case 'expired': return '#ef4444';
			case 'cancelled': return '#6b7280';
			case 'paused': return '#f59e0b';
			default: return '#6b7280';
		}
	}
	
	function getCategoryIcon(category) {
		switch (category) {
			case 'entertainment': return '🎬';
			case 'development': return '💻';
			case 'cloud': return '☁️';
			case 'education': return '📚';
			default: return '📦';
		}
	}
	
	function getDaysUntilRenewal(nextDate) {
		if (!nextDate) return 0;
		const today = new Date();
		const renewal = new Date(nextDate);
		const diffTime = renewal - today;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}
</script>

<svelte:head>
	<title>訂閱管理 - 鋒兄系統</title>
</svelte:head>

<div class="subscription-page">
	<div class="page-header">
		<h1>訂閱管理</h1>
		<p>管理您的所有訂閱服務</p>
	</div>

	{#if loading}
		<div class="loading">載入中...</div>
	{:else if error}
		<div class="error">錯誤: {error}</div>
	{:else}
		<!-- 統計卡片 -->
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-icon">💰</div>
				<div class="stat-content">
					<h3>每月總支出</h3>
					<p class="stat-value">NT$ {totalMonthlySpend.toLocaleString()}</p>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">📊</div>
				<div class="stat-content">
					<h3>訂閱總數</h3>
					<p class="stat-value">{subscriptions.length}</p>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">🚨</div>
				<div class="stat-content">
					<h3>3天內到期</h3>
					<p class="stat-value">
						{subscriptions.filter(s => {
							const days = getDaysUntilRenewal(s.nextdate);
							return days <= 3 && days > 0;
						}).length}
					</p>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">⏰</div>
				<div class="stat-content">
					<h3>7天內到期</h3>
					<p class="stat-value">
						{subscriptions.filter(s => {
							const days = getDaysUntilRenewal(s.nextdate);
							return days <= 7 && days > 0;
						}).length}
					</p>
				</div>
			</div>
		</div>

		<!-- 訂閱列表 -->
		<div class="subscriptions-grid">
			{#each subscriptions as subscription}
				<div class="subscription-card">
					<div class="card-header">
						<div class="service-info">
							<span class="category-icon">{getCategoryIcon(subscription.category)}</span>
							<div>
								<h3 class="service-name">{subscription.name}</h3>
								{#if subscription.site}
									<a href={subscription.site} target="_blank" class="service-url">
										{subscription.site}
									</a>
								{/if}
							</div>
						</div>
						<div class="status-badge active">
							啟用中
						</div>
					</div>
					
					<div class="card-content">
						<div class="price-info">
							<span class="price">
								NT$ {subscription.price || 0}
								<span class="billing-cycle">/月</span>
							</span>
						</div>
						
						<div class="renewal-info">
							<span class="next-date">
								下次付款: {subscription.nextdate || '未設定'}
							</span>
							<span class="days-left">
								{#if subscription.nextdate}
									{#if getDaysUntilRenewal(subscription.nextdate) > 0}
										還有 {getDaysUntilRenewal(subscription.nextdate)} 天
									{:else}
										已過期
									{/if}
								{:else}
									無到期日
								{/if}
							</span>
						</div>
						
						{#if subscription.account}
							<div class="account-info">
								<span class="account-label">帳戶:</span>
								{subscription.account}
							</div>
						{/if}
						
						{#if subscription.note}
							<div class="note">
								<span class="note-label">備註:</span>
								{subscription.note}
							</div>
						{/if}
					</div>
					
					<div class="card-actions">
						<button class="btn-edit" on:click={() => openEditModal(subscription)}>編輯</button>
						<button class="btn-cancel" on:click={() => deleteSubscriptionHandler(subscription._id)}>刪除</button>
					</div>
				</div>
			{/each}
		</div>
		
		<div class="add-subscription">
			<button class="btn-add" on:click={openAddModal}>+ 新增訂閱</button>
		</div>
	{/if}
</div>

<!-- 新增/編輯訂閱模態視窗 -->
{#if showAddModal}
	<div class="modal-overlay" on:click={closeModal}>
		<div class="modal-content" on:click|stopPropagation>
			<div class="modal-header">
				<h2>{editingSubscription ? '編輯訂閱' : '新增訂閱'}</h2>
				<button class="close-btn" on:click={closeModal}>✕</button>
			</div>
			
			<form class="subscription-form" on:submit|preventDefault={saveSubscription}>
				<div class="form-row">
					<div class="form-group">
						<label for="name">服務名稱 *</label>
						<input type="text" id="name" bind:value={formData.name} required />
					</div>
					
					<div class="form-group">
						<label for="site">服務網址</label>
						<input type="url" id="site" bind:value={formData.site} />
					</div>
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="price">價格</label>
						<input type="number" id="price" bind:value={formData.price} min="0" step="1" />
					</div>
					
					<div class="form-group">
						<label for="nextdate">下次付款日期 *</label>
						<input type="date" id="nextdate" bind:value={formData.nextdate} required />
					</div>
				</div>
				
				<div class="form-group">
					<label for="account">帳戶資訊</label>
					<input type="text" id="account" bind:value={formData.account} placeholder="帳戶名稱或相關資訊" />
				</div>
				
				<div class="form-group">
					<label for="note">備註</label>
					<textarea id="note" bind:value={formData.note} rows="3" placeholder="其他相關資訊或備註"></textarea>
				</div>
				
				<div class="form-actions">
					<button type="button" class="btn-secondary" on:click={closeModal}>取消</button>
					<button type="submit" class="btn-primary">儲存</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.subscription-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}
	
	.page-header {
		text-align: center;
		margin-bottom: 40px;
	}
	
	.page-header h1 {
		margin: 0 0 8px 0;
		color: #1f2937;
		font-size: 32px;
	}
	
	.page-header p {
		margin: 0;
		color: #6b7280;
		font-size: 16px;
	}
	
	.loading, .error {
		text-align: center;
		padding: 40px;
		font-size: 18px;
	}
	
	.error {
		color: #ef4444;
	}
	
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		margin-bottom: 40px;
	}
	
	.stat-card {
		background: white;
		padding: 24px;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
		display: flex;
		align-items: center;
		gap: 16px;
	}
	
	.stat-icon {
		font-size: 32px;
		background: #f3f4f6;
		padding: 12px;
		border-radius: 8px;
	}
	
	.stat-content h3 {
		margin: 0 0 4px 0;
		color: #6b7280;
		font-size: 14px;
		font-weight: 500;
	}
	
	.stat-value {
		margin: 0;
		color: #1f2937;
		font-size: 24px;
		font-weight: 700;
	}
	
	.subscriptions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 24px;
		margin-bottom: 40px;
	}
	
	.subscription-card {
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 12px rgba(0,0,0,0.1);
		overflow: hidden;
		transition: transform 0.2s, box-shadow 0.2s;
	}
	
	.subscription-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0,0,0,0.15);
	}
	
	.card-header {
		padding: 20px 20px 0 20px;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
	
	.service-info {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 1;
	}
	
	.category-icon {
		font-size: 24px;
	}
	
	.service-name {
		margin: 0 0 4px 0;
		color: #1f2937;
		font-size: 18px;
		font-weight: 600;
	}
	
	.service-url {
		color: #3b82f6;
		text-decoration: none;
		font-size: 12px;
	}
	
	.service-url:hover {
		text-decoration: underline;
	}
	
	.status-badge {
		color: white;
		padding: 4px 8px;
		border-radius: 6px;
		font-size: 12px;
		font-weight: 500;
		text-transform: uppercase;
	}
	
	.card-content {
		padding: 20px;
	}
	
	.price-info {
		margin-bottom: 16px;
	}
	
	.price {
		color: #1f2937;
		font-size: 20px;
		font-weight: 700;
	}
	
	.billing-cycle {
		color: #6b7280;
		font-size: 14px;
		font-weight: 400;
	}
	
	.renewal-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
		font-size: 14px;
	}
	
	.next-date {
		color: #6b7280;
	}
	
	.days-left {
		color: #059669;
		font-weight: 500;
	}
	
	.account-info {
		background: #eff6ff;
		padding: 8px 12px;
		border-radius: 6px;
		margin-bottom: 8px;
		font-size: 14px;
		color: #1e40af;
	}
	
	.account-label {
		font-weight: 500;
		color: #1e40af;
	}
	
	.note {
		background: #f9fafb;
		padding: 12px;
		border-radius: 8px;
		margin-bottom: 12px;
		font-size: 14px;
		color: #4b5563;
	}
	
	.note-label {
		font-weight: 500;
		color: #374151;
	}
	

	
	.card-actions {
		padding: 0 20px 20px 20px;
		display: flex;
		gap: 12px;
	}
	
	.btn-edit, .btn-cancel {
		flex: 1;
		padding: 8px 16px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		background: white;
		cursor: pointer;
		font-size: 14px;
		transition: all 0.2s;
	}
	
	.btn-edit:hover {
		background: #f3f4f6;
		border-color: #9ca3af;
	}
	
	.btn-cancel {
		color: #dc2626;
		border-color: #fecaca;
	}
	
	.btn-cancel:hover {
		background: #fef2f2;
		border-color: #fca5a5;
	}
	
	.add-subscription {
		text-align: center;
	}
	
	.btn-add {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		padding: 16px 32px;
		border-radius: 12px;
		font-size: 16px;
		cursor: pointer;
		transition: transform 0.2s;
	}
	
	.btn-add:hover {
		transform: translateY(-2px);
	}
	
	/* 模態視窗樣式 */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 20px;
	}
	
	.modal-content {
		background: white;
		border-radius: 16px;
		max-width: 600px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: 0 20px 60px rgba(0,0,0,0.3);
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px;
		border-bottom: 1px solid #e5e7eb;
	}
	
	.modal-header h2 {
		margin: 0;
		color: #1f2937;
		font-size: 20px;
	}
	
	.close-btn {
		background: none;
		border: none;
		font-size: 24px;
		cursor: pointer;
		color: #6b7280;
		padding: 4px;
		border-radius: 4px;
		transition: background-color 0.2s;
	}
	
	.close-btn:hover {
		background: #f3f4f6;
		color: #1f2937;
	}
	
	.subscription-form {
		padding: 24px;
	}
	
	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-bottom: 16px;
	}
	
	.form-group {
		display: flex;
		flex-direction: column;
	}
	
	.form-group label {
		margin-bottom: 8px;
		color: #374151;
		font-size: 14px;
		font-weight: 500;
	}
	
	.form-group input,
	.form-group textarea {
		padding: 10px 12px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		font-size: 14px;
		transition: border-color 0.2s;
	}
	
	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #667eea;
	}
	
	.form-actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
		margin-top: 24px;
		padding-top: 24px;
		border-top: 1px solid #e5e7eb;
	}
	
	.btn-primary,
	.btn-secondary {
		padding: 10px 24px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.btn-primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
	}
	
	.btn-primary:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
	}
	
	.btn-secondary {
		background: white;
		color: #374151;
		border: 1px solid #d1d5db;
	}
	
	.btn-secondary:hover {
		background: #f9fafb;
	}
	
	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}
		
		.subscriptions-grid {
			grid-template-columns: 1fr;
		}
		
		.card-header {
			flex-direction: column;
			gap: 12px;
			align-items: flex-start;
		}
		
		.renewal-info {
			flex-direction: column;
			align-items: flex-start;
			gap: 4px;
		}
		
		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>