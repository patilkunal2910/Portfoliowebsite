@echo off
echo Starting local web server for Kunal's Portfolio...
start http://localhost:8000
python -m http.server 8000
pause
