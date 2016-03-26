define([], function() {

    'use strict';

    var canvas, ctx, moon, IMAGE_SIZE, HALF_SIZE, updateTimeout;
    var toggleGridBtn, toggleHemisphereBtn, showGrid, showSouth;


    function init() {
        toggleGridBtn = document.querySelector('#toggle-grid-button');
        toggleHemisphereBtn = document.querySelector('#toggle-hemisphere-button');

        canvas = document.querySelector('canvas');
        ctx = canvas.getContext('2d');

        moon = document.querySelector('img#moon');

        initPrefs();
        initEventListeners();
        updateSizes();
        updateView();
    }


    function initPrefs() {
        /*
            Store preferences in window.localStorage across sessions.
        */

        showGrid = window.localStorage.getItem('showGrid');
        if (showGrid === 'true') {
            showGrid = true;
            toggleGridBtn.classList.add('active');
        } else {
            showGrid = false;
            window.localStorage.setItem('showGrid', false);
        }

        showSouth = window.localStorage.getItem('showSouth');
        if (showSouth === 'true') {
            showSouth = true;
            toggleHemisphereBtn.classList.add('active');
        } else {
            showSouth = false;
            window.localStorage.setItem('showSouth', false);
        }
    }


    function updateSizes() {
        /*
            Dynamically resize elements as and when the window resizes.
        */

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
        /*
            Draw moon.
        */

        ctx.drawImage(moon, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
        if (showSouth) {
            ctx.save();
            ctx.rotate(Math.PI);
            ctx.drawImage(canvas, -IMAGE_SIZE, -IMAGE_SIZE);
            ctx.restore();
        }
        updateTimeout = setTimeout(updateView, 1000);
    }


    function initEventListeners() {
        /*
            Bind event-listeners.
        */

        window.addEventListener('resize', function() {
            updateSizes();
            updateView();
        });

        toggleGridBtn.addEventListener('click', toggleGrid);
        toggleHemisphereBtn.addEventListener('click', toggleHemisphere);
        // document.querySelector('#save-image-button').addEventListener('click', saveImage);
    }


    function toggleGrid() {
        showGrid = !showGrid;
        if (showGrid) {
            toggleGridBtn.classList.add('active');
        } else {
            toggleGridBtn.classList.remove('active');
        }
        window.localStorage.setItem('showGrid', showGrid);

        clearTimeout(updateTimeout);
        updateView();
    }


    function toggleHemisphere() {
        /*
            Rotate moon image to represent southern-hemisphere view.
        */

        showSouth = !showSouth;
        if (showSouth) {
            toggleHemisphereBtn.classList.add('active');
        } else {
            toggleHemisphereBtn.classList.remove('active');
        }
        window.localStorage.setItem('showSouth', showSouth);

        clearTimeout(updateTimeout);
        updateView();
    }

    return {
        init: init
    };
});