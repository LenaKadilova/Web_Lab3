(function () {
    'use strict';

    const form = document.getElementById('point-form');
    const xBoxes = document.querySelectorAll('input[name="x"]');
    const rBoxes = document.querySelectorAll('input[name="r"]');
    const yInput = document.getElementById('y-input');
    const xError = document.getElementById('x-error');
    const yError = document.getElementById('y-error');
    const rError = document.getElementById('r-error');
    const canvasError = document.getElementById('canvas-error');
    const canvas = document.getElementById('plane');

    const ALLOWED_X = ['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3'];
    const ALLOWED_R = ['1', '2', '3', '4', '5'];
    const NUMBER = /^-?\d{1,10}(\.\d{1,20})?$/;

    const graph = Graph.create(canvas);
    const points = Graph.readPoints('#results-body tr[data-x]');

    function checkedValues(boxes) {
        return Array.prototype.filter.call(boxes, function (b) { return b.checked; })
            .map(function (b) { return b.value; });
    }

    function selectedR() {
        const values = checkedValues(rBoxes);
        return values.length === 1 && ALLOWED_R.includes(values[0]) ? values[0] : null;
    }

    function redraw() {
        const r = selectedR();
        graph.draw(r ? Number(r) : null, points);
    }

    function makeSingleChoice(boxes, onChange) {
        boxes.forEach(function (box) {
            box.addEventListener('change', function () {
                if (box.checked) {
                    boxes.forEach(function (other) {
                        if (other !== box) other.checked = false;
                    });
                }
                if (onChange) onChange();
            });
        });
    }

    function isYValid(raw) {
        if (!NUMBER.test(raw)) return false;
        const negative = raw.charAt(0) === '-';
        const intPart = Number(raw.replace('-', '').split('.')[0]);
        return negative ? intPart < 5 : intPart < 3;
    }

    function validateForm() {
        let valid = true;

        const xs = checkedValues(xBoxes);
        xError.textContent = '';
        if (xs.length !== 1 || !ALLOWED_X.includes(xs[0])) {
            xError.textContent = 'Выберите одно значение X';
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
            yError.textContent = 'Y должен быть числом в интервале (-5; 3)';
            yInput.classList.add('invalid');
            valid = false;
        }

        rError.textContent = '';
        if (selectedR() === null) {
            rError.textContent = 'Выберите одно значение R';
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

    makeSingleChoice(xBoxes, function () { xError.textContent = ''; });
    makeSingleChoice(rBoxes, function () {
        rError.textContent = '';
        canvasError.textContent = '';
        redraw();
    });

    canvas.addEventListener('click', function (e) {
        canvasError.textContent = '';
        const r = selectedR();
        if (r === null) {
            canvasError.textContent = 'Выберите радиус R';
            return;
        }

        const c = graph.toCoords(e);
        const x = Math.round(c.x * 1000) / 1000;
        const y = Math.round(c.y * 1000) / 1000;

        if (x < -5 || x > 3) {
            canvasError.textContent = 'X = ' + x + ' не в [-5; 3]';
            return;
        }
        if (y <= -5 || y >= 3) {
            canvasError.textContent = 'Y = ' + y + ' не в (-5; 3)';
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
