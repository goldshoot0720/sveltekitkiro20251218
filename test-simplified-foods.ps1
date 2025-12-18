# Test Simplified Foods API
Write-Host "Testing Simplified Foods API..." -ForegroundColor Green

# Test POST request with simplified data
Write-Host "`nTesting add simplified food..." -ForegroundColor Yellow
$testFood = @{
    name = "Simple Apple"
    amount = 3
    price = 50
    shop = "Local Store"
    todate = "2024-12-25"
    photourl = "https://example.com/apple.jpg"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5173/api/foods" -Method POST -Body $testFood -ContentType "application/json"
    Write-Host "Success: Added simplified food" -ForegroundColor Green
    Write-Host "Food ID: $($response._id)" -ForegroundColor Cyan
    Write-Host "Food Name: $($response.name)" -ForegroundColor Cyan
} catch {
    Write-Host "Failed to add food: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest completed!" -ForegroundColor Green