<script>
	let videoCount = 2;
	let storageUsed = 0;
	let totalStorage = 2;
	
	let showUploadGuide = false;
	
	function toggleUploadGuide() {
		showUploadGuide = !showUploadGuide;
	}
</script>

<div class="video-page">
	<div class="page-header">
		<h1>鋒兄影片庫</h1>
	</div>

	<div class="video-stats-card">
		<div class="stats-header">
			<div class="stats-icon">🎬</div>
			<h2>影片雲端管理</h2>
		</div>
		
		<p class="stats-description">
			使用 Netlify Blobs 儲存影片，支援本地快取與離線播放
		</p>
		
		<div class="stats-grid">
			<div class="stat-item">
				<div class="stat-label">影片數量：</div>
				<div class="stat-value">{videoCount}</div>
			</div>
			
			<div class="stat-item">
				<div class="stat-label">快取大小：</div>
				<div class="stat-value">{storageUsed} Bytes</div>
			</div>
			
			<div class="stat-item">
				<div class="stat-label">已快取：</div>
				<div class="stat-value">{storageUsed}/{totalStorage}</div>
			</div>
		</div>
	</div>

	<div class="management-section">
		<div class="section-header">
			<div class="section-icon">📁</div>
			<h3>快取管理</h3>
		</div>
		
		<button class="netlify-btn" on:click={toggleUploadGuide}>
			🔍 檢查 Netlify Blobs
		</button>
	</div>

	{#if showUploadGuide}
		<div class="upload-guide">
			<div class="guide-header">
				<div class="guide-icon">⚠️</div>
				<h3>影片上傳指南</h3>
			</div>
			
			<p class="guide-description">
				將影片上傳至 Netlify Blobs，請依照以下步驟：
			</p>
			
			<ol class="guide-steps">
				<li>
					<strong>準備影片檔案：</strong>
					<code>public/videos/</code> 資料夾中的影片檔案
				</li>
				<li>
					<strong>執行上傳指令：</strong>
					<code>npm run upload-videos</code>
				</li>
				<li>
					<strong>或使用 Netlify CLI：</strong>
					<code>netlify blobs:set videos [file-path] -i [file-path]</code>
				</li>
				<li>
					<strong>驗證上傳：</strong>
					🔍 檢查 Netlify Blobs 查看上傳狀態
				</li>
			</ol>
		</div>
		
		<div class="quick-package">
			<div class="package-header">
				<div class="package-icon">⚠️</div>
				<h3>快取包裝</h3>
			</div>
			
			<div class="package-actions">
				<button class="package-btn primary">📦 建立快取包</button>
				<button class="package-btn secondary">🔄 更新快取</button>
				<button class="package-btn danger">🗑️ 清除快取</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.video-page {
		max-width: 800px;
		margin: 0 auto;
	}
	
	.page-header {
		text-align: center;
		margin-bottom: 32px;
	}
	
	.page-header h1 {
		margin: 0;
		color: #2c3e50;
		font-size: 28px;
	}
	
	.video-stats-card {
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
		margin-bottom: 16px;
	}
	
	.stats-icon {
		font-size: 48px;
	}
	
	.stats-header h2 {
		margin: 0;
		font-size: 24px;
	}
	
	.stats-description {
		margin: 0 0 24px 0;
		opacity: 0.9;
		line-height: 1.6;
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
	
	.management-section {
		background: white;
		padding: 32px;
		border-radius: 16px;
		margin-bottom: 32px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}
	
	.section-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 24px;
	}
	
	.section-icon {
		font-size: 32px;
	}
	
	.section-header h3 {
		margin: 0;
		color: #2c3e50;
		font-size: 20px;
	}
	
	.netlify-btn {
		background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
		color: white;
		border: none;
		padding: 16px 32px;
		border-radius: 12px;
		font-size: 16px;
		cursor: pointer;
		transition: transform 0.2s;
		width: 100%;
	}
	
	.netlify-btn:hover {
		transform: translateY(-2px);
	}
	
	.upload-guide {
		background: #fff3cd;
		border: 2px solid #ffeaa7;
		border-radius: 16px;
		padding: 32px;
		margin-bottom: 24px;
	}
	
	.guide-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;
	}
	
	.guide-icon {
		font-size: 32px;
	}
	
	.guide-header h3 {
		margin: 0;
		color: #856404;
		font-size: 20px;
	}
	
	.guide-description {
		margin: 0 0 20px 0;
		color: #856404;
		line-height: 1.6;
	}
	
	.guide-steps {
		margin: 0;
		padding-left: 20px;
		color: #856404;
	}
	
	.guide-steps li {
		margin-bottom: 12px;
		line-height: 1.6;
	}
	
	.guide-steps code {
		background: rgba(133, 100, 4, 0.1);
		padding: 4px 8px;
		border-radius: 4px;
		font-family: 'Courier New', monospace;
		font-size: 14px;
	}
	
	.quick-package {
		background: white;
		border: 2px solid #f0f0f0;
		border-radius: 16px;
		padding: 32px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}
	
	.package-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 24px;
	}
	
	.package-icon {
		font-size: 32px;
	}
	
	.package-header h3 {
		margin: 0;
		color: #2c3e50;
		font-size: 20px;
	}
	
	.package-actions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
	}
	
	.package-btn {
		padding: 16px 24px;
		border: none;
		border-radius: 12px;
		font-size: 16px;
		cursor: pointer;
		transition: transform 0.2s;
	}
	
	.package-btn:hover {
		transform: translateY(-2px);
	}
	
	.package-btn.primary {
		background: #667eea;
		color: white;
	}
	
	.package-btn.secondary {
		background: #74b9ff;
		color: white;
	}
	
	.package-btn.danger {
		background: #fd79a8;
		color: white;
	}
	
	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}
		
		.package-actions {
			grid-template-columns: 1fr;
		}
	}
</style>