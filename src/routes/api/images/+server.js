import { json } from '@sveltejs/kit';
import { readdir } from 'fs/promises';
import { join } from 'path';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	try {
		const imagesDir = join(process.cwd(), 'static', 'images');
		const files = await readdir(imagesDir);
		
		// 過濾出圖片文件
		const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
		const imageFiles = files.filter(file => {
			const ext = file.toLowerCase().substring(file.lastIndexOf('.'));
			return imageExtensions.includes(ext);
		});
		
		// 創建圖片對象數組
		const images = imageFiles.map((filename, index) => ({
			id: index + 1,
			filename,
			url: `/images/${filename}`,
			category: getImageCategory(filename),
			title: getImageTitle(filename),
			// 這裡可以添加實際的文件大小獲取邏輯
			size: Math.floor(Math.random() * 2000 + 500) + 'KB'
		}));
		
		return json({
			success: true,
			images,
			total: images.length
		});
		
	} catch (error) {
		console.error('獲取圖片列表失敗:', error);
		return json({
			success: false,
			error: '無法讀取圖片目錄',
			images: [],
			total: 0
		}, { status: 500 });
	}
}

function getImageCategory(filename) {
	if (filename.includes('ChatGPT')) return 'ChatGPT';
	if (filename.includes('Gemini')) return 'Gemini';
	if (filename.includes('MindVideo')) return 'MindVideo';
	if (filename.includes('Screenshot')) return 'Screenshot';
	return '其他';
}

function getImageTitle(filename) {
	// 移除副檔名並簡化標題
	let title = filename.replace(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i, '');
	
	// 特殊處理不同類型的圖片
	if (title.includes('ChatGPT Image')) {
		const dateMatch = title.match(/(\d{4}年\d{1,2}月\d{1,2}日)/);
		if (dateMatch) {
			return `ChatGPT 圖片 - ${dateMatch[1]}`;
		}
		return 'ChatGPT 生成圖片';
	}
	
	if (title.includes('Gemini_Generated_Image')) {
		return 'Gemini 生成圖片';
	}
	
	if (title.includes('MindVideo')) {
		const dateMatch = title.match(/(\d{8})/);
		if (dateMatch) {
			const date = dateMatch[1];
			const year = date.substring(0, 4);
			const month = date.substring(4, 6);
			const day = date.substring(6, 8);
			return `MindVideo - ${year}/${month}/${day}`;
		}
		return 'MindVideo 圖片';
	}
	
	if (title.includes('Screenshot')) {
		return '螢幕截圖';
	}
	
	// 處理中文檔名
	if (title.length > 30) {
		return title.substring(0, 30) + '...';
	}
	
	return title;
}