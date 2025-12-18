<script>
	import { onMount } from 'svelte';
	
	let videoCount = 2;
	let showUploadGuide = false;
	
	// 影片資料
	const videos = [
		{
			id: 1,
			title: "鋒兄的傳奇人生",
			url: "https://cdn.sanity.io/files/sy4ovumo/production/e563b32430ecc93251bb6ea976d49aa6a5e63ae9.mp4",
			thumbnail: "",
			description: "鋒兄傳奇人生的精彩回顧"
		},
		{
			id: 2,
			title: "鋒兄進化Show🔥",
			url: "https://cdn.sanity.io/files/sy4ovumo/production/33993de029ff5de1f2a2023fb713773cbfc7d381.mp4",
			thumbnail: "",
			description: "鋒兄進化歷程的精彩展示"
		}
	];
	
	let selectedVideo = null;
	

	
	function toggleUploadGuide() {
		showUploadGuide = !showUploadGuide;
	}
	
	function playVideo(video) {
		selectedVideo = video;
	}
	
	function closeVideo() {
		selectedVideo = null;
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
			精選影片收藏，隨時觀看鋒兄的精彩內容
		</p>
		
		<div class="stats-grid">
			<div class="stat-item">
				<div class="stat-label">影片數量：</div>
				<div class="stat-value">{videoCount}</div>
			</div>
			
			<div class="stat-item">
				<div class="stat-label">總時長：</div>
				<div class="stat-value">約 15 分鐘</div>
			</div>
			
			<div class="stat-item">
				<div class="stat-label">狀態：</div>
				<div class="stat-value">可播放</div>
			</div>
		</div>
	</div>

	<!-- 影片庫區域 -->
	<div class="video-library">
		<div class="section-header">
			<div class="section-icon">🎬</div>
			<h3>影片庫</h3>
		</div>
		
		<div class="video-grid">
			{#each videos as video}
				<div class="video-card" on:click={() => playVideo(video)}>
					<div class="video-thumbnail">
						<div class="play-button">▶️</div>
						<div class="video-duration">點擊播放</div>
					</div>
					<div class="video-info">
						<h4 class="video-title">{video.title}</h4>
						<p class="video-description">{video.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>


</div>

<!-- 影片播放器模態視窗 -->
{#if selectedVideo}
	<div class="video-modal" on:click={closeVideo}>
		<div class="modal-content" on:click|stopPropagation>
			<div class="modal-header">
				<h3>{selectedVideo.title}</h3>
				<button class="close-btn" on:click={closeVideo}>✕</button>
			</div>
			<div class="video-container">
				<video controls autoplay preload="none">
					<source src={selectedVideo.url} type="video/mp4">
					您的瀏覽器不支援影片播放。
				</video>
			</div>
			<div class="modal-footer">
				<p>{selectedVideo.description}</p>
			</div>
		</div>
	</div>
{/if}

<style>
	.video-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 16px;
		box-sizing: border-box;
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
		min-height: 100px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow: hidden;
	}
	
	.stat-label {
		font-size: 14px;
		opacity: 0.8;
		margin-bottom: 8px;
		word-wrap: break-word;
		hyphens: auto;
	}
	
	.stat-value {
		font-size: 24px;
		font-weight: 700;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}
	

	
	/* 影片庫樣式 */
	.video-library {
		background: white;
		padding: 32px;
		border-radius: 16px;
		margin-bottom: 32px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}
	
	.video-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 20px;
		margin-top: 24px;
	}
	
	.video-card {
		background: #f8f9fa;
		border-radius: 12px;
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.3s, box-shadow 0.3s;
		border: 2px solid transparent;
	}
	
	.video-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0,0,0,0.15);
		border-color: #667eea;
	}
	
	.video-thumbnail {
		position: relative;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		height: 180px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
	}
	
	.play-button {
		font-size: 48px;
		opacity: 0.9;
	}
	
	.video-duration {
		position: absolute;
		bottom: 12px;
		right: 12px;
		background: rgba(0,0,0,0.7);
		color: white;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 12px;
	}
	
	.video-info {
		padding: 20px;
	}
	
	.video-title {
		margin: 0 0 8px 0;
		color: #2c3e50;
		font-size: 18px;
		font-weight: 600;
	}
	
	.video-description {
		margin: 0;
		color: #7f8c8d;
		font-size: 14px;
		line-height: 1.5;
	}
	
	/* 影片播放器模態視窗 */
	.video-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 20px;
	}
	
	.modal-content {
		background: white;
		border-radius: 16px;
		max-width: 900px;
		width: 100%;
		max-height: 90vh;
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(0,0,0,0.3);
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 24px;
		border-bottom: 1px solid #eee;
	}
	
	.modal-header h3 {
		margin: 0;
		color: #2c3e50;
		font-size: 20px;
	}
	
	.close-btn {
		background: none;
		border: none;
		font-size: 24px;
		cursor: pointer;
		color: #7f8c8d;
		padding: 4px;
		border-radius: 4px;
		transition: background-color 0.2s;
	}
	
	.close-btn:hover {
		background: #f8f9fa;
		color: #2c3e50;
	}
	
	.video-container {
		position: relative;
		width: 100%;
		height: 0;
		padding-bottom: 56.25%; /* 16:9 比例 */
		background: #000;
	}
	
	.video-container video {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		background: #000;
	}
	
	.modal-footer {
		padding: 20px 24px;
		border-top: 1px solid #eee;
		background: #f8f9fa;
	}
	
	.modal-footer p {
		margin: 0;
		color: #7f8c8d;
		line-height: 1.5;
	}
	
	/* 150% 縮放支援 - 針對瀏覽器縮放 */
	@media (max-width: 1200px) {
		.video-page {
			max-width: 900px;
			padding: 0 16px;
		}
		
		.stats-grid {
			grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
			gap: 16px;
		}
		
		.stat-item {
			padding: 16px;
		}
		
		.stat-value {
			font-size: 20px;
		}
		
		.video-grid {
			grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
			gap: 16px;
		}
		
		.video-stats-card,
		.video-library {
			padding: 24px;
		}
		
		.section-header h3 {
			font-size: 18px;
		}
		
		.stats-header h2 {
			font-size: 22px;
		}
		
		.modal-content {
			max-width: 850px;
		}
	}
	
	/* 中等縮放支援 */
	@media (max-width: 1000px) {
		.video-page {
			max-width: 800px;
			padding: 0 12px;
		}
		
		.stats-grid {
			grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
			gap: 12px;
		}
		
		.stat-item {
			padding: 12px;
		}
		
		.stat-value {
			font-size: 18px;
		}
		
		.video-grid {
			grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
			gap: 12px;
		}
		
		.video-stats-card,
		.video-library {
			padding: 20px;
		}
	}
	
	/* 縮放支援 */
	@media (min-resolution: 1.5dppx), (min-resolution: 144dpi) {
		.video-page {
			max-width: 900px;
		}
		
		.video-grid {
			grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
			gap: 24px;
		}
		
		.modal-content {
			max-width: 1000px;
		}
	}
	
	/* 高縮放比例支援 */
	@media (min-resolution: 2dppx), (min-resolution: 192dpi) {
		.video-page {
			max-width: 1000px;
		}
		
		.video-grid {
			grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		}
	}
	
	@media (max-width: 768px) {
		.video-page {
			padding: 0 12px;
		}
		
		.stats-grid {
			grid-template-columns: 1fr;
		}
		

		
		.video-grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}
		
		.video-modal {
			padding: 10px;
		}
		
		.modal-content {
			max-height: 95vh;
		}
		
		.video-container {
			padding-bottom: 75%; /* 調整手機版比例 */
		}
		
		.video-stats-card,
		.video-library {
			padding: 20px;
		}
	}
	
	@media (max-width: 480px) {
		.video-page {
			padding: 0 8px;
		}
		
		.page-header h1 {
			font-size: 24px;
		}
		
		.stats-header h2 {
			font-size: 20px;
		}
		
		.section-header h3 {
			font-size: 18px;
		}
		
		.video-grid {
			grid-template-columns: 1fr;
			gap: 12px;
		}
		
		.video-stats-card,
		.video-library {
			padding: 16px;
		}
	}
</style>