@echo off
start cmd /k "cd api && npm start"
start cmd /k "cd api_game && npm start"
start cmd /k "cd client && npm start"
::start cmd /k "cd api_cron && npm start"