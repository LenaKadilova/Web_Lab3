(function () {
    'use strict';
    const serv_url = '/fcgi-bin/server.jar';
    Decimal.set({precision: 100});

    const canvas = document.getElementById('plane');
    const ctx = canvas.getContext('2d');

    const form = document.getElementById('point-form');
    const xInputs = document.querySelectorAll('#x-input button');
    const yInput = document.getElementById('y-input');
    const rInputs = document.querySelectorAll('#r-input button');
    const xError = document.getElementById('x-error');
    const yError = document.getElementById('y-error');
    const rError = document.getElementById('r-error');
    const servError = document.getElementById('server-error');
    const resultsBody = document.getElementById('results-body');

    const ALLOWED_X = ['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3']
    const ALLOWED_R = ['1', '1.5', '2', '2.5', '3'];

    let results = [];

    function drawScene(R, points) {
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const range = 5;
        const scale = (w / 2 - 20) / range;

        function toPx(x, y) {
            return [cx + x * scale, cy - y * scale];
        }

        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(52, 122, 194, 0.65)';
        ctx.strokeStyle = 'rgba(30, 80, 140, 0.9)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        let p = toPx(-R / 2, 0);
        ctx.moveTo(p[0], p[1]);
        p = toPx(0, 0);
        ctx.lineTo(p[0], p[1]);
        p = toPx(0, R);
        ctx.lineTo(p[0], p[1]);
        p = toPx(-R / 2, R);
        ctx.lineTo(p[0], p[1]);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        p = toPx(0, 0);
        ctx.moveTo(p[0], p[1]);
        for (let deg = 0; deg >= -90; deg -= 2) {
            const rad = (deg * Math.PI) / 180;
            const px = (R / 2) * Math.cos(rad);
            const py = (R / 2) * Math.sin(rad);
            p = toPx(px, py);
            ctx.lineTo(p[0], p[1]);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        p = toPx(0, 0);
        ctx.moveTo(p[0], p[1]);
        p = toPx(-R, 0);
        ctx.lineTo(p[0], p[1]);
        p = toPx(0, -R / 2);
        ctx.lineTo(p[0], p[1]);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#333333';
        ctx.fillStyle = '#333333';
        ctx.lineWidth = 1;
        ctx.font = '11px Arial';

        ctx.beginPath();
        ctx.moveTo(10, cy);
        ctx.lineTo(w - 10, cy);
        ctx.moveTo(cx, h - 10);
        ctx.lineTo(cx, 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(w - 10, cy);
        ctx.lineTo(w - 18, cy - 4);
        ctx.lineTo(w - 18, cy + 4);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx, 10);
        ctx.lineTo(cx - 4, 18);
        ctx.lineTo(cx + 4, 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillText('x', w - 16, cy - 8);
        ctx.fillText('y', cx + 8, 16);

        function fmt(v) {
            return Number.isInteger(v) ? String(v) : v.toFixed(2);
        }

        const marks = [
            {v: R, label: fmt(R)},
            {v: R / 2, label: fmt(R / 2)},
            {v: -R / 2, label: fmt(-R / 2)},
            {v: -R, label: fmt(-R)}
        ];
        marks.forEach(function (m) {
            let pt = toPx(m.v, 0);
            ctx.beginPath();
            ctx.moveTo(pt[0], cy - 3);
            ctx.lineTo(pt[0], cy + 3);
            ctx.stroke();
            ctx.fillText(m.label, pt[0] - 10, cy + 15);

            pt = toPx(0, m.v);
            ctx.beginPath();
            ctx.moveTo(cx - 3, pt[1]);
            ctx.lineTo(cx + 3, pt[1]);
            ctx.stroke();
            ctx.fillText(m.label, cx + 6, pt[1] + 4);
        });

        points.forEach(function (pt) {
            if (Number(pt.r) !== Number(R)) return;
            const px = toPx(parseFloat(pt.x), parseFloat(pt.y));
            ctx.beginPath();
            ctx.arc(px[0], px[1], 4, 0, Math.PI * 2);
            ctx.fillStyle = pt.hit ? '#1e7e34' : '#c0392b';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });
    }

    async function loadResults() {
        try {
            const response = await fetch(serv_url, {method: 'GET'});
            const data = await response.json();
            return data.history || [];
        } catch (e) {
            servError.textContent = 'Результатов с сервера не будет ;('
            return [];
        }
    }

    function renderResults(results) {
        resultsBody.innerHTML = '';
        results.forEach(function (r) {
            const tr = document.createElement('tr');
            const tdX = document.createElement('td'); tdX.textContent = r.x;
            const tdY = document.createElement('td'); tdY.textContent = r.y;
            const tdR = document.createElement('td'); tdR.textContent = r.r;
            const tdHit = document.createElement('td');
            tdHit.textContent = r.hit ? 'Попадание' : 'Мимо';
            tdHit.className = r.hit ? 'hit-yes' : 'hit-no';
            const tdDate = document.createElement('td');
            tdDate.textContent = r.currentTime;
            const tdExec = document.createElement('td');
            tdExec.textContent = (r.execTimeNanos / 1000).toFixed(1);

            tr.appendChild(tdX);
            tr.appendChild(tdY);
            tr.appendChild(tdR);
            tr.appendChild(tdHit);
            tr.appendChild(tdDate);
            tr.appendChild(tdExec);
            resultsBody.appendChild(tr);
        });
    }

    function getSelected(buttons) {
        for (const el of buttons) {
            if (el.classList.contains('selected')) return el.value;
        }
        return null;
    }

    function getSelectedR(){
        return getSelected(rInputs);
    }

    function validate() {
        let valid = true;

        xError.textContent = '';
        const xVal = getSelected(xInputs);
        if (xVal === null || !ALLOWED_X.includes(xVal)) {
            xError.textContent = 'Выберите x';
            valid = false
        }

        yInput.classList.remove('invalid');
        yError.textContent = '';
        const yRaw = yInput.value.trim().replace(',', '.');
        let yOk = yRaw !== '';
        if (yOk) {
            try {
                const yDec = new Decimal(yRaw);
                yOk = yDec.gt(-5) && yDec.lt(3);
            } catch (e) {
                yOk = false;
            }
        }
        if (!yOk) {
            yInput.classList.add('invalid');
            yError.textContent = 'Y должен быть числом от -5 до 3';
            valid = false;
        }

        rError.textContent = '';
        const rVal = getSelectedR();
        if (rVal === null || !ALLOWED_R.includes(rVal)) {
            rError.textContent = 'Недопустимое значение R';
            valid = false;
        }

        return valid;
    }

    yInput.addEventListener('input', function () {
        let v = yInput.value;
        v = v.replace(/[^0-9,.\-]/g, '');
        v = v.replace(/(?!^)-/g, '');
        const parts = v.split(/[.,]/);
        if (parts.length > 2) {
            v = parts[0] + '.' + parts.slice(1).join('');
        }
        yInput.value = v;
    });

    form.addEventListener('submit',  async function (e) {
        e.preventDefault();
        servError.textContent = '';
        if (!validate()) return;

        const body = new URLSearchParams({
            x: getSelected(xInputs),
            y: yInput.value.trim().replace(',', '.'),
            r: getSelectedR()
        });

        try {
            const response = await fetch(serv_url, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: body
            });
            const data = await response.json();
            if (!response.ok) {
                servError.textContent = data.error || ('Oh no! Ошибка сервера: ' + response.status);
                return;
            }
            results = data.history;
        } catch (err) {
            servError.textContent = 'Не удалось связаться с сервером';
            return;
        }

        renderResults(results);
        drawScene(Number(getSelectedR()), results);
    });

    xInputs.forEach(function (el) {
        el.addEventListener('click', function () {
            xInputs.forEach(function (b) { b.classList.remove('selected'); });
            el.classList.add('selected');
            xError.textContent = '';
        });
    });

    rInputs.forEach(function (el) {
        el.addEventListener('click', function () {
            rInputs.forEach(function (b) { b.classList.remove('selected'); });
            el.classList.add('selected');
            const rVal = getSelectedR();
            if (!ALLOWED_R.includes(rVal)) {
                rError.textContent = 'Недопустимое значение R';
                return;
            }
            rError.textContent = '';
            drawScene(Number(rVal), results);
        });
    });

    drawScene(Number(getSelectedR()) || 1, results);
    loadResults().then(function (loaded) {
        results = loaded;
        renderResults(results);
        drawScene(Number(getSelectedR()) || 1, results);
    });
})();
