define([], function() {

    'use strict';

    var canvas, ctx, moon, IMAGE_SIZE, HALF_SIZE, buttonStates, updateTimeout;


    function init() {
        initButtonStates();
        initEventListeners();
        initCanvas();
        updateSizes();
        updateView();
    }


    function initButtonStates() {
        var storesButtonStates = window.localStorage.getItem('buttonStates');
        if (storesButtonStates === null) {
            buttonStates = {
                grid: false,
                hemisphere: false
            };
            window.localStorage.setItem('buttonStates', JSON.stringify(buttonStates));
        }

        buttonStates = JSON.parse(storesButtonStates);
        for (var k in buttonStates) {
            if (buttonStates[k]) {
                document.querySelector('#toggle-' + k + '-button')
                    .classList.add('active');
            }
        }
    }


    function initCanvas() {
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext('2d');
        moon = document.querySelector('img#moon');
    }


    function updateSizes() {
        var navbarOffset = document.querySelector('#main-toolbar').clientHeight;
        document.querySelector('#panel-container').style.height = (window.innerHeight - navbarOffset) + 'px';

        var canvasPanelHeight = document.querySelector('#panel-right').clientHeight;
        var canvasPanelWidth = document.querySelector('#panel-right').clientWidth;
        var paddingPercent = 0.05;

        IMAGE_SIZE = (1 - paddingPercent) * Math.min(canvasPanelWidth, canvasPanelHeight);
        HALF_SIZE = 0.5 * IMAGE_SIZE;

        canvas.width = IMAGE_SIZE;
        canvas.height = IMAGE_SIZE;

        canvas.style.top = 0.5 * (canvasPanelHeight - canvas.height) + 'px';
        canvas.style.left = 0.5 * (canvasPanelWidth - canvas.width) + 'px';
    }


    function updateView() {
        ctx.drawImage(moon, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
        if (buttonStates.hemisphere) {
            ctx.save();
            ctx.rotate(Math.PI);
            ctx.drawImage(canvas, -IMAGE_SIZE, -IMAGE_SIZE);
            ctx.restore();
        }
        updateTimeout = setTimeout(updateView, 1000);
    }


    function initEventListeners() {
        window.addEventListener('resize', function() {
            updateSizes();
            updateView();
        });

        document.querySelector('#main-toolbar')
            .addEventListener('click', function(e) {
                switch (e.target.id) {
                    case 'toggle-grid-button':
                    case 'toggle-hemisphere-button':
                        toggle('#' + e.target.id);
                        break;
                    case 'save-image-button':
                        saveImage();
                        break;
                    default:
                        break;
                }
            });
    }


    function toggle(id) {
        var buttonName = id.split('-')[1];
        buttonStates[buttonName] = !buttonStates[buttonName];
        if (buttonStates[buttonName]) {
            document.querySelector(id).classList.add('active');
        } else {
            document.querySelector(id).classList.remove('active');
        }

        if (buttonName === 'grid') {
            toggleGrid();
        } else {
            toggleHemisphere();
        }
        window.localStorage.setItem('buttonStates', JSON.stringify(buttonStates));
    }


    function toggleHemisphere() {
        clearTimeout(updateTimeout);
        updateView();
    }


    function toggleGrid() {
        console.log(buttonStates.grid);
    }

    return {
        init: init
    };
});