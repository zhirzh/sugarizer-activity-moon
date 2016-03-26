define([], function() {

    'use strict';

    var buttonStates = {
        grid: false,
        hemisphere: false
    };


    function init() {
        addEventListeners();
    }


    function addEventListeners() {
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