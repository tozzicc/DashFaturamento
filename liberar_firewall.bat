@echo off
REM Adiciona exceções de firewall para o dashboard remoto
echo Adicionando portas ao Firewall do Windows...

netsh advfirewall firewall add rule name="Allow Dashboard Backend 3000" dir=in action=allow protocol=tcp localport=3000 enable=yes

netsh advfirewall firewall add rule name="Allow Dashboard Frontend 5173" dir=in action=allow protocol=tcp localport=5173 enable=yes

netsh advfirewall firewall add rule name="Allow Dashboard Frontend 5174" dir=in action=allow protocol=tcp localport=5174 enable=yes

echo.
echo Portas liberadas:
echo - 3000 (Backend API)
echo - 5173-5174 (Frontend)
echo.
echo Pressione qualquer tecla para sair...
pause
