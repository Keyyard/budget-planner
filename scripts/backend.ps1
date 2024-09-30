# Define the base URL of your API
$baseUrl = "http://127.0.0.1:5000"

# Function to delete the user if they already exist
function Test-DeleteUser {
    $url = "$baseUrl/delete_user"
    $body = @{
        username = "testuser"
    } | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
        Write-Host -ForegroundColor Green "User deleted successfully"
    } catch {
        Write-Host -ForegroundColor Yellow "User does not exist or could not be deleted"
    }
}

# Function to test the register endpoint
function Test-Register {
    $url = "$baseUrl/register"
    $body = @{
        username = "testuser"
        password = "testpassword"
    } | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
        if ($response.message -eq "User registered successfully") {
            Write-Host -ForegroundColor Green "Register test passed"
        } else {
            Write-Host -ForegroundColor Red "Register test failed"
        }
    } catch {
        Write-Host -ForegroundColor Red "Register test failed: $_"
    }
}

# Function to test the login endpoint
function Test-Login {
    $url = "$baseUrl/login"
    $body = @{
        username = "testuser"
        password = "testpassword"
    } | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
        if ($response.access_token -and $response.refresh_token) {
            Write-Host -ForegroundColor Green "Login test passed"
            return $response
        } else {
            Write-Host -ForegroundColor Red "Login test failed"
        }
    } catch {
        Write-Host -ForegroundColor Red "Login test failed: $_"
    }
}

# Function to test the protected endpoint
function Test-Protected {
    param (
        [string]$accessToken
    )
    $url = "$baseUrl/protected"
    $headers = @{
        Authorization = "Bearer $accessToken"
    }
    try {
        $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
        if ($response.logged_in_as -eq "testuser") {
            Write-Host -ForegroundColor Green "Protected test passed"
        } else {
            Write-Host -ForegroundColor Red "Protected test failed"
        }
    } catch {
        Write-Host -ForegroundColor Red "Protected test failed: $_"
    }
}

# Function to test the refresh endpoint
function Test-Refresh {
    param (
        [string]$refreshToken
    )
    $url = "$baseUrl/refresh"
    $headers = @{
        Authorization = "Bearer $refreshToken"
    }
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers
        if ($response.access_token) {
            Write-Host -ForegroundColor Green "Refresh test passed"
            return $response.access_token
        } else {
            Write-Host -ForegroundColor Red "Refresh test failed"
        }
    } catch {
        Write-Host -ForegroundColor Red "Refresh test failed: $_"
    }
}

# Function to test the logout endpoint
function Test-Logout {
    param (
        [string]$accessToken
    )
    $url = "$baseUrl/logout"
    $headers = @{
        Authorization = "Bearer $accessToken"
    }
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers
        if ($response.message -eq "User logged out successfully") {
            Write-Host -ForegroundColor Green "Logout test passed"
        } else {
            Write-Host -ForegroundColor Red "Logout test failed"
        }
    } catch {
        Write-Host -ForegroundColor Red "Logout test failed: $_"
    }
}

# Run the tests and measure the time taken
$startTime = Get-Date
Write-Host "Starting tests at $startTime"

$deleteUserTime = Measure-Command { Test-DeleteUser }
Write-Host "Test-DeleteUser took $($deleteUserTime.TotalSeconds) seconds"

$registerTime = Measure-Command { Test-Register }
Write-Host "Test-Register took $($registerTime.TotalSeconds) seconds"

$loginTime = Measure-Command { $loginResponse = Test-Login }
Write-Host "Test-Login took $($loginTime.TotalSeconds) seconds"

if ($loginResponse) {
    $accessToken = $loginResponse.access_token
    $refreshToken = $loginResponse.refresh_token

    $protectedTime = Measure-Command { Test-Protected -accessToken $accessToken }
    Write-Host "Test-Protected took $($protectedTime.TotalSeconds) seconds"

    $refreshTime = Measure-Command { $newAccessToken = Test-Refresh -refreshToken $refreshToken }
    Write-Host "Test-Refresh took $($refreshTime.TotalSeconds) seconds"

    if ($newAccessToken) {
        $logoutTime = Measure-Command { Test-Logout -accessToken $newAccessToken }
        Write-Host "Test-Logout took $($logoutTime.TotalSeconds) seconds"
    }
}

$endTime = Get-Date
$totalTime = $endTime - $startTime
Write-Host -ForegroundColor Green "Tests Completed."
Write-Host -ForegroundColor Green "Total time taken: $($totalTime.TotalSeconds) seconds"

# powershell -ExecutionPolicy ByPass -File "d:\Github\budget-planner\scripts\backend.ps1"