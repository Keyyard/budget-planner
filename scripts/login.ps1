$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    "username" = "testuser"
    "password" = "testpass"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://127.0.0.1:5000/login -Method POST -Headers $headers -Body $body

# Output the response
$response.Content

# powershell -ExecutionPolicy ByPass -File "d:\Github\budget-planner\scripts\login.ps1"