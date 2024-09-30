$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyNzExNDQxMiwianRpIjoiOGIzMmM1NGQtY2I5YS00NGJiLTllNDUtYzMwNjZjMzQ5YTRhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InRlc3R1c2VyIiwibmJmIjoxNzI3MTE0NDEyLCJjc3JmIjoiZmRjYWM1M2UtNWFkYy00MzIwLTg1NDgtODRkMmE0YjE1ZmY4IiwiZXhwIjoxNzI3MTE1MzEyfQ.fyUwUQxddrsZTjRh-1jGvU-HcwyS-bj2lnKOhQhz9d4"
}

$response = Invoke-WebRequest -Uri http://127.0.0.1:5000/protected -Method GET -Headers $headers

# Output the response
$response.Content

# powershell -ExecutionPolicy ByPass -File "d:\Github\budget-planner\scripts\test_protected.ps1"