# 訂閱管理 Schema 匹配修復

## 🔧 問題描述

訂閱管理的表單結構與 Sanity schema 不匹配，導致數據結構不一致。

## 📋 Sanity Schema 結構

根據提供的 schema，`subscription` 的實際字段為：

```javascript
{
  name: 'subscription',
  title: 'Subscription', 
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'site', title: 'Site', type: 'url' },
    { name: 'price', title: 'Price', type: 'number' },
    { name: 'nextdate', title: 'NextDate', type: 'date' },
    { name: 'note', title: 'Note', type: 'text' },
    { name: 'account', title: 'Account', type: 'string' }
  ]
}
```

## ✅ 修復內容

### 1. 表單字段更新

**修復前 (複雜結構):**
- `name`, `url`, `price`, `currency`, `nextDate`, `billingCycle`, `status`, `category`, `note`, `autoRenew`, `paymentMethod`, `startDate`, `reminderDays`

**修復後 (匹配 Schema):**
- `name` - 服務名稱 *
- `site` - 服務網址
- `price` - 價格 *
- `nextdate` - 下次付款日期 *
- `note` - 備註
- `account` - 帳戶資訊

### 2. API 數據結構更新

**更新前:**
```javascript
{
  _id: '1',
  name: 'Netflix',
  url: 'https://netflix.com',
  price: 390,
  currency: 'TWD',
  nextDate: '2025-01-15',
  billingCycle: 'monthly',
  // ... 更多複雜字段
}
```

**更新後:**
```javascript
{
  _id: '1',
  name: 'Netflix',
  site: 'https://netflix.com',
  price: 390,
  nextdate: '2025-01-15',
  note: '家庭方案，4K畫質',
  account: 'family@example.com'
}
```

### 3. 表單 HTML 簡化

移除了不必要的複雜字段：
- ❌ 幣別選擇 (統一使用 TWD)
- ❌ 計費週期 (簡化為月付)
- ❌ 狀態管理 (統一為啟用)
- ❌ 分類系統
- ❌ 付款方式
- ❌ 自動續訂設定
- ❌ 提醒天數

保留核心字段：
- ✅ 服務名稱 (必填)
- ✅ 服務網址
- ✅ 價格 (必填)
- ✅ 下次付款日期 (必填)
- ✅ 帳戶資訊
- ✅ 備註

### 4. 顯示界面優化

**卡片顯示更新:**
- 使用 `site` 替代 `url`
- 使用 `nextdate` 替代 `nextDate`
- 添加帳戶資訊顯示
- 簡化狀態顯示 (統一為"啟用中")
- 移除複雜的計費週期顯示

**新增帳戶資訊樣式:**
```css
.account-info {
  background: #eff6ff;
  padding: 8px 12px;
  border-radius: 6px;
  color: #1e40af;
}
```

### 5. 統計計算簡化

**修復前:**
```javascript
// 複雜的匯率轉換和狀態檢查
const priceInTWD = sub.currency === 'USD' ? sub.price * 31 : sub.price;
if (sub.status === 'active') { ... }
```

**修復後:**
```javascript
// 簡化計算，所有訂閱視為啟用
totalMonthlySpend = subscriptions.reduce((total, sub) => {
  return total + (sub.price || 0);
}, 0);
```

## 🧪 測試結果

### API 測試
- ✅ GET `/api/subscriptions` - 成功載入 4 個訂閱
- ✅ 數據結構匹配 Sanity schema
- ✅ 字段名稱正確對應

### 頁面測試
- ✅ 訂閱頁面正常載入 (200)
- ✅ 表單字段匹配 schema
- ✅ 卡片顯示正確

### 功能測試
- ✅ 新增訂閱表單簡化
- ✅ 編輯功能正常
- ✅ 統計計算正確
- ✅ 響應式設計保持

## 📊 示例數據

更新後的訂閱數據：

```javascript
[
  {
    _id: '1',
    name: 'Netflix',
    site: 'https://netflix.com',
    price: 390,
    nextdate: '2025-01-15',
    note: '家庭方案，4K畫質',
    account: 'family@example.com'
  },
  {
    _id: '2', 
    name: 'GitHub Pro',
    site: 'https://github.com',
    price: 4,
    nextdate: '2025-01-20',
    note: '個人開發使用，私有倉庫',
    account: 'developer@example.com'
  },
  // ...
]
```

## 🎯 優勢

### 簡化優勢
1. **數據一致性** - 完全匹配 Sanity schema
2. **表單簡化** - 減少用戶輸入複雜度
3. **維護容易** - 減少字段管理負擔
4. **性能提升** - 減少數據處理邏輯

### 用戶體驗改善
1. **快速新增** - 只需填寫核心資訊
2. **清晰顯示** - 重點資訊突出
3. **帳戶管理** - 新增帳戶資訊字段
4. **統一風格** - 與其他模組保持一致

## 🚀 結果

訂閱管理現在完全匹配 Sanity schema 結構，表單簡化且功能完整，用戶可以輕鬆管理訂閱服務。