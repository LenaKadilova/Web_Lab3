@echo off
cd /d "%~dp0"
call gradlew.bat war || exit /b 1
scp -P 2222 build\libs\lab3.war s502785@se.ifmo.ru:~/wildfly/standalone/deployments/ || exit /b 1
ssh -o ServerAliveInterval=30 -p 2222 -L 16666:localhost:16666 s502785@se.ifmo.ru "httpd -f ~/httpd-root/httpd-conf.conf -k stop 2>/dev/null; pkill -f '[s]erver.jar'; pgrep -f '[j]boss-modules' >/dev/null || (nohup ~/wildfly/bin/standalone.sh -b 0.0.0.0 > ~/wildfly.log 2>&1 < /dev/null &); sleep 15; echo Open http://localhost:16666/lab3/ ; sleep 86400"