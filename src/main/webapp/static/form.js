(function () {
    'use strict';

    const form = document.getElementById('point-form');
    const xButtons = document.querySelectorAll('#x-buttons button');
    const rButtons = document.querySelectorAll('#r-buttons button');
    const xInput = document.getElementById('x-input');
    const rInput = document.getElementById('r-input');
    const yInput = document.getElementById('y-input');
    const xError = document.getElementById('x-error');
    const yError = document.getElementById('y-error');
    const rError = document.getElementById('r-error');
    const canvasError = document.getElementById('canvas-error');
    const canvas = document.getElementById('plane');

    const ALLOWED_X = ['-2', '-1.5', '-1', '-0.5', '0', '0.5', '1', '1.5', '2'];
    const ALLOWED_R = ['1', '2', '3', '4', '5'];
    const NUMBER = /^-?\d{1,10}(\.\d{1,20})?$/;

    const graph = Graph.create(canvas);
    const points = Graph.readPoints('#results-body tr[data-x]');

    function selectedR() {
        return ALLOWED_R.includes(rInput.value) ? rInput.value : null;
    }

    function redraw() {
        const r = selectedR();
        graph.draw(r ? Number(r) : null, points);
    }

    function bindButtons(buttons, hiddenInput, onChange) {
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                buttons.forEach(function (b) { b.classList.remove('selected'); });
                btn.classList.add('selected');
                hiddenInput.value = btn.value;
                if (onChange) onChange();
            });
        });
    }

    function isYValid(raw) {
        if (!NUMBER.test(raw)) return false;
        const negative = raw.charAt(0) === '-';
        const intPart = Number(raw.replace('-', '').split('.')[0]);
        return negative ? intPart < 3 : intPart < 5;
    }

    function validateForm() {
        let valid = true;

        xError.textContent = '';
        if (!ALLOWED_X.includes(xInput.value)) {
            xError.textContent = 'Выберите значение X';
            valid = false;
        }

        const yRaw = yInput.value.trim().replace(',', '.');
        yInput.classList.remove('invalid');
        yError.textContent = '';
        if (yRaw === '') {
            yError.textContent = 'Введите Y';
            yInput.classList.add('invalid');
            valid = false;
        } else if (!isYValid(yRaw)) {
            yError.textContent = 'Y должен быть числом в интервале (-3; 5)';
            yInput.classList.add('invalid');
            valid = false;
        }

        rError.textContent = '';
        if (selectedR() === null) {
            rError.textContent = 'Выберите значение R';
            valid = false;
        }

        return valid;
    }

    yInput.addEventListener('input', function () {
        let v = yInput.value.replace(/[^0-9,.\-]/g, '');
        v = v.replace(/(?!^)-/g, '');
        const parts = v.split(/[.,]/);
        if (parts.length > 2) {
            v = parts[0] + '.' + parts.slice(1).join('');
        }
        yInput.value = v;
    });

    form.addEventListener('submit', function (e) {
        if (!validateForm()) {
            e.preventDefault();
            return;
        }
        yInput.value = yInput.value.trim().replace(',', '.');
    });

    bindButtons(xButtons, xInput, function () { xError.textContent = ''; });
    bindButtons(rButtons, rInput, function () {
        rError.textContent = '';
        canvasError.textContent = '';
        redraw();
    });

    canvas.addEventListener('click', function (e) {
        canvasError.textContent = '';
        const r = selectedR();
        if (r === null) {
            canvasError.textContent = 'Невозможно определить координаты точки: выберите радиус R';
            return;
        }

        const c = graph.toCoords(e);
        const x = Math.round(c.x * 1000) / 1000;
        const y = Math.round(c.y * 1000) / 1000;

        if (x < -2 || x > 2) {
            canvasError.textContent = 'X = ' + x + ' не в [-2; 2]';
            return;
        }
        if (y <= -3 || y >= 5) {
            canvasError.textContent = 'Y = ' + y + ' не в (-3; 5)';
            return;
        }

        const params = new URLSearchParams({
            x: String(x),
            y: String(y),
            r: r,
            source: 'canvas'
        });
        window.location.href = form.action + '?' + params.toString();
    });

    redraw();
})();
