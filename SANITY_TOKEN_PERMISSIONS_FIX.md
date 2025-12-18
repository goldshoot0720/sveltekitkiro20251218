# Sanity API Token 權限修正指南

## 問題描述
出現錯誤：「權限不足: 需要 "delete" 權限才能刪除訂閱」

## 解決方案

### 1. 登入 Sanity Studio
前往你的 Sanity 項目管理頁面：
- 網址：https://www.sanity.io/manage
- 選擇你的項目 (Project ID: sy4ovumo)

### 2. 檢查 API Token 權限
1. 在項目頁面中，點擊 **"API"** 標籤
2. 找到 **"Tokens"** 區段
3. 查看你目前使用的 API Token

### 3. 更新 Token 權限
你的 API Token 需要以下權限：
- ✅ **Read** (讀取權限)
- ✅ **Write** (寫入權限) 
- ✅ **Delete** (刪除權限)

### 4. 創建新的 Token (如果需要)
如果現有 Token 權限不足：

1. 點擊 **"Add API token"**
2. 設置以下選項：
   - **Name**: `Production Token` (或任何你喜歡的名稱)
   - **Permissions**: 選擇 **"Editor"** 或 **"Admin"**
   - **Dataset**: `production`
3. 點擊 **"Save"**
4. **重要**: 複製新生成的 Token (只會顯示一次)

### 5. 更新環境變數
1. 在項目根目錄創建 `.env` 文件 (如果還沒有)
2. 添加或更新以下內容：

```env
VITE_SANITY_PROJECT_ID=sy4ovumo
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=你的新Token
```

### 6. 重啟開發服務器
更新環境變數後，重啟你的開發服務器：
```bash
npm run dev
```

## 權限等級說明

### Viewer (檢視者)
- ✅ Read
- ❌ Write
- ❌ Delete

### Editor (編輯者) - **推薦**
- ✅ Read
- ✅ Write
- ✅ Delete

### Admin (管理員)
- ✅ Read
- ✅ Write
- ✅ Delete
- ✅ 項目管理權限

## 安全建議
1. 不要將 API Token 提交到 Git 倉庫
2. 使用 `.env` 文件存儲敏感信息
3. 確保 `.env` 已添加到 `.gitignore`
4. 定期輪換 API Token

## 驗證修正
修正後，嘗試刪除一個測試訂閱來確認權限問題已解決。