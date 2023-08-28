@echo off

rem Ir al directorio donde se encuentra el script
cd /d "%~dp0"

rem Ejecutar el script de Node.js
node script.js

echo Proceso completado. Presiona cualquier tecla para salir.
pause >nul
