# 鋒兄媒體庫 - 本地測試腳本
# 使用方法: .\test-local.ps1

Write-Host "🎬 鋒兄媒體庫 - 本地測試腳本" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# 檢查開發服務器狀態
Write-Host "📡 檢查開發服務器狀態..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173/" -Method GET -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ 開發服務器運行正常 (狀態: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ 開發服務器未運行，請先執行 'npm run dev'" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 測試所有頁面
Write-Host "🧪 測試所有頁面..." -ForegroundColor Yellow
$pages = @(
    @{name="首頁"; url="http://localhost:5173/"},
    @{name="影片庫"; url="http://localhost:5173/videos"},
    @{name="圖片庫"; url="http://localhost:5173/gallery"},
    @{name="訂閱管理"; url="http://localhost:5173/subscriptions"}
)

foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri $page.url -Method GET -UseBasicParsing -TimeoutSec 5
        Write-Host "✅ $($page.name) - 狀態: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ $($page.name) - 錯誤: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# 測試 API
Write-Host "🔌 測試 API 端點..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173/api/images" -Method GET -UseBasicParsing -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ 圖片 API - 成功載入 $($data.total) 張圖片" -ForegroundColor Green
} catch {
    Write-Host "❌ 圖片 API - 錯誤: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 顯示快速鏈接
Write-Host "🌐 快速訪問鏈接:" -ForegroundColor Cyan
Write-Host "   首頁:     http://localhost:5173/" -ForegroundColor White
Write-Host "   影片庫:   http://localhost:5173/videos" -ForegroundColor White
Write-Host "   圖片庫:   http://localhost:5173/gallery" -ForegroundColor White
Write-Host "   訂閱管理: http://localhost:5173/subscriptions" -ForegroundColor White

Write-Host ""

# 詢問是否打開瀏覽器
$openBrowser = Read-Host "是否在瀏覽器中打開應用? (y/n)"
if ($openBrowser -eq "y" -or $openBrowser -eq "Y" -or $openBrowser -eq "") {
    Write-Host "🚀 正在打開瀏覽器..." -ForegroundColor Green
    Start-Process "http://localhost:5173/"
    
    Start-Sleep -Seconds 2
    
    # 詢問是否打開其他頁面
    $openMore = Read-Host "是否打開所有頁面進行測試? (y/n)"
    if ($openMore -eq "y" -or $openMore -eq "Y") {
        Write-Host "📱 正在打開所有頁面..." -ForegroundColor Green
        Start-Process "http://localhost:5173/videos"
        Start-Sleep -Seconds 1
        Start-Process "http://localhost:5173/gallery"
        Start-Sleep -Seconds 1
        Start-Process "http://localhost:5173/subscriptions"
    }
}

Write-Host ""
Write-Host "🎉 測試完成！" -ForegroundColor Green
Write-Host ""

# 顯示測試提示
Write-Host "💡 手動測試建議:" -ForegroundColor Cyan
Write-Host "   1. 測試影片播放功能" -ForegroundColor White
Write-Host "   2. 測試圖片搜尋和篩選" -ForegroundColor White
Write-Host "   3. 測試響應式佈局 (調整瀏覽器大小)" -ForegroundColor White
Write-Host "   4. 測試 150% 縮放顯示 (Ctrl + +)" -ForegroundColor White
Write-Host "   5. 測試圖片預覽器鍵盤導航 (←/→/Esc)" -ForegroundColor White

Write-Host ""
Write-Host "按任意鍵退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")