@echo off
cd /d "%~dp0"
call gradlew.bat jar || exit /b 1
scp -P 2222 static\index.html static\script.js build\libs\server.jar s502785@se.ifmo.ru:~/httpd-root/ || exit /b 1
ssh -o ServerAliveInterval=30 -p 2222 -L 16666:localhost:16666 s502785@se.ifmo.ru "cd ~/httpd-root; mv -f index.html script.js static/; mv -f server.jar fcgi-bin/; httpd -f ~/httpd-root/httpd-conf.conf -k stop 2>/dev/null; pkill -f '[s]erver.jar'; sleep 1; nohup java -Xmx128m -DFCGI_PORT=16667 -jar fcgi-bin/server.jar > fcgi.log 2>&1 < /dev/null & sleep 1; httpd -f ~/httpd-root/httpd-conf.conf -k start 2>/dev/null; sockstat -4l | grep -E ':16666 |:16667 '; sleep 86400"