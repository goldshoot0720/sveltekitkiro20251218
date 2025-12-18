# Simple Local Test Script
Write-Host "Testing Local Development Server..." -ForegroundColor Green

# Test main pages
$urls = @(
    "http://localhost:5173/",
    "http://localhost:5173/videos", 
    "http://localhost:5173/gallery",
    "http://localhost:5173/subscriptions"
)

foreach ($url in $urls) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -TimeoutSec 3
        Write-Host "OK: $url - Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: $url - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test API
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173/api/images" -Method GET -UseBasicParsing -TimeoutSec 3
    $data = $response.Content | ConvertFrom-Json
    Write-Host "API OK: Found $($data.total) images" -ForegroundColor Green
} catch {
    Write-Host "API ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nOpening browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173/"