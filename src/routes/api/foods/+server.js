import { json } from '@sveltejs/kit';
import { sanityClient } from '$lib/sanity.js';

export async function GET() {
	try {
		const foods = await sanityClient.fetch(`
			*[_type == "food"] | order(_createdAt desc) {
				_id,
				name,
				amount,
				price,
				shop,
				todate,
				photourl,
				photo,
				photohash,
				_createdAt,
				_updatedAt
			}
		`);
		
		return json(foods);
	} catch (error) {
		console.error('Error fetching foods:', error);
		return json({ error: 'Failed to fetch foods' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const data = await request.json();
		
		// 驗證必填字段
		if (!data.name?.trim()) {
			return json({ 
				error: 'Validation failed',
				details: { name: '食品名稱為必填項目' }
			}, { status: 400 });
		}
		
		// 準備要儲存的資料
		const foodData = {
			_type: 'food',
			name: data.name.trim(),
			amount: data.amount ? Number(data.amount) : undefined,
			price: data.price ? Number(data.price) : undefined,
			shop: data.shop?.trim() || undefined,
			todate: data.todate || undefined,
			photourl: data.photourl?.trim() || undefined,
			photohash: data.photohash?.trim() || undefined
		};
		
		// 移除 undefined 值
		Object.keys(foodData).forEach(key => {
			if (foodData[key] === undefined) {
				delete foodData[key];
			}
		});
		
		const result = await sanityClient.create(foodData);
		
		return json(result);
	} catch (error) {
		console.error('Error creating food:', error);
		
		if (error.statusCode === 403) {
			return json({
				error: 'Permission denied',
				details: '沒有權限建立食品資料',
				suggestion: '請檢查 Sanity API Token 是否有寫入權限'
			}, { status: 403 });
		}
		
		return json({ error: 'Failed to create food' }, { status: 500 });
	}
}

export async function PATCH({ request }) {
	try {
		const data = await request.json();
		
		if (!data.id) {
			return json({ error: 'Food ID is required' }, { status: 400 });
		}
		
		// 驗證必填字段
		if (!data.name?.trim()) {
			return json({ 
				error: 'Validation failed',
				details: { name: '食品名稱為必填項目' }
			}, { status: 400 });
		}
		
		// 準備要更新的資料
		const updateData = {
			name: data.name.trim(),
			amount: data.amount ? Number(data.amount) : undefined,
			price: data.price ? Number(data.price) : undefined,
			shop: data.shop?.trim() || undefined,
			todate: data.todate || undefined,
			photourl: data.photourl?.trim() || undefined,
			photohash: data.photohash?.trim() || undefined
		};
		
		// 移除 undefined 值
		Object.keys(updateData).forEach(key => {
			if (updateData[key] === undefined) {
				delete updateData[key];
			}
		});
		
		const result = await sanityClient
			.patch(data.id)
			.set(updateData)
			.commit();
		
		return json(result);
	} catch (error) {
		console.error('Error updating food:', error);
		
		if (error.statusCode === 403) {
			return json({
				error: 'Permission denied',
				details: '沒有權限更新食品資料',
				suggestion: '請檢查 Sanity API Token 是否有寫入權限'
			}, { status: 403 });
		}
		
		return json({ error: 'Failed to update food' }, { status: 500 });
	}
}

export async function DELETE({ request }) {
	try {
		const { id } = await request.json();
		
		if (!id) {
			return json({ error: 'Food ID is required' }, { status: 400 });
		}
		
		await sanityClient.delete(id);
		
		return json({ success: true });
	} catch (error) {
		console.error('Error deleting food:', error);
		
		if (error.statusCode === 403) {
			return json({
				error: 'Permission denied',
				details: '沒有權限刪除食品資料',
				suggestion: '請檢查 Sanity API Token 是否有寫入權限'
			}, { status: 403 });
		}
		
		return json({ error: 'Failed to delete food' }, { status: 500 });
	}
}