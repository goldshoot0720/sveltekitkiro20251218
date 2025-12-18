# 鋒兄 AI 管理系統

一個使用 SvelteKit 建立的全功能管理系統，支援電腦、手機和平板裝置。

## 功能模組

### 📊 儀表板
- 顯示系統統計資訊
- 訂閱數量、食物庫存、每月總計
- 響應式卡片設計

### 📋 訂閱管理
- 新增/刪除訂閱服務
- 記錄服務名稱、網站、帳號、月費
- 追蹤下次扣款日期
- 自動計算每月總費用

### 🍱 食物管理
- 管理食物庫存
- 記錄食物名稱、數量、價格、購買商店
- 追蹤到期日期
- 數量增減控制
- 自動計算總價值

### 🎬 影片庫
- 影片雲端管理
- Netlify Blobs 整合
- 本地快取支援
- 離線播放功能

### 🖼️ 圖片庫
- 本地圖片瀏覽
- 支援網格/列表視圖
- 圖片搜尋功能
- 批量選擇和刪除
- 拖放上傳支援

## 技術棧

- **前端框架**: SvelteKit 2.x
- **UI 設計**: 自訂 CSS，響應式設計
- **圖標**: Emoji 圖標
- **部署**: Netlify (推薦)

## 開始使用

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 啟動

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 專案結構

```
src/
├── routes/
│   ├── +layout.svelte          # 全域佈局（側邊欄、導航）
│   ├── +page.svelte            # 儀表板頁面
│   ├── subscriptions/
│   │   └── +page.svelte        # 訂閱管理
│   ├── food/
│   │   └── +page.svelte        # 食物管理
│   ├── videos/
│   │   └── +page.svelte        # 影片庫
│   └── images/
│       └── +page.svelte        # 圖片庫
├── app.html                     # HTML 模板
└── app.css                      # 全域樣式

static/
└── images/                      # 靜態圖片資源
```

## 響應式設計

系統完全支援響應式設計：

- **手機版** (< 768px): 漢堡選單、全寬佈局
- **平板版** (768px - 1024px): 側邊欄、適中佈局
- **桌面版** (> 1024px): 完整側邊欄、寬屏佈局

## 功能特色

### 🎨 現代化 UI
- 漸層色彩設計
- 流暢動畫效果
- 卡片式佈局
- 懸浮按鈕 (FAB)

### 📱 移動優先
- 觸控友好的介面
- 手勢支援
- 快速載入
- 離線功能

### 🌙 深色模式
- 自動偵測系統主題
- 手動切換支援
- 護眼配色

### ♿ 無障礙設計
- 語義化 HTML
- ARIA 標籤
- 鍵盤導航
- 螢幕閱讀器支援

## 自訂配置

### 修改主題色彩

編輯 `src/app.css` 中的 CSS 變數：

```css
:root {
	--primary-color: #667eea;
	--secondary-color: #764ba2;
	--success-color: #4caf50;
	--danger-color: #f44336;
}
```

### 新增功能模組

1. 在 `src/routes/` 建立新資料夾
2. 新增 `+page.svelte` 檔案
3. 在 `+layout.svelte` 的 `menuItems` 陣列中新增選單項目

## 部署

### Netlify

1. 連接 GitHub 儲存庫
2. 建置指令: `npm run build`
3. 發布目錄: `build`
4. 自動部署

### Vercel

```bash
npm install -g vercel
vercel
```

### 其他平台

參考 [SvelteKit 部署文件](https://kit.svelte.dev/docs/adapters)

## 授權

©版權所有 2025～2125 | 專業管理系統解決方案

## 技術支援

如有問題或建議，請開啟 Issue 或 Pull Request。

---

**鋒兄塗哥公開資訊**  
PROFESSIONAL BUSINESS SOLUTIONS
