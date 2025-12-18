<script>
	let subscriptions = [];
	let showForm = false;
	
	let formData = {
		serviceName: '',
		website: '',
		email: '',
		monthlyFee: '',
		nextPaymentDate: ''
	};
	
	function addSubscription() {
		if (formData.serviceName && formData.monthlyFee) {
			subscriptions = [...subscriptions, {
				id: Date.now(),
				...formData,
				monthlyFee: parseFloat(formData.monthlyFee)
			}];
			resetForm();
		}
	}
	
	function resetForm() {
		formData = {
			serviceName: '',
			website: '',
			email: '',
			monthlyFee: '',
			nextPaymentDate: ''
		};
		showForm = false;
	}
	
	function deleteSubscription(id) {
		subscriptions = subscriptions.filter(sub => sub.id !== id);
	}
	
	$: totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.monthlyFee, 0);
</script>

<div class="subscription-page">
	<div class="page-header">
		<h1>鋒兄訂閱管理系統</h1>
		<p class="subtitle">管理您的所有訂閱服務</p>
	</div>

	{#if !showForm}
		<div class="add-section">
			<h2>新增訂閱項目</h2>
			<button class="add-btn" on:click={() => showForm = true}>
				+ 新增訂閱
			</button>
		</div>
	{:else}
		<div class="form-card">
			<h2>新增訂閱項目</h2>
			
			<form on:submit|preventDefault={addSubscription}>
				<div class="form-group">
					<label for="serviceName">服務名稱</label>
					<input 
						id="serviceName"
						type="text" 
						bind:value={formData.serviceName}
						placeholder="例如：Netflix, Spotify"
						required
					/>
				</div>
				
				<div class="form-group">
					<label for="website">網站網址</label>
					<input 
						id="website"
						type="url" 
						bind:value={formData.website}
						placeholder="https://example.com"
					/>
				</div>
				
				<div class="form-group">
					<label for="email">帳號/Email</label>
					<div class="input-with-icon">
						<input 
							id="email"
							type="email" 
							bind:value={formData.email}
							placeholder="your@email.com"
						/>
						<span class="input-icon">🔑</span>
					</div>
				</div>
				
				<div class="form-group">
					<label for="monthlyFee">月費 (NT$)</label>
					<input 
						id="monthlyFee"
						type="number" 
						bind:value={formData.monthlyFee}
						placeholder="299"
						min="0"
						step="0.01"
						required
					/>
				</div>
				
				<div class="form-group">
					<label for="nextPaymentDate">下次扣款日期</label>
					<input 
						id="nextPaymentDate"
						type="date" 
						bind:value={formData.nextPaymentDate}
					/>
				</div>
				
				<div class="form-actions">
					<button type="submit" class="submit-btn">新增訂閱</button>
					<button type="button" class="cancel-btn" on:click={resetForm}>取消</button>
				</div>
			</form>
		</div>
	{/if}

	{#if subscriptions.length > 0}
		<div class="subscriptions-section">
			<div class="section-header">
				<h2>目前訂閱項目</h2>
				<div class="total-cost">
					<span class="label">每月總計：</span>
					<span class="amount">NT$ {totalMonthly.toFixed(0)}</span>
				</div>
			</div>
			
			<div class="subscriptions-list">
				{#each subscriptions as subscription}
					<div class="subscription-card">
						<div class="subscription-info">
							<h3>{subscription.serviceName}</h3>
							{#if subscription.website}
								<p class="website">{subscription.website}</p>
							{/if}
							{#if subscription.email}
								<p class="email">{subscription.email}</p>
							{/if}
							<div class="fee">NT$ {subscription.monthlyFee}</div>
							{#if subscription.nextPaymentDate}
								<p class="next-payment">下次扣款：{subscription.nextPaymentDate}</p>
							{/if}
						</div>
						<button 
							class="delete-btn"
							on:click={() => deleteSubscription(subscription.id)}
						>
							🗑️
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.subscription-page {
		max-width: 800px;
		margin: 0 auto;
	}
	
	.page-header {
		text-align: center;
		margin-bottom: 32px;
	}
	
	.page-header h1 {
		margin: 0 0 8px 0;
		color: #2c3e50;
		font-size: 28px;
	}
	
	.subtitle {
		margin: 0;
		color: #666;
		font-size: 16px;
	}
	
	.add-section {
		background: white;
		padding: 32px;
		border-radius: 16px;
		text-align: center;
		margin-bottom: 32px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}
	
	.add-section h2 {
		margin: 0 0 24px 0;
		color: #2c3e50;
	}
	
	.add-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		padding: 16px 32px;
		border-radius: 12px;
		font-size: 16px;
		cursor: pointer;
		transition: transform 0.2s;
	}
	
	.add-btn:hover {
		transform: translateY(-2px);
	}
	
	.form-card {
		background: white;
		padding: 32px;
		border-radius: 16px;
		margin-bottom: 32px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}
	
	.form-card h2 {
		margin: 0 0 24px 0;
		color: #2c3e50;
	}
	
	.form-group {
		margin-bottom: 20px;
	}
	
	.form-group label {
		display: block;
		margin-bottom: 8px;
		font-weight: 600;
		color: #2c3e50;
	}
	
	.form-group input {
		width: 100%;
		padding: 12px 16px;
		border: 2px solid #e1e8ed;
		border-radius: 8px;
		font-size: 16px;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}
	
	.form-group input:focus {
		outline: none;
		border-color: #667eea;
	}
	
	.input-with-icon {
		position: relative;
	}
	
	.input-icon {
		position: absolute;
		right: 16px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 20px;
	}
	
	.form-actions {
		display: flex;
		gap: 12px;
		margin-top: 32px;
	}
	
	.submit-btn {
		flex: 1;
		background: #5b7cff;
		color: white;
		border: none;
		padding: 16px;
		border-radius: 8px;
		font-size: 16px;
		cursor: pointer;
	}
	
	.cancel-btn {
		flex: 1;
		background: #6c757d;
		color: white;
		border: none;
		padding: 16px;
		border-radius: 8px;
		font-size: 16px;
		cursor: pointer;
	}
	
	.subscriptions-section {
		background: white;
		padding: 32px;
		border-radius: 16px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		flex-wrap: wrap;
		gap: 16px;
	}
	
	.section-header h2 {
		margin: 0;
		color: #2c3e50;
	}
	
	.total-cost {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 18px;
	}
	
	.total-cost .label {
		color: #666;
	}
	
	.total-cost .amount {
		font-weight: 700;
		color: #667eea;
	}
	
	.subscriptions-list {
		display: grid;
		gap: 16px;
	}
	
	.subscription-card {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 20px;
		border: 2px solid #f0f0f0;
		border-radius: 12px;
		transition: border-color 0.2s;
	}
	
	.subscription-card:hover {
		border-color: #667eea;
	}
	
	.subscription-info h3 {
		margin: 0 0 8px 0;
		color: #2c3e50;
		font-size: 18px;
	}
	
	.subscription-info p {
		margin: 4px 0;
		color: #666;
		font-size: 14px;
	}
	
	.fee {
		font-size: 20px;
		font-weight: 700;
		color: #667eea;
		margin: 8px 0;
	}
	
	.delete-btn {
		background: none;
		border: none;
		font-size: 20px;
		cursor: pointer;
		padding: 8px;
		opacity: 0.6;
		transition: opacity 0.2s;
	}
	
	.delete-btn:hover {
		opacity: 1;
	}
	
	@media (max-width: 768px) {
		.form-actions {
			flex-direction: column;
		}
		
		.section-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>