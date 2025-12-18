# Test Foods API
Write-Host "Testing Foods API..." -ForegroundColor Green

# Test GET request
Write-Host "`n1. Testing get foods list..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5173/api/foods" -Method GET
    Write-Host "Success: Got foods list" -ForegroundColor Green
    Write-Host "Foods count: $($response.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "Failed to get foods: $($_.Exception.Message)" -ForegroundColor Red
}

# Test POST request
Write-Host "`n2. Testing add food..." -ForegroundColor Yellow
$testFood = @{
    name = "Test Apple"
    amount = 5
    price = 100
    shop = "Test Store"
    category = "fruits"
    unit = "piece"
    status = "fresh"
    note = "This is a test food"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5173/api/foods" -Method POST -Body $testFood -ContentType "application/json"
    Write-Host "Success: Added test food" -ForegroundColor Green
    Write-Host "Food ID: $($response._id)" -ForegroundColor Cyan
    $testFoodId = $response._id
} catch {
    Write-Host "Failed to add food: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest completed!" -ForegroundColor Green