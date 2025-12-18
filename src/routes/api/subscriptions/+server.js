import { json } from '@sveltejs/kit';
import { 
	getSubscriptions, 
	getSubscription, 
	createSubscription, 
	updateSubscription, 
	deleteSubscription 
} from '$lib/sanity.js';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	try {
		const subscriptions = await getSubscriptions();
		return json(subscriptions);
	} catch (error) {
		console.error('獲取訂閱列表失敗:', error);
		return json({ error: '無法獲取訂閱列表' }, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const data = await request.json();
		
		// 驗證必填字段 (只有服務名稱和下次付款日期是必填)
		if (!data.name || !data.nextdate) {
			console.log('Validation failed:', { 
				name: data.name, 
				nextdate: data.nextdate,
				hasName: !!data.name,
				hasNextdate: !!data.nextdate
			});
			return json({ 
				error: '缺少必填字段',
				details: {
					name: !data.name ? '服務名稱為必填' : null,
					nextdate: !data.nextdate ? '下次付款日期為必填' : null
				}
			}, { status: 400 });
		}
		
		// 創建新訂閱到 Sanity
		const subscriptionData = {
			name: data.name,
			site: data.site || '',
			price: data.price ? parseFloat(data.price) : 0,
			nextdate: data.nextdate,
			note: data.note || '',
			account: data.account || ''
		};
		
		const newSubscription = await createSubscription(subscriptionData);
		return json(newSubscription, { status: 201 });
	} catch (error) {
		console.error('創建訂閱失敗:', error);
		
		// 檢查是否是權限問題
		if (error.statusCode === 403) {
			return json({ 
				error: 'Sanity API Token 權限不足',
				details: '需要 "create" 權限才能新增訂閱',
				suggestion: '請檢查 Sanity 項目的 API Token 權限設置'
			}, { status: 403 });
		}
		
		return json({ 
			error: '創建訂閱失敗',
			details: error.message || '未知錯誤'
		}, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ request }) {
	try {
		const data = await request.json();
		
		if (!data.id) {
			return json({ error: '缺少訂閱 ID' }, { status: 400 });
		}
		
		// 準備更新數據
		const updateData = {};
		if (data.name) updateData.name = data.name;
		if (data.site !== undefined) updateData.site = data.site;
		if (data.price !== undefined) updateData.price = parseFloat(data.price);
		if (data.nextdate) updateData.nextdate = data.nextdate;
		if (data.note !== undefined) updateData.note = data.note;
		if (data.account !== undefined) updateData.account = data.account;
		
		// 更新 Sanity 中的訂閱
		const updatedSubscription = await updateSubscription(data.id, updateData);
		return json(updatedSubscription);
	} catch (error) {
		console.error('更新訂閱失敗:', error);
		
		if (error.statusCode === 403) {
			return json({ 
				error: 'Sanity API Token 權限不足',
				details: '需要 "update" 權限才能修改訂閱'
			}, { status: 403 });
		}
		
		return json({ 
			error: '更新訂閱失敗',
			details: error.message || '未知錯誤'
		}, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request }) {
	try {
		const data = await request.json();
		
		if (!data.id) {
			return json({ error: '缺少訂閱 ID' }, { status: 400 });
		}
		
		// 從 Sanity 刪除訂閱
		const deletedSubscription = await deleteSubscription(data.id);
		
		return json({ message: '訂閱已刪除', subscription: deletedSubscription });
	} catch (error) {
		console.error('刪除訂閱失敗:', error);
		
		if (error.statusCode === 403) {
			return json({ 
				error: 'Sanity API Token 權限不足',
				details: '需要 "delete" 權限才能刪除訂閱',
				suggestion: '請檢查 Sanity 項目的 API Token 權限設置'
			}, { status: 403 });
		}
		
		return json({ 
			error: '刪除訂閱失敗',
			details: error.message || '未知錯誤'
		}, { status: 500 });
	}
}