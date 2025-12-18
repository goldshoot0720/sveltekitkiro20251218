<script>
	import { onMount } from 'svelte';
	
	let foods = [];
	let totalValue = 0;
	let loading = true;
	let error = null;
	let showAddModal = false;
	let editingFood = null;
	
	// 新增/編輯表單資料
	let formData = {
		name: '',
		amount: '',
		price: '',
		shop: '',
		todate: '',
		photourl: '',
		photohash: ''
	};
	
	onMount(async () => {
		await loadFoods();
	});
	
	async function loadFoods() {
		try {
			loading = true;
			const response = await fetch('/api/foods');
			if (!response.ok) throw new Error('Failed to fetch');
			let rawFoods = await response.json();
			
			// 前端額外排序：按保存期限由近至遠排序
			foods = rawFoods.sort((a, b) => {
				// 沒有保存期限的排在最後
				if (!a.todate && !b.todate) return 0;
				if (!a.todate) return 1;
				if (!b.todate) return -1;
				
				// 有保存期限的按日期升序排序（最快過期的在前面）
				return new Date(a.todate) - new Date(b.todate);
			});
			
			calculateTotalValue();
			loading = false;
		} catch (err) {
			error = err.message;
			loading = false;
		}
	}
	
	async function saveFood() {
		// 前端驗證
		if (!formData.name.trim()) {
			alert('請輸入食品名稱');
			return;
		}
		
		try {
			const method = editingFood ? 'PATCH' : 'POST';
			const body = editingFood 
				? { id: editingFood._id, ...formData }
				: formData;
			
			console.log('Sending data:', body);
			
			const response = await fetch('/api/foods', {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
			
			if (!response.ok) {
				const errorData = await response.json();
				console.error('API Error:', errorData);
				
				if (response.status === 403) {
					alert(`權限不足: ${errorData.details}\n\n建議: ${errorData.suggestion || '請聯繫管理員更新 API Token 權限'}`);
				} else if (response.status === 400 && errorData.details) {
					const errors = Object.values(errorData.details).filter(Boolean);
					alert(`驗證錯誤:\n${errors.join('\n')}`);
				} else {
					alert('儲存失敗: ' + (errorData.error || 'Unknown error'));
				}
				return;
			}
			
			await loadFoods();
			closeModal();
		} catch (err) {
			console.error('Save error:', err);
			alert('儲存失敗: ' + err.message);
		}
	}
	
	async function deleteFoodHandler(id) {
		if (!confirm('確定要刪除此食品嗎？')) return;
		
		try {
			const response = await fetch('/api/foods', {
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
			
			await loadFoods();
		} catch (err) {
			alert('刪除失敗: ' + err.message);
		}
	}
	
	function openAddModal() {
		editingFood = null;
		formData = {
			name: '',
			amount: '',
			price: '',
			shop: '',
			todate: '',
			photourl: '',
			photohash: ''
		};
		showAddModal = true;
	}
	
	function openEditModal(food) {
		editingFood = food;
		formData = { ...food };
		showAddModal = true;
	}
	
	function closeModal() {
		showAddModal = false;
		editingFood = null;
	}
	
	function calculateTotalValue() {
		totalValue = foods.reduce((total, food) => {
			return total + ((food.price || 0) * (food.amount || 1));
		}, 0);
	}
	
	function getDaysUntilExpiry(expiryDate) {
		if (!expiryDate) return null;
		const today = new Date();
		const expiry = new Date(expiryDate);
		const diffTime = expiry - today;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}
</script>

<svelte:head>
	<title>食品管理 - 鋒兄系統</title>
</svelte:head>

<div class="food-page">
	<div class="page-header">
		<h1>食品管理</h1>
		<p>管理您的食品庫存與保存期限</p>
		<div class="sort-info">
			<span class="sort-icon">📅</span>
			<span>食品按保存期限排序（最快過期的在前面）</span>
		</div>
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
					<h3>總價值</h3>
					<p class="stat-value">NT$ {totalValue.toLocaleString()}</p>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">📦</div>
				<div class="stat-content">
					<h3>食品總數</h3>
					<p class="stat-value">{foods.length}</p>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">🚨</div>
				<div class="stat-content">
					<h3>7天內過期</h3>
					<p class="stat-value">
						{foods.filter(f => {
							const days = getDaysUntilExpiry(f.todate);
							return days !== null && days <= 7 && days > 0;
						}).length}
					</p>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">⚠️</div>
				<div class="stat-content">
					<h3>30天內過期</h3>
					<p class="stat-value">
						{foods.filter(f => {
							const days = getDaysUntilExpiry(f.todate);
							return days !== null && days <= 30 && days > 0;
						}).length}
					</p>
				</div>
			</div>
		</div>

		<!-- 食品列表 -->
		<div class="foods-grid">
			{#each foods as food}
				<div class="food-card">
					<div class="card-header">
						<div class="food-info">
							<div>
								<h3 class="food-name">{food.name}</h3>
								{#if food.shop}
									<p class="shop-name">購於: {food.shop}</p>
								{/if}
							</div>
						</div>
					</div>
					
					<div class="card-content">
						{#if food.photo || food.photourl}
							<div class="food-image">
								<img src={food.photourl || food.photo} alt={food.name} />
							</div>
						{/if}
						
						<div class="food-details">
							{#if food.amount}
								<div class="detail-item">
									<span class="detail-label">數量:</span>
									{food.amount}
								</div>
							{/if}
							
							{#if food.price}
								<div class="detail-item">
									<span class="detail-label">價格:</span>
									NT$ {food.price}
								</div>
							{/if}
							

							
							{#if food.todate}
								<div class="detail-item expiry-info">
									<span class="detail-label">保存期限:</span>
									<div class="expiry-details">
										<span class="expiry-date">{food.todate}</span>
										{#if getDaysUntilExpiry(food.todate) !== null}
											<span class="days-left" class:warning={getDaysUntilExpiry(food.todate) <= 7} class:expired={getDaysUntilExpiry(food.todate) < 0}>
												{#if getDaysUntilExpiry(food.todate) > 0}
													還有 {getDaysUntilExpiry(food.todate)} 天
												{:else if getDaysUntilExpiry(food.todate) === 0}
													今天到期
												{:else}
													已過期 {Math.abs(getDaysUntilExpiry(food.todate))} 天
												{/if}
											</span>
										{/if}
									</div>
								</div>
							{/if}
							

						</div>
					</div>
					
					<div class="card-actions">
						<button class="btn-edit" on:click={() => openEditModal(food)}>編輯</button>
						<button class="btn-delete" on:click={() => deleteFoodHandler(food._id)}>刪除</button>
					</div>
				</div>
			{/each}
		</div>
		
		<div class="add-food">
			<button class="btn-add" on:click={openAddModal}>+ 新增食品</button>
		</div>
	{/if}
</div>

<!-- 新增/編輯食品模態視窗 -->
{#if showAddModal}
	<div class="modal-overlay" on:click={closeModal} on:keydown={(e) => e.key === 'Escape' && closeModal()} role="dialog" aria-modal="true">
		<div class="modal-content" on:click|stopPropagation role="document">
			<div class="modal-header">
				<h2>{editingFood ? '編輯食品' : '新增食品'}</h2>
				<button class="close-btn" on:click={closeModal}>✕</button>
			</div>
			
			<form class="food-form" on:submit|preventDefault={saveFood}>
				<div class="form-group">
					<label for="name">食品名稱 *</label>
					<input type="text" id="name" bind:value={formData.name} required />
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="amount">數量</label>
						<input type="number" id="amount" bind:value={formData.amount} min="0" step="0.1" />
					</div>
					
					<div class="form-group">
						<label for="price">價格</label>
						<input type="number" id="price" bind:value={formData.price} min="0" step="1" />
					</div>
				</div>
				
				<div class="form-group">
					<label for="todate">保存期限</label>
					<input type="date" id="todate" bind:value={formData.todate} />
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="shop">商店</label>
						<input type="text" id="shop" bind:value={formData.shop} />
					</div>
					
					<div class="form-group">
						<label for="photourl">照片網址</label>
						<input type="url" id="photourl" bind:value={formData.photourl} />
					</div>
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
	.food-page {
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
	
	.sort-info {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 12px;
		padding: 8px 16px;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: 8px;
		font-size: 14px;
		color: #166534;
	}
	
	.sort-icon {
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
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
	
	.foods-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 24px;
		margin-bottom: 40px;
	}
	
	.food-card {
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 12px rgba(0,0,0,0.1);
		overflow: hidden;
		transition: transform 0.2s, box-shadow 0.2s;
	}
	
	.food-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0,0,0,0.15);
	}
	
	.card-header {
		padding: 20px 20px 0 20px;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
	
	.food-info {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 1;
	}
	

	
	.food-name {
		margin: 0 0 4px 0;
		color: #1f2937;
		font-size: 18px;
		font-weight: 600;
	}
	
	.shop-name {
		margin: 0;
		color: #6b7280;
		font-size: 12px;
	}
	
	
	.card-content {
		padding: 20px;
	}
	
	.food-image {
		margin-bottom: 16px;
		border-radius: 8px;
		overflow: hidden;
	}
	
	.food-image img {
		width: 100%;
		height: 150px;
		object-fit: cover;
	}
	
	.food-details {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	
	.detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
	}
	
	.detail-label {
		font-weight: 500;
		color: #374151;
	}
	
	.expiry-info {
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
	}
	
	.expiry-details {
		display: flex;
		justify-content: space-between;
		width: 100%;
		align-items: center;
	}
	
	.expiry-date {
		color: #6b7280;
	}
	
	.days-left {
		font-weight: 500;
		color: #059669;
	}
	
	.days-left.warning {
		color: #f59e0b;
	}
	
	.days-left.expired {
		color: #ef4444;
	}
	
	.note {
		background: #f9fafb;
		padding: 12px;
		border-radius: 8px;
		font-size: 14px;
		color: #4b5563;
		margin-top: 8px;
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
	
	.btn-edit, .btn-delete {
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
	
	.btn-delete {
		color: #dc2626;
		border-color: #fecaca;
	}
	
	.btn-delete:hover {
		background: #fef2f2;
		border-color: #fca5a5;
	}
	
	.add-food {
		text-align: center;
	}
	
	.btn-add {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
		max-width: 700px;
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
	
	.food-form {
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
	
	.form-group input {
		padding: 10px 12px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		font-size: 14px;
		transition: border-color 0.2s;
	}
	
	.form-group input:focus {
		outline: none;
		border-color: #10b981;
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
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
		border: none;
	}
	
	.btn-primary:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
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
			grid-template-columns: repeat(2, 1fr);
		}
		
		.foods-grid {
			grid-template-columns: 1fr;
		}
		
		.card-header {
			flex-direction: column;
			gap: 12px;
			align-items: flex-start;
		}
		
		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>