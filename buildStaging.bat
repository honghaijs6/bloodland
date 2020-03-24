@echo off
start cmd /k "rd /s /q html & cd client && npm run buildStaging && move /y build ..\html"


