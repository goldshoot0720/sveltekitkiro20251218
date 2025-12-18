# AWS Amplify 部署指南

## 項目配置

此 SvelteKit 應用程式已配置為在 AWS Amplify 上部署，使用預設的 `@sveltejs/adapter-auto`。

### 配置文件

1. **amplify.yml** - Amplify 構建配置
2. **svelte.config.js** - 使用 `@sveltejs/adapter-auto` 配置（預設）

### 部署步驟

#### 方法 1: 通過 Git 連接

1. 將代碼推送到 GitHub/GitLab/Bitbucket
2. 登入 [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
3. 點擊 "New app" > "Host web app"
4. 選擇你的 Git 提供商並授權
5. 選擇倉庫和分支
6. Amplify 會自動檢測到 `amplify.yml` 配置文件
7. 點擊 "Save and deploy"

#### 方法 2: 手動部署

1. 確保已構建項目：
   ```bash
   npm run build
   ```

2. 將 `build` 文件夾的內容上傳到 Amplify

### 環境變數

如果你的應用程式使用環境變數，在 Amplify Console 中設置：

1. 進入你的應用程式
2. 點擊 "Environment variables"
3. 添加必要的環境變數（如 Sanity 配置）

### 自定義域名

1. 在 Amplify Console 中點擊 "Domain management"
2. 添加你的自定義域名
3. 按照指示配置 DNS 記錄

### 注意事項

- 使用 `@sveltejs/adapter-auto` 讓 SvelteKit 自動檢測部署環境
- Amplify 會自動處理 SSR 和路由
- API 路由將在伺服器端處理
- 確保 Sanity 配置正確設置了 CORS 域名

### 構建輸出

構建後的文件位於 `.svelte-kit/output/client/` 目錄中，包含：
- 客戶端靜態文件
- 伺服器端渲染文件
- 自動生成的路由處理

### 故障排除

如果遇到問題，檢查：
1. `amplify.yml` 配置是否正確
2. 環境變數是否正確設置
3. Sanity 配置是否正確