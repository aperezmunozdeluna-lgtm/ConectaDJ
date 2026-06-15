@echo off
setlocal

set "FRONTEND_URL=http://localhost:5173"
set "FOTOS_DEMO=C:\Grado-Ucjc\TFG\docs\FOTOS_DEMO"

if not exist "%FOTOS_DEMO%" (
    echo No se ha encontrado la carpeta de fotos:
    echo %FOTOS_DEMO%
    echo.
    echo Revisa que el proyecto este en C:\Grado-Ucjc\TFG.
    pause
    exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-Clipboard -Value '%FOTOS_DEMO%'"

start "" explorer.exe "%FOTOS_DEMO%"
start "" "%FRONTEND_URL%"

echo Carpeta de fotos abierta:
echo %FOTOS_DEMO%
echo.
echo Ruta copiada al portapapeles.
echo Aplicacion abierta en:
echo %FRONTEND_URL%
echo.
echo Importante:
echo El navegador no permite forzar siempre la carpeta inicial del selector de archivos.
echo Para la demo, deja esta carpeta abierta y selecciona una foto desde aqui.
echo Despues de seleccionar una imagen, Windows/Chrome/Edge normalmente recuerdan la ultima carpeta usada.
echo.
pause
