<script>
	let foods = [];
	let showForm = false;
	
	let formData = {
		foodName: '',
		quantity: 1,
		price: '',
		store: '',
		expiryDate: ''
	};
	
	function addFood() {
		if (formData.foodName && formData.price) {
			foods = [...foods, {
				id: Date.now(),
				...formData,
				quantity: parseInt(formData.quantity),
				price: parseFloat(formData.price)
			}];
			resetForm();
		}
	}
	
	function resetForm() {
		formData = {
			foodName: '',
			quantity: 1,
			price: '',
			store: '',
			expiryDate: ''
		};
		showForm = false;
	}
	
	function deleteFood(id) {
		foods = foods.filter(food => food.id !== id);
	}
	
	function updateQuantity(id, change) {
		foods = foods.map(food => {
			if (food.id === id) {
				const newQuantity = Math.max(0, food.quantity + change);
				return { ...food, quantity: newQuantity };
			}
			return food;
		});
	}
	
	$: totalValue = foods.reduce((sum, food) => sum + (food.price * food.quantity), 0);
	$: totalItems = foods.reduce((sum, food) => sum + food.quantity, 0);
</script>

<div class="food-page">
	<div class="page-header">
		<h1>鋒兄食物庫存管理系統</h1>
		<p class="subtitle">管理您的食物庫存，追蹤購買記錄</p>
	</div>

	{#if !showForm}
		<div class="add-section">
			<h2>新增食物</h2>
			<button class="add-btn" on:click={() => showForm = true}>
				+ 新增食物
			</button>
		</div>
	{:else}
		<div class="form-card">
			<h2>新增食物</h2>
			
			<form on:submit|preventDefault={addFood}>
				<div class="form-group">
					<label for="foodName">食物名稱</label>
					<input 
						id="foodName"
						type="text" 
						bind:value={formData.foodName}
						placeholder="例如：牛奶、雞蛋"
						required
					/>
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="quantity">數量</label>
						<input 
							id="quantity"
							type="number" 
							bind:value={formData.quantity}
							min="1"
							required
						/>
					</div>
					
					<div class="form-group">
						<label for="price">價格 (NT$)</label>
						<input 
							id="price"
							type="number" 
							bind:value={formData.price}
							placeholder="100"
							min="0"
							step="0.01"
							required
						/>
					</div>
				</div>
				
				<div class="form-group">
					<label for="store">購買商店</label>
					<input 
						id="store"
						type="text" 
						bind:value={formData.store}
						placeholder="例如：全聯福利中心"
					/>
				</div>
				
				<div class="form-group">
					<label for="expiryDate">到期日期</label>
					<input 
						id="expiryDate"
						type="date" 
						bind:value={formData.expiryDate}
					/>
				</div>
				
				<div class="form-actions">
					<button type="submit" class="submit-btn">新增食物</button>
					<button type="button" class="cancel-btn" on:click={resetForm}>取消</button>
				</div>
			</form>
		</div>
	{/if}

	{#if foods.length > 0}
		<div class="foods-section">
			<div class="section-header">
				<h2>食物庫存</h2>
				<div class="stats">
					<div class="stat">
						<span class="label">總項目：</span>
						<span class="value">{totalItems}</span>
					</div>
					<div class="stat">
						<span class="label">總價值：</span>
						<span class="value">NT$ {totalValue.toFixed(0)}</span>
					</div>
				</div>
			</div>
			
			<div class="foods-grid">
				{#each foods as food}
					<div class="food-card">
						<div class="food-header">
							<h3>{food.foodName}</h3>
							<button 
								class="delete-btn"
								on:click={() => deleteFood(food.id)}
							>
								🗑️
							</button>
						</div>
						
						<div class="food-details">
							<div class="quantity-control">
								<button 
									class="qty-btn"
									on:click={() => updateQuantity(food.id, -1)}
									disabled={food.quantity <= 0}
								>
									-
								</button>
								<span class="quantity">{food.quantity}</span>
								<button 
									class="qty-btn"
									on:click={() => updateQuantity(food.id, 1)}
								>
									+
								</button>
							</div>
							
							<div class="price">NT$ {food.price}</div>
							<div class="total">總計：NT$ {(food.price * food.quantity).toFixed(0)}</div>
							
							{#if food.store}
								<p class="store">購買地點：{food.store}</p>
							{/if}
							
							{#if food.expiryDate}
								<p class="expiry">到期日：{food.expiryDate}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.food-page {
		max-width: 1000px;
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
		background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
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
	
	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
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
		border-color: #4caf50;
	}
	
	.form-actions {
		display: flex;
		gap: 12px;
		margin-top: 32px;
	}
	
	.submit-btn {
		flex: 1;
		background: #4caf50;
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
	
	.foods-section {
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
	
	.stats {
		display: flex;
		gap: 24px;
		flex-wrap: wrap;
	}
	
	.stat {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 16px;
	}
	
	.stat .label {
		color: #666;
	}
	
	.stat .value {
		font-weight: 700;
		color: #4caf50;
	}
	
	.foods-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
	}
	
	.food-card {
		border: 2px solid #f0f0f0;
		border-radius: 12px;
		padding: 20px;
		transition: border-color 0.2s;
	}
	
	.food-card:hover {
		border-color: #4caf50;
	}
	
	.food-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 16px;
	}
	
	.food-header h3 {
		margin: 0;
		color: #2c3e50;
		font-size: 18px;
	}
	
	.delete-btn {
		background: none;
		border: none;
		font-size: 18px;
		cursor: pointer;
		padding: 4px;
		opacity: 0.6;
		transition: opacity 0.2s;
	}
	
	.delete-btn:hover {
		opacity: 1;
	}
	
	.quantity-control {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
	}
	
	.qty-btn {
		width: 32px;
		height: 32px;
		border: 2px solid #4caf50;
		background: white;
		color: #4caf50;
		border-radius: 6px;
		cursor: pointer;
		font-size: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.qty-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.quantity {
		font-size: 18px;
		font-weight: 600;
		min-width: 40px;
		text-align: center;
	}
	
	.price {
		font-size: 16px;
		color: #666;
		margin-bottom: 4px;
	}
	
	.total {
		font-size: 18px;
		font-weight: 700;
		color: #4caf50;
		margin-bottom: 12px;
	}
	
	.food-details p {
		margin: 4px 0;
		color: #666;
		font-size: 14px;
	}
	
	@media (max-width: 768px) {
		.form-row {
			grid-template-columns: 1fr;
		}
		
		.form-actions {
			flex-direction: column;
		}
		
		.section-header {
			flex-direction: column;
			align-items: flex-start;
		}
		
		.foods-grid {
			grid-template-columns: 1fr;
		}
	}
</style>