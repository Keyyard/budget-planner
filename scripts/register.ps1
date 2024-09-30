$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    "username" = "testuser"
    "password" = "testpass"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://127.0.0.1:5000/register -Method POST -Headers $headers -Body $body

# powershell -ExecutionPolicy ByPass -File "d:\Github\budget-planner\scripts\register.ps1"