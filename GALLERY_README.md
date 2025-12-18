# 鋒兄圖片庫系統

基於 SvelteKit 構建的智能圖片管理系統，支援自動分類、搜尋和預覽功能。

## 🌟 功能特色

### 📊 智能統計
- 實時顯示圖片總數
- 按分類統計圖片數量
- 動態載入統計數據

### 🔍 強大搜尋
- 即時搜尋圖片標題和檔名
- 按分類篩選圖片
- 支援中英文搜尋

### 🎨 智能分類
- **ChatGPT**: AI 生成的圖片
- **Gemini**: Google Gemini 生成的圖片  
- **MindVideo**: MindVideo 平台圖片
- **Screenshot**: 螢幕截圖
- **其他**: 其他類型圖片

### 🖼️ 優雅預覽
- 響應式網格佈局
- 全螢幕圖片檢視器
- 鍵盤導航支援 (←/→/Esc)
- 圖片資訊顯示

### 📱 響應式設計
- 完美適配桌面和行動裝置
- 觸控友好的操作介面
- 自適應網格佈局

## 🚀 快速開始

### 1. 啟動開發服務器
```bash
npm run dev
```

### 2. 訪問圖片庫
- 首頁: http://localhost:5173/
- 圖片庫: http://localhost:5173/gallery
- 影片庫: http://localhost:5173/videos

### 3. 添加圖片
將圖片文件放入 `static/images/` 目錄，系統會自動檢測並分類。

## 📁 項目結構

```
src/
├── routes/
│   ├── +layout.svelte          # 主佈局 (包含導航)
│   ├── +page.svelte             # 首頁
│   ├── gallery/
│   │   └── +page.svelte         # 圖片庫頁面
│   └── api/
│       └── images/
│           └── +server.js       # 圖片 API
├── lib/
│   └── components/
│       └── Navigation.svelte    # 導航組件
└── app.html                     # HTML 模板

static/
└── images/                      # 圖片存儲目錄
    ├── placeholder.svg          # 預留位置圖片
    └── [你的圖片文件]
```

## 🔧 API 端點

### GET /api/images
返回所有圖片的列表和元數據

**響應格式:**
```json
{
  "success": true,
  "images": [
    {
      "id": 1,
      "filename": "example.jpg",
      "url": "/images/example.jpg",
      "category": "其他",
      "title": "示例圖片",
      "size": "1.2MB"
    }
  ],
  "total": 150
}
```

## 🎯 分類規則

系統根據檔名自動分類圖片:

- **ChatGPT**: 檔名包含 "ChatGPT"
- **Gemini**: 檔名包含 "Gemini"  
- **MindVideo**: 檔名包含 "MindVideo"
- **Screenshot**: 檔名包含 "Screenshot"
- **其他**: 不符合上述規則的圖片

## ⌨️ 鍵盤快捷鍵

在圖片檢視器中:
- `←` / `→`: 上一張/下一張圖片
- `Esc`: 關閉檢視器

## 🎨 自定義樣式

系統使用現代 CSS 特性:
- CSS Grid 響應式佈局
- CSS 漸變背景
- 平滑過渡動畫
- 毛玻璃效果 (backdrop-filter)

## 📱 行動裝置支援

- 觸控友好的操作介面
- 自適應網格佈局
- 優化的導航體驗
- 手勢支援 (滑動切換圖片)

## 🔮 未來計劃

- [ ] 圖片上傳功能
- [ ] 批量操作 (刪除、移動)
- [ ] 標籤系統
- [ ] 圖片編輯功能
- [ ] 雲端同步
- [ ] AI 圖片描述生成

## 🛠️ 技術棧

- **前端**: SvelteKit, CSS3
- **後端**: Node.js (SvelteKit API)
- **部署**: 支援 Netlify, Vercel 等平台

## 📄 授權

MIT License - 自由使用和修改

---

**享受使用鋒兄圖片庫系統！** 🎉