# 食品管理功能簡化完成

## 修改時間
2024年12月18日 21:59

## 已移除的字段

### 1. 分類 (category)
- 移除了 10 種食品分類選項
- 移除了分類圖標顯示
- 簡化了食品卡片顯示

### 2. 單位 (unit)
- 移除了 8 種單位選項（公斤、公克、個等）
- 數量顯示不再包含單位

### 3. 狀態 (status)
- 移除了 4 種狀態選項（新鮮、即將過期、已過期、已用完）
- 移除了狀態標籤顯示
- 移除了新鮮食品統計卡片

### 4. 購買日期 (purchaseDate)
- 移除了購買日期字段
- 簡化了表單結構

### 5. 備註 (note)
- 移除了備註文字區域
- 移除了備註顯示

## 統計卡片優化

### 訂閱管理
- **原本**: 3個統計卡片（每月總支出、活躍訂閱、即將到期）
- **現在**: 4個統計卡片
  - 每月總支出
  - 活躍訂閱
  - 3天內到期 🚨
  - 7天內到期 ⏰

### 食品管理
- **原本**: 4個統計卡片（總價值、食品總數、即將過期、新鮮食品）
- **現在**: 4個統計卡片
  - 總價值
  - 食品總數
  - 7天內過期 🚨
  - 30天內過期 ⚠️

## 保留的字段

食品管理現在只包含以下核心字段：
1. **name** - 食品名稱（必填）
2. **amount** - 數量
3. **price** - 價格
4. **shop** - 商店
5. **todate** - 保存期限
6. **photourl** - 照片網址
7. **photo** - Sanity 圖片
8. **photohash** - 照片 hash

## 修改的文件

### Schema 文件
- `src/lib/sanity-schemas/food.js`
- `sanity-subscription-schema.js`

### API 文件
- `src/routes/api/foods/+server.js`

### 前端文件
- `src/routes/foods/+page.svelte`
- `src/routes/subscriptions/+page.svelte`

## CSS 清理

移除了未使用的 CSS 選擇器：
- `.category-icon`
- `.status-badge`
- `.form-group select`
- `.form-group textarea`
- 相關的 focus 狀態

## 測試結果

✅ **API 測試通過**
- 成功新增簡化的食品資料
- 所有必要字段正常工作
- 無 JavaScript 錯誤

## 資料結構對比

### 簡化前
```javascript
{
  name: "蘋果",
  amount: 5,
  price: 100,
  shop: "全聯",
  todate: "2024-12-31",
  photourl: "https://...",
  category: "fruits",      // 已移除
  unit: "piece",           // 已移除
  purchaseDate: "2024-12-01", // 已移除
  status: "fresh",         // 已移除
  note: "備註資訊"         // 已移除
}
```

### 簡化後
```javascript
{
  name: "蘋果",
  amount: 5,
  price: 100,
  shop: "全聯",
  todate: "2024-12-31",
  photourl: "https://..."
}
```

## 優勢

1. **更簡潔的介面** - 減少了不必要的選項和字段
2. **更快的操作** - 表單更簡單，填寫更快速
3. **更清晰的統計** - 到期提醒更精確（3天/7天 和 7天/30天）
4. **更好的維護性** - 代碼更簡潔，CSS 更乾淨

## 下一步建議

1. 在 Sanity Studio 中更新 schema 配置
2. 測試完整的 CRUD 功能
3. 驗證統計卡片的準確性
4. 考慮是否需要其他簡化