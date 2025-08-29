@echo off
REM ========================================
REM Brahmastra-DDos Demo Examples - Windows
REM ========================================
REM 
REM This file contains various demo examples for testing
REM and learning the Brahmastra-DDos tool safely.
REM
REM All examples use --demo flag for safe simulation.
REM

echo.
echo ========================================
echo Brahmastra-DDos Demo Examples - Windows
echo ========================================
echo.
echo This file contains demo examples for safe testing.
echo All examples use --demo flag for simulation only.
echo.
echo Press any key to continue...
pause >nul

:MAIN_MENU
cls
echo.
echo ========================================
echo Brahmastra-DDos Demo Examples - Windows
echo ========================================
echo.
echo Select a demo category:
echo.
echo 1. Basic Demo Examples
echo 2. Advanced Demo Examples
echo 3. Tor Circuit Demo Examples
echo 4. Performance Testing Examples
echo 5. Educational Examples
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto BASIC_DEMOS
if "%choice%"=="2" goto ADVANCED_DEMOS
if "%choice%"=="3" goto TOR_DEMOS
if "%choice%"=="4" goto PERFORMANCE_DEMOS
if "%choice%"=="5" goto EDUCATIONAL_DEMOS
if "%choice%"=="6" goto EXIT
goto MAIN_MENU

:BASIC_DEMOS
cls
echo.
echo ========================================
echo Basic Demo Examples
echo ========================================
echo.
echo These are simple demos to get started:
echo.
echo 1. Quick 5-second demo
echo 2. 1-minute demo with medium rate
echo 3. 5-minute demo with multiple threads
echo 4. Back to main menu
echo.
set /p basic_choice="Enter your choice (1-4): "

if "%basic_choice%"=="1" (
    echo.
    echo Running: Quick 5-second demo
    echo Command: node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo
    echo.
    node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo
    echo.
    pause
    goto BASIC_DEMOS
)
if "%basic_choice%"=="2" (
    echo.
    echo Running: 1-minute demo with medium rate
    echo Command: node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo
    echo.
    node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo
    echo.
    pause
    goto BASIC_DEMOS
)
if "%basic_choice%"=="3" (
    echo.
    echo Running: 5-minute demo with multiple threads
    echo Command: node Brahmastra-DDos.js https://example.com 300 32 8 proxy.txt --demo
    echo.
    node Brahmastra-DDos.js https://example.com 300 32 8 proxy.txt --demo
    echo.
    pause
    goto BASIC_DEMOS
)
if "%basic_choice%"=="4" goto MAIN_MENU
goto BASIC_DEMOS

:ADVANCED_DEMOS
cls
echo.
echo ========================================
echo Advanced Demo Examples
echo ========================================
echo.
echo These are more complex demos:
echo.
echo 1. High-rate demo (128 req/sec)
echo 2. Multi-threaded demo (16 threads)
echo 3. Extended duration demo (10 minutes)
echo 4. Different target demo (Google)
echo 5. Back to main menu
echo.
set /p adv_choice="Enter your choice (1-5): "

if "%adv_choice%"=="1" (
    echo.
    echo Running: High-rate demo (128 req/sec)
    echo Command: node Brahmastra-DDos.js https://example.com 60 128 8 proxy.txt --demo
    echo.
    node Brahmastra-DDos.js https://example.com 60 128 8 proxy.txt --demo
    echo.
    pause
    goto ADVANCED_DEMOS
)
if "%adv_choice%"=="2" (
    echo.
    echo Running: Multi-threaded demo (16 threads)
    echo Command: node Brahmastra-DDos.js https://example.com 60 32 16 proxy.txt --demo
    echo.
    node Brahmastra-DDos.js https://example.com 60 32 16 proxy.txt --demo
    echo.
    pause
    goto ADVANCED_DEMOS
)
if "%adv_choice%"=="3" (
    echo.
    echo Running: Extended duration demo (10 minutes)
    echo Command: node Brahmastra-DDos.js https://example.com 600 32 4 proxy.txt --demo
    echo.
    node Brahmastra-DDos.js https://example.com 600 32 4 proxy.txt --demo
    echo.
    pause
    goto ADVANCED_DEMOS
)
if "%adv_choice%"=="4" (
    echo.
    echo Running: Different target demo (Google)
    echo Command: node Brahmastra-DDos.js https://google.com 30 32 4 proxy.txt --demo
    echo.
    node Brahmastra-DDos.js https://google.com 30 32 4 proxy.txt --demo
    echo.
    pause
    goto ADVANCED_DEMOS
)
if "%adv_choice%"=="5" goto MAIN_MENU
goto ADVANCED_DEMOS

:TOR_DEMOS
cls
echo.
echo ========================================
echo Tor Circuit Demo Examples
echo ========================================
echo.
echo These demos simulate Tor circuit rotation:
echo.
echo 1. Basic Tor demo simulation
echo 2. Tor demo with custom rotation (45s)
echo 3. Tor demo with fast rotation (15s)
echo 4. Tor demo with slow rotation (120s)
echo 5. Back to main menu
echo.
set /p tor_choice="Enter your choice (1-5): "

if "%tor_choice%"=="1" (
    echo.
    echo Running: Basic Tor demo simulation
    echo Command: node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt --demo --tor
    echo.
    node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt --demo --tor
    echo.
    pause
    goto TOR_DEMOS
)
if "%tor_choice%"=="2" (
    echo.
    echo Running: Tor demo with custom rotation (45s)
    echo Command: node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo --tor --tor-rotate=45
    echo.
    node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo --tor --tor-rotate=45
    echo.
    pause
    goto TOR_DEMOS
)
if "%tor_choice%"=="3" (
    echo.
    echo Running: Tor demo with fast rotation (15s)
    echo Command: node Brahmastra-DDos.js https://example.com 45 32 4 proxy.txt --demo --tor --tor-rotate=15
    echo.
    node Brahmastra-DDos.js https://example.com 45 32 4 proxy.txt --demo --tor --tor-rotate=15
    echo.
    pause
    goto TOR_DEMOS
)
if "%tor_choice%"=="4" (
    echo.
    echo Running: Tor demo with slow rotation (120s)
    echo Command: node Brahmastra-DDos.js https://example.com 300 32 4 proxy.txt --demo --tor --tor-rotate=120
    echo.
    node Brahmastra-DDos.js https://example.com 300 32 4 proxy.txt --demo --tor --tor-rotate=120
    echo.
    pause
    goto TOR_DEMOS
)
if "%tor_choice%"=="5" goto MAIN_MENU
goto TOR_DEMOS

:PERFORMANCE_DEMOS
cls
echo.
echo ========================================
echo Performance Testing Examples
echo ========================================
echo.
echo These demos test different performance levels:
echo.
echo 1. Low intensity test (8 req/sec)
echo 2. Medium intensity test (32 req/sec)
echo 3. High intensity test (64 req/sec)
echo 4. Very high intensity test (128 req/sec)
echo 5. Back to main menu
echo.
set /p perf_choice="Enter your choice (1-5): "

if "%perf_choice%"=="1" (
    echo.
    echo Running: Low intensity test (8 req/sec)
    echo Command: node Brahmastra-DDos.js https://example.com 60 8 4 proxy.txt --demo
    echo.
    node Brahmastra-DDos.js https://example.com 60 8 4 proxy.txt --demo
    echo.
    pause
    goto PERFORMANCE_DEMOS
)
if "%perf_choice%"=="2" (
    echo.
    echo Running: Medium intensity test (32 req/sec)
    echo Command: node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo
    echo.
    node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo
    echo.
    pause
    goto PERFORMANCE_DEMOS
)
if "%perf_choice%"=="3" (
    echo.
    echo Running: High intensity test (64 req/sec)
    echo Command: node Brahmastra-DDos.js https://example.com 60 64 4 proxy.txt --demo
    echo.
    node Brahmastra-DDos.js https://example.com 60 64 4 proxy.txt --demo
    echo.
    pause
    goto PERFORMANCE_DEMOS
)
if "%perf_choice%"=="4" (
    echo.
    echo Running: Very high intensity test (128 req/sec)
    echo Command: node Brahmastra-DDos.js https://example.com 60 128 4 proxy.txt --demo
    echo.
    node Brahmastra-DDos.js https://example.com 60 128 4 proxy.txt --demo
    echo.
    pause
    goto PERFORMANCE_DEMOS
)
if "%perf_choice%"=="5" goto MAIN_MENU
goto PERFORMANCE_DEMOS

:EDUCATIONAL_DEMOS
cls
echo.
echo ========================================
echo Educational Examples
echo ========================================
echo.
echo These demos help you learn different configurations:
echo.
echo 1. Configuration testing (different rates)
echo 2. Thread testing (different thread counts)
echo 3. Duration testing (different time periods)
echo 4. Target testing (different websites)
echo 5. Back to main menu
echo.
set /p edu_choice="Enter your choice (1-5): "

if "%edu_choice%"=="1" (
    echo.
    echo Running: Configuration testing (different rates)
    echo Testing rates: 8, 16, 32, 64, 128 req/sec
    echo.
    echo Testing rate: 8 req/sec
    node Brahmastra-DDos.js https://example.com 10 8 4 proxy.txt --demo
    echo.
    echo Testing rate: 16 req/sec
    node Brahmastra-DDos.js https://example.com 10 16 4 proxy.txt --demo
    echo.
    echo Testing rate: 32 req/sec
    node Brahmastra-DDos.js https://example.com 10 32 4 proxy.txt --demo
    echo.
    echo Testing rate: 64 req/sec
    node Brahmastra-DDos.js https://example.com 10 64 4 proxy.txt --demo
    echo.
    echo Testing rate: 128 req/sec
    node Brahmastra-DDos.js https://example.com 10 128 4 proxy.txt --demo
    echo.
    pause
    goto EDUCATIONAL_DEMOS
)
if "%edu_choice%"=="2" (
    echo.
    echo Running: Thread testing (different thread counts)
    echo Testing threads: 1, 2, 4, 8, 16
    echo.
    echo Testing threads: 1
    node Brahmastra-DDos.js https://example.com 10 32 1 proxy.txt --demo
    echo.
    echo Testing threads: 2
    node Brahmastra-DDos.js https://example.com 10 32 2 proxy.txt --demo
    echo.
    echo Testing threads: 4
    node Brahmastra-DDos.js https://example.com 10 32 4 proxy.txt --demo
    echo.
    echo Testing threads: 8
    node Brahmastra-DDos.js https://example.com 10 32 8 proxy.txt --demo
    echo.
    echo Testing threads: 16
    node Brahmastra-DDos.js https://example.com 10 32 16 proxy.txt --demo
    echo.
    pause
    goto EDUCATIONAL_DEMOS
)
if "%edu_choice%"=="3" (
    echo.
    echo Running: Duration testing (different time periods)
    echo Testing durations: 5s, 15s, 30s, 60s, 120s
    echo.
    echo Testing duration: 5 seconds
    node Brahmastra-DDos.js https://example.com 5 32 4 proxy.txt --demo
    echo.
    echo Testing duration: 15 seconds
    node Brahmastra-DDos.js https://example.com 15 32 4 proxy.txt --demo
    echo.
    echo Testing duration: 30 seconds
    node Brahmastra-DDos.js https://example.com 30 32 4 proxy.txt --demo
    echo.
    echo Testing duration: 60 seconds
    node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo
    echo.
    echo Testing duration: 120 seconds
    node Brahmastra-DDos.js https://example.com 120 32 4 proxy.txt --demo
    echo.
    pause
    goto EDUCATIONAL_DEMOS
)
if "%edu_choice%"=="4" (
    echo.
    echo Running: Target testing (different websites)
    echo Testing targets: example.com, google.com, httpbin.org
    echo.
    echo Testing target: example.com
    node Brahmastra-DDos.js https://example.com 10 32 4 proxy.txt --demo
    echo.
    echo Testing target: google.com
    node Brahmastra-DDos.js https://google.com 10 32 4 proxy.txt --demo
    echo.
    echo Testing target: httpbin.org
    node Brahmastra-DDos.js https://httpbin.org 10 32 4 proxy.txt --demo
    echo.
    pause
    goto EDUCATIONAL_DEMOS
)
if "%edu_choice%"=="5" goto MAIN_MENU
goto EDUCATIONAL_DEMOS

:EXIT
cls
echo.
echo ========================================
echo Thank you for using Brahmastra-DDos!
echo ========================================
echo.
echo Remember:
echo - Always use --demo flag for safe testing
echo - Test on your own systems only
echo - Use responsibly and legally
echo.
echo Press any key to exit...
pause >nul
exit

REM ========================================
REM Quick Reference Commands
REM ========================================
REM
REM Basic Demo:
REM node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo
REM
REM Tor Demo:
REM node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt --demo --tor
REM
REM High Rate Demo:
REM node Brahmastra-DDos.js https://example.com 60 128 8 proxy.txt --demo
REM
REM Multi-threaded Demo:
REM node Brahmastra-DDos.js https://example.com 60 32 16 proxy.txt --demo
REM
REM Extended Demo:
REM node Brahmastra-DDos.js https://example.com 300 32 4 proxy.txt --demo
REM
REM ========================================
