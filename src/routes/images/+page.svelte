<script>
	let images = [
		{
			id: 1,
			name: 'anime-girl-1.jpg',
			url: '/images/anime-girl-1.jpg',
			size: '2.4 MB'
		},
		{
			id: 2,
			name: 'anime-girl-2.jpg',
			url: '/images/anime-girl-2.jpg',
			size: '1.8 MB'
		}
	];
	
	let searchQuery = '';
	let selectedImages = [];
	let viewMode = 'grid'; // 'grid' or 'list'
	
	$: filteredImages = images.filter(image => 
		image.name.toLowerCase().includes(searchQuery.toLowerCase())
	);
	
	function selectImage(imageId) {
		if (selectedImages.includes(imageId)) {
			selectedImages = selectedImages.filter(id => id !== imageId);
		} else {
			selectedImages = [...selectedImages, imageId];
		}
	}
	
	function selectAll() {
		if (selectedImages.length === filteredImages.length) {
			selectedImages = [];
		} else {
			selectedImages = filteredImages.map(img => img.id);
		}
	}
	
	function deleteSelected() {
		images = images.filter(img => !selectedImages.includes(img.id));
		selectedImages = [];
	}
	
	function handleFileUpload(event) {
		const files = event.target.files;
		for (let file of files) {
			const newImage = {
				id: Date.now() + Math.random(),
				name: file.name,
				url: URL.createObjectURL(file),
				size: (file.size / 1024 / 1024).toFixed(1) + ' MB'
			};
			images = [...images, newImage];
		}
		event.target.value = '';
	}
</script>

<div class="images-page">
	<div class="page-header">
		<h1>鋒兄本地圖片庫</h1>
		<p class="subtitle">瀏覽 public/images 資料夾中的所有圖片</p>
	</div>

	<div class="stats-card">
		<p class="stats-text">共有 {images.length} 張圖片</p>
	</div>

	<div class="controls-section">
		<div class="search-bar">
			<input 
				type="text" 
				placeholder="搜尋圖片名稱..."
				bind:value={searchQuery}
			/>
		</div>
		
		<div class="action-buttons">
			<label class="upload-btn">
				📁 選擇檔案
				<input 
					type="file" 
					multiple 
					accept="image/*"
					on:change={handleFileUpload}
					style="display: none;"
				/>
			</label>
			
			<button 
				class="view-btn"
				class:active={viewMode === 'grid'}
				on:click={() => viewMode = 'grid'}
			>
				🔲
			</button>
			
			<button 
				class="view-btn"
				class:active={viewMode === 'list'}
				on:click={() => viewMode = 'list'}
			>
				📋
			</button>
		</div>
	</div>

	{#if selectedImages.length > 0}
		<div class="selection-bar">
			<span class="selection-count">已選擇 {selectedImages.length} 張圖片</span>
			<div class="selection-actions">
				<button class="select-all-btn" on:click={selectAll}>
					{selectedImages.length === filteredImages.length ? '取消全選' : '全選'}
				</button>
				<button class="delete-btn" on:click={deleteSelected}>
					🗑️ 刪除選中
				</button>
			</div>
		</div>
	{/if}

	<div class="images-container" class:grid-view={viewMode === 'grid'} class:list-view={viewMode === 'list'}>
		{#each filteredImages as image}
			<div 
				class="image-item"
				class:selected={selectedImages.includes(image.id)}
				on:click={() => selectImage(image.id)}
			>
				{#if viewMode === 'grid'}
					<div class="image-wrapper">
						<img src={image.url} alt={image.name} loading="lazy" />
						<div class="image-overlay">
							<div class="image-name">{image.name}</div>
							<div class="image-size">{image.size}</div>
						</div>
						{#if selectedImages.includes(image.id)}
							<div class="selection-indicator">✓</div>
						{/if}
					</div>
				{:else}
					<div class="list-item">
						<div class="list-checkbox">
							{#if selectedImages.includes(image.id)}
								<div class="checkbox checked">✓</div>
							{:else}
								<div class="checkbox"></div>
							{/if}
						</div>
						<img src={image.url} alt={image.name} class="list-thumbnail" />
						<div class="list-info">
							<div class="list-name">{image.name}</div>
							<div class="list-size">{image.size}</div>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if filteredImages.length === 0}
		<div class="empty-state">
			<div class="empty-icon">🖼️</div>
			<h3>沒有找到圖片</h3>
			<p>請檢查搜尋條件或上傳新的圖片</p>
		</div>
	{/if}
</div>

<style>
	.images-page {
		max-width: 1200px;
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
	
	.stats-card {
		background: white;
		padding: 20px;
		border-radius: 12px;
		text-align: center;
		margin-bottom: 24px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}
	
	.stats-text {
		margin: 0;
		font-size: 18px;
		color: #2c3e50;
	}
	
	.controls-section {
		display: flex;
		gap: 16px;
		margin-bottom: 24px;
		flex-wrap: wrap;
	}
	
	.search-bar {
		flex: 1;
		min-width: 200px;
	}
	
	.search-bar input {
		width: 100%;
		padding: 12px 16px;
		border: 2px solid #e1e8ed;
		border-radius: 8px;
		font-size: 16px;
		box-sizing: border-box;
	}
	
	.search-bar input:focus {
		outline: none;
		border-color: #667eea;
	}
	
	.action-buttons {
		display: flex;
		gap: 8px;
	}
	
	.upload-btn {
		background: #667eea;
		color: white;
		padding: 12px 20px;
		border-radius: 8px;
		cursor: pointer;
		font-size: 14px;
		transition: background 0.2s;
	}
	
	.upload-btn:hover {
		background: #5a6fd8;
	}
	
	.view-btn {
		background: white;
		border: 2px solid #e1e8ed;
		padding: 12px 16px;
		border-radius: 8px;
		cursor: pointer;
		font-size: 16px;
		transition: all 0.2s;
	}
	
	.view-btn.active {
		background: #667eea;
		border-color: #667eea;
		color: white;
	}
	
	.selection-bar {
		background: #e3f2fd;
		padding: 16px 20px;
		border-radius: 8px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		flex-wrap: wrap;
		gap: 16px;
	}
	
	.selection-count {
		font-weight: 600;
		color: #1976d2;
	}
	
	.selection-actions {
		display: flex;
		gap: 12px;
	}
	
	.select-all-btn {
		background: #2196f3;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 6px;
		cursor: pointer;
		font-size: 14px;
	}
	
	.delete-btn {
		background: #f44336;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 6px;
		cursor: pointer;
		font-size: 14px;
	}
	
	.images-container.grid-view {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 20px;
	}
	
	.images-container.list-view {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	
	.image-item {
		cursor: pointer;
		transition: transform 0.2s;
	}
	
	.image-item:hover {
		transform: translateY(-2px);
	}
	
	.image-item.selected .image-wrapper {
		border-color: #667eea;
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}
	
	.image-wrapper {
		position: relative;
		background: white;
		border: 2px solid #f0f0f0;
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.2s;
	}
	
	.image-wrapper img {
		width: 100%;
		height: 200px;
		object-fit: cover;
		display: block;
	}
	
	.image-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0,0,0,0.8));
		color: white;
		padding: 16px;
	}
	
	.image-name {
		font-weight: 600;
		margin-bottom: 4px;
		font-size: 14px;
	}
	
	.image-size {
		font-size: 12px;
		opacity: 0.9;
	}
	
	.selection-indicator {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 24px;
		height: 24px;
		background: #667eea;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-weight: 600;
	}
	
	.list-item {
		display: flex;
		align-items: center;
		gap: 16px;
		background: white;
		padding: 16px;
		border: 2px solid #f0f0f0;
		border-radius: 12px;
		transition: border-color 0.2s;
	}
	
	.image-item.selected .list-item {
		border-color: #667eea;
	}
	
	.list-checkbox {
		flex-shrink: 0;
	}
	
	.checkbox {
		width: 20px;
		height: 20px;
		border: 2px solid #ddd;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
	}
	
	.checkbox.checked {
		background: #667eea;
		border-color: #667eea;
		color: white;
	}
	
	.list-thumbnail {
		width: 60px;
		height: 60px;
		object-fit: cover;
		border-radius: 8px;
		flex-shrink: 0;
	}
	
	.list-info {
		flex: 1;
	}
	
	.list-name {
		font-weight: 600;
		margin-bottom: 4px;
		color: #2c3e50;
	}
	
	.list-size {
		color: #666;
		font-size: 14px;
	}
	
	.empty-state {
		text-align: center;
		padding: 64px 32px;
		color: #666;
	}
	
	.empty-icon {
		font-size: 64px;
		margin-bottom: 16px;
	}
	
	.empty-state h3 {
		margin: 0 0 8px 0;
		color: #2c3e50;
	}
	
	.empty-state p {
		margin: 0;
	}
	
	@media (max-width: 768px) {
		.controls-section {
			flex-direction: column;
		}
		
		.action-buttons {
			justify-content: center;
		}
		
		.selection-bar {
			flex-direction: column;
			text-align: center;
		}
		
		.images-container.grid-view {
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		}
	}
</style>