window.Graph = (function () {
    'use strict';

    const RANGE = 6;
    const NOMINAL_R = 4;

    function create(canvas) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const scale = (w / 2 - 20) / RANGE;

        function toPx(x, y) {
            return [cx + x * scale, cy - y * scale];
        }

        function toCoords(event) {
            const rect = canvas.getBoundingClientRect();
            const px = (event.clientX - rect.left) * (w / rect.width);
            const py = (event.clientY - rect.top) * (h / rect.height);
            return {x: (px - cx) / scale, y: (cy - py) / scale};
        }

        function fillShape(R) {
            ctx.fillStyle = 'rgba(52, 122, 194, 0.65)';
            ctx.strokeStyle = 'rgba(30, 80, 140, 0.9)';
            ctx.lineWidth = 1;
            let p;

            ctx.beginPath();
            p = toPx(0, 0);
            ctx.moveTo(p[0], p[1]);
            p = toPx(R, 0);
            ctx.lineTo(p[0], p[1]);
            p = toPx(R, R / 2);
            ctx.lineTo(p[0], p[1]);
            p = toPx(0, R / 2);
            ctx.lineTo(p[0], p[1]);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, R * scale, Math.PI, 1.5 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            p = toPx(0, 0);
            ctx.moveTo(p[0], p[1]);
            p = toPx(R / 2, 0);
            ctx.lineTo(p[0], p[1]);
            p = toPx(0, -R);
            ctx.lineTo(p[0], p[1]);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        function drawAxes(R, symbolic) {
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
                return Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100);
            }

            const marks = [
                {v: R, label: symbolic ? 'R' : fmt(R)},
                {v: R / 2, label: symbolic ? 'R/2' : fmt(R / 2)},
                {v: -R / 2, label: symbolic ? '-R/2' : fmt(-R / 2)},
                {v: -R, label: symbolic ? '-R' : fmt(-R)}
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
        }

        function drawPoints(points) {
            points.forEach(function (pt) {
                const p = toPx(pt.x, pt.y);
                ctx.beginPath();
                ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
                ctx.fillStyle = pt.hit ? '#1e7e34' : '#c0392b';
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            });
        }

        function draw(R, points) {
            ctx.clearRect(0, 0, w, h);
            const symbolic = !R;
            const shapeR = symbolic ? NOMINAL_R : R;
            fillShape(shapeR);
            drawAxes(shapeR, symbolic);
            drawPoints(symbolic ? points : points.filter(function (p) {
                return Number(p.r) === Number(R);
            }));
        }

        return {draw: draw, toCoords: toCoords};
    }

    function readPoints(selector) {
        return Array.prototype.map.call(document.querySelectorAll(selector), function (row) {
            return {
                x: parseFloat(row.dataset.x),
                y: parseFloat(row.dataset.y),
                r: row.dataset.r,
                hit: row.dataset.hit === 'true'
            };
        });
    }

    return {create: create, readPoints: readPoints};
})();
