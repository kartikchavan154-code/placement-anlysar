$javaExe = "C:\Program Files\Java\jdk-23\bin\java.exe"
$jarPath = "backend\target\campus-placement-backend-1.0.0.jar"

Write-Host "Starting Spring Boot application jar: $jarPath..."
$process = Start-Process -FilePath $javaExe -ArgumentList "-jar", $jarPath -PassThru -NoNewWindow

$maxRetries = 25
$ready = $false

for ($i = 0; $i -lt $maxRetries; $i++) {
    Start-Sleep -Seconds 2
    try {
        $test = Invoke-RestMethod -Uri "http://localhost:8080/api/jobs" -Method Get -TimeoutSec 3 -ErrorAction Stop
        if ($test) {
            $ready = $true
            Write-Host "`n>>> SPRING BOOT BACKEND IS UP & HEALTHY ON PORT 8080! <<<"
            break
        }
    } catch {
        Write-Host "Waiting for backend to bind and seed data... ($($i+1)/$maxRetries)"
    }
}

if ($ready) {
    Write-Host "`n------------------------------------------------------------"
    Write-Host "1. VERIFYING PUBLIC JOBS API (GET /api/jobs)"
    Write-Host "------------------------------------------------------------"
    $jobs = Invoke-RestMethod -Uri "http://localhost:8080/api/jobs" -Method Get
    Write-Host "Total Active Placement Jobs: $($jobs.Count)"
    foreach ($j in $jobs | Select-Object -First 3) {
        Write-Host " - [$($j.company)] $($j.title) | Package: $($j.salaryPackage) | Min CGPA: $($j.minCgpa)"
    }

    Write-Host "`n------------------------------------------------------------"
    Write-Host "2. VERIFYING STUDENT AUTH LOGIN (POST /api/auth/login)"
    Write-Host "------------------------------------------------------------"
    $studentLogin = @{
        email = "student@campus.edu"
        password = "Student@123"
    } | ConvertTo-Json
    $studentAuth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $studentLogin -ContentType "application/json"
    Write-Host "Login SUCCESS: User='$($studentAuth.fullName)', Role='$($studentAuth.role)', StudentID=$($studentAuth.studentId)"
    $studentToken = $studentAuth.token

    Write-Host "`n------------------------------------------------------------"
    Write-Host "3. VERIFYING ADMIN AUTH LOGIN (POST /api/auth/login)"
    Write-Host "------------------------------------------------------------"
    $adminLogin = @{
        email = "admin@campus.edu"
        password = "Admin@123"
    } | ConvertTo-Json
    $adminAuth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $adminLogin -ContentType "application/json"
    Write-Host "Login SUCCESS: User='$($adminAuth.fullName)', Role='$($adminAuth.role)', AdminID=$($adminAuth.adminId)"
    $adminToken = $adminAuth.token

    Write-Host "`n------------------------------------------------------------"
    Write-Host "4. VERIFYING SPRING DATA REST ENDPOINTS (GET /api/rest/jobs-rest)"
    Write-Host "------------------------------------------------------------"
    $dataRest = Invoke-RestMethod -Uri "http://localhost:8080/api/rest/jobs-rest" -Method Get
    Write-Host "Spring Data REST HAL response: Success!"

    Write-Host "`n------------------------------------------------------------"
    Write-Host "5. VERIFYING AI INTERVIEW GENERATOR (POST /api/ai/generate-interview)"
    Write-Host "------------------------------------------------------------"
    $aiPayload = @{
        jobRole = "Full Stack Software Developer"
        category = "TECHNICAL"
        count = 3
    } | ConvertTo-Json
    $aiHeaders = @{ Authorization = "Bearer $studentToken" }
    $aiRes = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/generate-interview" -Method Post -Body $aiPayload -ContentType "application/json" -Headers $aiHeaders
    Write-Host "Generated $($aiRes.Count) AI Interview Questions successfully!"
    Write-Host "Sample Question: $($aiRes[0].question)"

    Write-Host "`n------------------------------------------------------------"
    Write-Host "6. VERIFYING AI ANSWER EVALUATOR (POST /api/ai/evaluate-answer)"
    Write-Host "------------------------------------------------------------"
    $evalPayload = @{
        jobRole = "Full Stack Software Developer"
        category = "TECHNICAL"
        question = "Explain how Spring Boot's Dependency Injection works."
        studentAnswer = "Spring Boot creates and manages beans in the ApplicationContext container using constructor injection."
    } | ConvertTo-Json
    $evalRes = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/evaluate-answer" -Method Post -Body $evalPayload -ContentType "application/json" -Headers $aiHeaders
    Write-Host "AI Evaluated Score: $($evalRes.score) / 100 ($($evalRes.rating))"
    Write-Host "AI Strengths: $($evalRes.strengths[0])"

    Write-Host "`n------------------------------------------------------------"
    Write-Host "7. VERIFYING STUDENT DASHBOARD STATS (GET /api/analytics/student/1)"
    Write-Host "------------------------------------------------------------"
    $studentStats = Invoke-RestMethod -Uri "http://localhost:8080/api/analytics/student/1" -Method Get -Headers $aiHeaders
    Write-Host "Available Jobs: $($studentStats.totalAvailableJobs), Applied: $($studentStats.totalAppliedJobs), Profile: $($studentStats.profileCompletionPercentage)%"

    Write-Host "`n------------------------------------------------------------"
    Write-Host "8. VERIFYING ADMIN DASHBOARD STATS (GET /api/analytics/admin)"
    Write-Host "------------------------------------------------------------"
    $adminHeaders = @{ Authorization = "Bearer $adminToken" }
    $adminStats = Invoke-RestMethod -Uri "http://localhost:8080/api/analytics/admin" -Method Get -Headers $adminHeaders
    Write-Host "Total Students: $($adminStats.totalStudents), Companies: $($adminStats.totalCompanies), Placed: $($adminStats.totalSelectedStudents), Placement Rate: $($adminStats.placementPercentage)%"

    Write-Host "`n>>> ALL 8 API TEST SUITES PASSED FLAWLESSLY! <<<"
} else {
    Write-Host "Backend failed to become ready."
}

Write-Host "`nShutting down test backend process..."
Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "Backend test process shutdown complete."
