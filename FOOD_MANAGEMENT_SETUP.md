# 食品管理功能設置完成

## 已完成的工作

### 1. 創建 Sanity Schema
- 文件: `src/lib/sanity-schemas/food.js`
- 包含所有必要字段：name, amount, price, shop, todate, photourl, photo, photohash
- 新增額外字段：category, unit, purchaseDate, status, note
- 提供分類選項（蔬菜、水果、肉類等）
- 提供單位選項（公斤、公克、個等）
- 提供狀態選項（新鮮、即將過期、已過期、已用完）

### 2. 創建 API 端點
- 文件: `src/routes/api/foods/+server.js`
- 支援 GET（查詢所有食品）
- 支援 POST（新增食品）
- 支援 PATCH（更新食品）
- 支援 DELETE（刪除食品）
- 包含完整的錯誤處理和權限檢查

### 3. 創建食品管理頁面
- 文件: `src/routes/foods/+page.svelte`
- 仿照訂閱管理的設計風格
- 包含統計卡片：總價值、食品總數、即將過期、新鮮食品
- 食品卡片顯示：
  - 食品名稱和分類圖標
  - 購買商店
  - 數量和單位
  - 價格
  - 購買日期
  - 保存期限（含倒數天數）
  - 狀態標籤
  - 照片顯示
  - 備註
- 新增/編輯模態視窗
- 完整的 CRUD 功能

### 4. 更新導航組件
- 文件: `src/lib/components/Navigation.svelte`
- 新增「食品管理」連結
- 使用 🍽️ 圖標

### 5. 更新 Sanity 配置
- 文件: `src/lib/sanity.js`
- 新增食品相關函數：getFoods, getFood, createFood, updateFood, deleteFood

### 6. 更新 Schema 配置文件
- 文件: `sanity-subscription-schema.js`
- 包含完整的 subscription 和 food schema 定義
- 可用於 Sanity Studio 配置

## 功能特色

### 智能到期提醒
- 自動計算距離保存期限的天數
- 7天內即將過期會顯示警告顏色
- 已過期會顯示紅色標記

### 分類管理
- 10種食品分類，每種都有對應的表情符號圖標
- 便於快速識別食品類型

### 狀態追蹤
- 新鮮、即將過期、已過期、已用完四種狀態
- 不同狀態使用不同顏色標識

### 照片支援
- 支援照片 URL
- 支援 Sanity 圖片上傳
- 支援照片 hash 儲存

## 使用方式

1. 訪問 `/foods` 路徑查看食品管理頁面
2. 點擊「+ 新增食品」按鈕新增食品
3. 填寫食品資訊（名稱為必填）
4. 點擊「儲存」完成新增
5. 在食品卡片上點擊「編輯」或「刪除」進行管理

## 注意事項

### Sanity Studio 配置
如果您使用 Sanity Studio，需要將 food schema 加入到 Studio 配置中：

```javascript
import food from './src/lib/sanity-schemas/food'

export default defineConfig({
  // ... 其他配置
  schema: {
    types: [food, /* 其他 schemas */]
  }
})
```

### API Token 權限
確保您的 Sanity API Token 具有以下權限：
- 讀取權限（查詢食品）
- 寫入權限（新增/更新食品）
- 刪除權限（刪除食品）

## 資料結構

```javascript
{
  _type: 'food',
  name: '蘋果',              // 必填
  amount: 5,                 // 數量
  price: 100,                // 價格
  shop: '全聯',              // 商店
  todate: '2024-12-31',      // 保存期限
  photourl: 'https://...',   // 照片網址
  photo: { ... },            // Sanity 圖片
  photohash: 'abc123',       // 照片 hash
  category: 'fruits',        // 分類
  unit: 'piece',             // 單位
  purchaseDate: '2024-12-01', // 購買日期
  status: 'fresh',           // 狀態
  note: '備註資訊'           // 備註
}
```

## 下一步建議

1. 在 Sanity Studio 中配置 food schema
2. 測試新增、編輯、刪除功能
3. 上傳測試照片
4. 根據需求調整分類和單位選項
5. 考慮新增批量操作功能
6. 考慮新增搜尋和篩選功能
