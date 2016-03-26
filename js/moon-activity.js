define([], function() {

    'use strict';

    var canvas, ctx;

    var buttonStates = {
        grid: false,
        hemisphere: false
    };


    function init() {
        initEventListeners();
        initCanvas();
        updateSizes();
    }


    function initCanvas() {
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext('2d');
    }


    function updateSizes() {
        var navbarOffset = document.querySelector('#main-toolbar').clientHeight;
        document.querySelector('#panel-container').style.height = (window.innerHeight - navbarOffset) + 'px';
    }


    function initEventListeners() {
        window.addEventListener('resize', updateSizes);
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
    }


    function toggleHemisphere() {
        console.log(buttonStates.hemisphere);
    }


    function toggleGrid() {
        console.log(buttonStates.grid);
    }

    return {
        init: init
    };
});