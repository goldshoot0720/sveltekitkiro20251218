<script>
	import { onMount } from 'svelte';
	
	let images = [];
	let filteredImages = [];
	let searchTerm = '';
	let selectedImage = null;
	let currentImageIndex = 0;
	let loading = true;
	
	// 圖片類型分類
	const imageCategories = {
		'ChatGPT': '🤖 AI生成',
		'Gemini': '💎 Gemini',
		'MindVideo': '🎬 MindVideo',
		'Screenshot': '📸 截圖',
		'其他': '📁 其他'
	};
	
	let selectedCategory = '全部';
	
	onMount(async () => {
		await loadImages();
	});
	
	async function loadImages() {
		try {
			const response = await fetch('/api/images');
			const data = await response.json();
			
			if (data.success) {
				images = data.images;
				filteredImages = images;
			} else {
				console.error('載入圖片失敗:', data.error);
			}
			
			loading = false;
		} catch (error) {
			console.error('載入圖片失敗:', error);
			loading = false;
		}
	}
	
	function filterImages() {
		filteredImages = images.filter(image => {
			const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
								image.filename.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory = selectedCategory === '全部' || image.category === selectedCategory;
			return matchesSearch && matchesCategory;
		});
	}
	
	function openImage(image) {
		selectedImage = image;
		currentImageIndex = filteredImages.findIndex(img => img.id === image.id);
	}
	
	function closeImage() {
		selectedImage = null;
	}
	
	function nextImage() {
		if (currentImageIndex < filteredImages.length - 1) {
			currentImageIndex++;
			selectedImage = filteredImages[currentImageIndex];
		}
	}
	
	function prevImage() {
		if (currentImageIndex > 0) {
			currentImageIndex--;
			selectedImage = filteredImages[currentImageIndex];
		}
	}
	
	function handleKeydown(event) {
		if (!selectedImage) return;
		
		if (event.key === 'Escape') {
			closeImage();
		} else if (event.key === 'ArrowRight') {
			nextImage();
		} else if (event.key === 'ArrowLeft') {
			prevImage();
		}
	}
	
	$: if (searchTerm !== undefined || selectedCategory !== undefined) {
		filterImages();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="gallery-page">
	<div class="page-header">
		<h1>🖼️ 圖片庫</h1>
		<p class="page-description">瀏覽和管理您的圖片收藏</p>
	</div>

	<!-- 統計卡片 -->
	<div class="stats-card">
		<div class="stats-header">
			<div class="stats-icon">📊</div>
			<h2>圖片統計</h2>
		</div>
		
		<div class="stats-grid">
			<div class="stat-item">
				<div class="stat-label">總圖片數：</div>
				<div class="stat-value">{images.length}</div>
			</div>
			
			<div class="stat-item">
				<div class="stat-label">顯示中：</div>
				<div class="stat-value">{filteredImages.length}</div>
			</div>
			
			<div class="stat-item">
				<div class="stat-label">分類數：</div>
				<div class="stat-value">{Object.keys(imageCategories).length}</div>
			</div>
		</div>
	</div>

	<!-- 搜尋和篩選 -->
	<div class="filter-section">
		<div class="search-box">
			<div class="search-icon">🔍</div>
			<input 
				type="text" 
				placeholder="搜尋圖片..." 
				bind:value={searchTerm}
				class="search-input"
			>
		</div>
		
		<div class="category-filters">
			<button 
				class="category-btn {selectedCategory === '全部' ? 'active' : ''}"
				on:click={() => selectedCategory = '全部'}
			>
				📁 全部 ({images.length})
			</button>
			
			{#each Object.entries(imageCategories) as [key, label]}
				{@const count = images.filter(img => img.category === key).length}
				<button 
					class="category-btn {selectedCategory === key ? 'active' : ''}"
					on:click={() => selectedCategory = key}
				>
					{label} ({count})
				</button>
			{/each}
		</div>
	</div>

	<!-- 圖片網格 -->
	{#if loading}
		<div class="loading">
			<div class="loading-spinner">⏳</div>
			<p>載入圖片中...</p>
		</div>
	{:else if filteredImages.length === 0}
		<div class="no-results">
			<div class="no-results-icon">🔍</div>
			<h3>找不到圖片</h3>
			<p>嘗試調整搜尋條件或選擇不同的分類</p>
		</div>
	{:else}
		<div class="image-grid">
			{#each filteredImages as image}
				<div class="image-card" on:click={() => openImage(image)}>
					<div class="image-container">
						<img 
							src={image.url} 
							alt={image.title}
							loading="lazy"
							on:error={(e) => {
								e.target.src = '/images/placeholder.svg';
							}}
						>
						<div class="image-overlay">
							<div class="overlay-content">
								<div class="zoom-icon">🔍</div>
								<div class="image-info">
									<div class="image-title">{image.title}</div>
									<div class="image-size">{image.size}</div>
								</div>
							</div>
						</div>
					</div>
					<div class="card-footer">
						<div class="category-tag">{imageCategories[image.category]}</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- 圖片檢視器模態視窗 -->
{#if selectedImage}
	<div class="image-modal" on:click={closeImage}>
		<div class="modal-content" on:click|stopPropagation>
			<div class="modal-header">
				<div class="modal-title">
					<h3>{selectedImage.title}</h3>
					<div class="image-counter">
						{currentImageIndex + 1} / {filteredImages.length}
					</div>
				</div>
				<button class="close-btn" on:click={closeImage}>✕</button>
			</div>
			
			<div class="modal-body">
				<button 
					class="nav-btn prev-btn {currentImageIndex === 0 ? 'disabled' : ''}" 
					on:click={prevImage}
					disabled={currentImageIndex === 0}
				>
					◀
				</button>
				
				<div class="image-viewer">
					<img 
						src={selectedImage.url} 
						alt={selectedImage.title}
						class="modal-image"
					>
				</div>
				
				<button 
					class="nav-btn next-btn {currentImageIndex === filteredImages.length - 1 ? 'disabled' : ''}" 
					on:click={nextImage}
					disabled={currentImageIndex === filteredImages.length - 1}
				>
					▶
				</button>
			</div>
			
			<div class="modal-footer">
				<div class="image-details">
					<div class="detail-item">
						<span class="detail-label">檔名：</span>
						<span class="detail-value">{selectedImage.filename}</span>
					</div>
					<div class="detail-item">
						<span class="detail-label">分類：</span>
						<span class="detail-value">{imageCategories[selectedImage.category]}</span>
					</div>
					<div class="detail-item">
						<span class="detail-label">大小：</span>
						<span class="detail-value">{selectedImage.size}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.gallery-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}
	
	.page-header {
		text-align: center;
		margin-bottom: 32px;
	}
	
	.page-header h1 {
		margin: 0 0 8px 0;
		color: #2c3e50;
		font-size: 32px;
	}
	
	.page-description {
		margin: 0;
		color: #7f8c8d;
		font-size: 16px;
	}
	
	.stats-card {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 32px;
		border-radius: 24px;
		margin-bottom: 32px;
		box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
	}
	
	.stats-header {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 24px;
	}
	
	.stats-icon {
		font-size: 48px;
	}
	
	.stats-header h2 {
		margin: 0;
		font-size: 24px;
	}
	
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 24px;
	}
	
	.stat-item {
		text-align: center;
		background: rgba(255, 255, 255, 0.1);
		padding: 20px;
		border-radius: 16px;
		backdrop-filter: blur(10px);
	}
	
	.stat-label {
		font-size: 14px;
		opacity: 0.8;
		margin-bottom: 8px;
	}
	
	.stat-value {
		font-size: 24px;
		font-weight: 700;
	}
	
	.filter-section {
		background: white;
		padding: 24px;
		border-radius: 16px;
		margin-bottom: 32px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}
	
	.search-box {
		position: relative;
		margin-bottom: 20px;
	}
	
	.search-icon {
		position: absolute;
		left: 16px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 20px;
		color: #7f8c8d;
	}
	
	.search-input {
		width: 100%;
		padding: 16px 16px 16px 56px;
		border: 2px solid #e9ecef;
		border-radius: 12px;
		font-size: 16px;
		transition: border-color 0.3s;
		box-sizing: border-box;
	}
	
	.search-input:focus {
		outline: none;
		border-color: #667eea;
	}
	
	.category-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}
	
	.category-btn {
		padding: 12px 20px;
		border: 2px solid #e9ecef;
		background: white;
		border-radius: 24px;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.3s;
		white-space: nowrap;
	}
	
	.category-btn:hover {
		border-color: #667eea;
		background: #f8f9ff;
	}
	
	.category-btn.active {
		background: #667eea;
		color: white;
		border-color: #667eea;
	}
	
	.loading {
		text-align: center;
		padding: 60px 20px;
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
	
	.no-results {
		text-align: center;
		padding: 60px 20px;
		color: #7f8c8d;
	}
	
	.no-results-icon {
		font-size: 64px;
		margin-bottom: 16px;
	}
	
	.no-results h3 {
		margin: 0 0 8px 0;
		color: #2c3e50;
	}
	
	.image-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 24px;
	}
	
	.image-card {
		background: white;
		border-radius: 16px;
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.3s, box-shadow 0.3s;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}
	
	.image-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0,0,0,0.15);
	}
	
	.image-container {
		position: relative;
		aspect-ratio: 16/9;
		overflow: hidden;
	}
	
	.image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s;
	}
	
	.image-card:hover .image-container img {
		transform: scale(1.05);
	}
	
	.image-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.3s;
	}
	
	.image-card:hover .image-overlay {
		opacity: 1;
	}
	
	.overlay-content {
		text-align: center;
		color: white;
	}
	
	.zoom-icon {
		font-size: 32px;
		margin-bottom: 8px;
	}
	
	.image-info {
		font-size: 14px;
	}
	
	.image-title {
		font-weight: 600;
		margin-bottom: 4px;
	}
	
	.image-size {
		opacity: 0.8;
	}
	
	.card-footer {
		padding: 16px;
	}
	
	.category-tag {
		display: inline-block;
		background: #f8f9fa;
		color: #495057;
		padding: 6px 12px;
		border-radius: 16px;
		font-size: 12px;
		font-weight: 500;
	}
	
	/* 圖片檢視器模態視窗 */
	.image-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 20px;
	}
	
	.modal-content {
		background: white;
		border-radius: 16px;
		max-width: 90vw;
		max-height: 90vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(0,0,0,0.3);
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 24px;
		border-bottom: 1px solid #eee;
		flex-shrink: 0;
	}
	
	.modal-title {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	
	.modal-title h3 {
		margin: 0;
		color: #2c3e50;
		font-size: 18px;
	}
	
	.image-counter {
		background: #f8f9fa;
		color: #495057;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 500;
	}
	
	.close-btn {
		background: none;
		border: none;
		font-size: 24px;
		cursor: pointer;
		color: #7f8c8d;
		padding: 8px;
		border-radius: 8px;
		transition: background-color 0.2s;
	}
	
	.close-btn:hover {
		background: #f8f9fa;
		color: #2c3e50;
	}
	
	.modal-body {
		display: flex;
		align-items: center;
		flex: 1;
		min-height: 0;
		position: relative;
	}
	
	.nav-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(0,0,0,0.5);
		color: white;
		border: none;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		font-size: 18px;
		cursor: pointer;
		transition: background-color 0.2s;
		z-index: 10;
	}
	
	.nav-btn:hover:not(.disabled) {
		background: rgba(0,0,0,0.7);
	}
	
	.nav-btn.disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
	
	.prev-btn {
		left: 16px;
	}
	
	.next-btn {
		right: 16px;
	}
	
	.image-viewer {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px 80px;
		min-height: 400px;
	}
	
	.modal-image {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		border-radius: 8px;
	}
	
	.modal-footer {
		padding: 20px 24px;
		border-top: 1px solid #eee;
		background: #f8f9fa;
		flex-shrink: 0;
	}
	
	.image-details {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
	}
	
	.detail-item {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	
	.detail-label {
		font-weight: 600;
		color: #495057;
		font-size: 14px;
	}
	
	.detail-value {
		color: #6c757d;
		font-size: 14px;
		word-break: break-all;
	}
	
	@media (max-width: 768px) {
		.gallery-page {
			padding: 16px;
		}
		
		.stats-grid {
			grid-template-columns: 1fr;
		}
		
		.category-filters {
			justify-content: center;
		}
		
		.image-grid {
			grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
			gap: 16px;
		}
		
		.modal-content {
			max-width: 95vw;
			max-height: 95vh;
		}
		
		.image-viewer {
			padding: 20px 60px;
		}
		
		.nav-btn {
			width: 40px;
			height: 40px;
			font-size: 16px;
		}
		
		.prev-btn {
			left: 12px;
		}
		
		.next-btn {
			right: 12px;
		}
		
		.image-details {
			grid-template-columns: 1fr;
		}
	}
</style>