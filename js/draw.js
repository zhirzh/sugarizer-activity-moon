define(function() {

    'use strict';

    var canvas, ctx, moon, IMAGE_SIZE, HALF_SIZE;


    (function init() {
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext('2d');

        moon = document.querySelector('img#moon');

        if (!ctx.ellipse) {
            ctx.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
                /* for this project, we do not need: rotation, startAngle, endAngle, anticlockwise */
                x -= radiusX;
                y -= radiusY;
                radiusX *= 2;
                radiusY *= 2;

                var kappa = 0.5522848,
                    ox = (radiusX / 2) * kappa, // control point offset horizontal
                    oy = (radiusY / 2) * kappa, // control point offset vertical
                    xe = x + radiusX, // x-end
                    ye = y + radiusY, // y-end
                    xm = x + radiusX / 2, // x-middle
                    ym = y + radiusY / 2; // y-middle

                if (startAngle === Math.PI / 2 && endAngle === 3 * Math.PI / 2) {
                    ctx.moveTo(xm, ye);
                    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym); /* 2nd quarter */
                    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y); /* 3rd quarter */
                } else if (startAngle === 3 * Math.PI / 2 && endAngle === Math.PI / 2) {
                    ctx.moveTo(xm, y);
                    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym); /* 4th quarter */
                    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye); /* 1st quarter */
                } else if (startAngle === 0 && endAngle === 2 * Math.PI) {
                    ctx.moveTo(xe, ym);
                    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye); /* 1st quarter */
                    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym); /* 2nd quarter */
                    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y); /* 3rd quarter */
                    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym); /* 4th quarter */
                }
            };
        }
    })();


    function draw(phase_of_moon, IMAGE_SIZE) {
        var HALF_SIZE = IMAGE_SIZE / 2;

        var phase_shadow_adjust = null;
        var arc_scale = null;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);

        if (phase_of_moon < 0.25) {
            phase_shadow_adjust = phase_of_moon - Math.abs(Math.sin(phase_of_moon * Math.PI * 4) / 18.0);
            arc_scale = 1 - 4 * phase_shadow_adjust;

            ctx.fillStyle = 'white';
            ctx.fillRect(HALF_SIZE, 0, HALF_SIZE, IMAGE_SIZE);
            ctx.fillStyle = 'black';
            drawEllipse(HALF_SIZE - IMAGE_SIZE * arc_scale / 2, 0, IMAGE_SIZE * arc_scale, IMAGE_SIZE, 0, 3 * Math.PI / 2, Math.PI / 2);
            ctx.fill();

        } else if (phase_of_moon < 0.50) {
            phase_shadow_adjust = phase_of_moon + Math.abs(Math.sin(phase_of_moon * Math.PI * 4) / 18.0);
            arc_scale = 4 * (phase_shadow_adjust - 0.25);

            ctx.fillStyle = 'white';
            ctx.fillRect(HALF_SIZE, 0, HALF_SIZE, IMAGE_SIZE);
            ctx.fillStyle = 'white';
            drawEllipse(HALF_SIZE - IMAGE_SIZE * arc_scale / 2, 0, IMAGE_SIZE * arc_scale, IMAGE_SIZE, 0, Math.PI / 2, 3 * Math.PI / 2);
            ctx.fill();

        } else if (phase_of_moon < 0.75) {
            phase_shadow_adjust = phase_of_moon - Math.abs(Math.sin(phase_of_moon * Math.PI * 4) / 18.0);
            arc_scale = 1 - 4 * (phase_shadow_adjust - 0.5);

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, HALF_SIZE, IMAGE_SIZE);
            ctx.fillStyle = 'white';
            drawEllipse(HALF_SIZE - IMAGE_SIZE * arc_scale / 2, 0, IMAGE_SIZE * arc_scale, IMAGE_SIZE, 0, 3 * Math.PI / 2, Math.PI / 2);
            ctx.fill();

        } else {
            phase_shadow_adjust = phase_of_moon + Math.abs(Math.sin(phase_of_moon * Math.PI * 4) / 18.0);
            arc_scale = 4 * (phase_shadow_adjust - 0.75);

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, HALF_SIZE, IMAGE_SIZE);
            ctx.fillStyle = 'black';
            drawEllipse(HALF_SIZE - IMAGE_SIZE * arc_scale / 2, 0, IMAGE_SIZE * arc_scale, IMAGE_SIZE, 0, Math.PI / 2, 3 * Math.PI / 2);
            ctx.fill();
        }
        ctx.save();

        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(moon, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
        ctx.globalAlpha = 0.5;
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(moon, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

        ctx.restore();
    }


    function drawEllipse(x, y, width, height, rotation, startAngle, endAngle, anticlockwise) {
        ctx.beginPath();
        x += width / 2;
        y += height / 2;
        var radiusX = width / 2;
        var radiusY = height / 2;
        ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
        ctx.stroke();
    }


    function radian(deg) {
        return deg / 180 * Math.PI;
    }

    return draw;
});