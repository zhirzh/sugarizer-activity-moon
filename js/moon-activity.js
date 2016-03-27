define(['activity/data-model', 'activity/draw'], function(DataModel, Draw) {

    'use strict';

    var canvas, ctx, IMAGE_SIZE, HALF_SIZE, updateTimeout;
    var toggleGridBtn, toggleHemisphereBtn, showGrid, showSouth;


    function init() {
        toggleGridBtn = document.querySelector('#toggle-grid-button');
        toggleHemisphereBtn = document.querySelector('#toggle-hemisphere-button');

        canvas = document.querySelector('canvas');
        ctx = canvas.getContext('2d');

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

        clearTimeout(updateTimeout);
        updateInfo();
        Draw.moon(DataModel.phase_of_moon, IMAGE_SIZE);
        if (showSouth) {
            ctx.save();
            ctx.rotate(Math.PI);
            ctx.drawImage(canvas, -IMAGE_SIZE, -IMAGE_SIZE);
            ctx.restore();

            if (showGrid) {
                Draw.grid('SNWE', IMAGE_SIZE);
            }
        } else if (showGrid) {
            Draw.grid('NSEW', IMAGE_SIZE);
        }
        updateTimeout = setTimeout(updateView, 5000);
    }


    function updateInfo() {
        DataModel.update_moon_calculations();

        var infoParts = {
            'Today\'s Moon Information': [_(new Date())],
            'Phase': [DataModel.moon_phase_name()],
            'Julian Date': [DataModel.julian_date.toFixed(2), '(astronomical)'],
            'Age': [DataModel.days_old + ' days,', DataModel.hours_old + ' hours,', DataModel.minutes_old + ' minutes'],
            'Lunation': [(100 * DataModel.phase_of_moon).toFixed(2) + '%', 'through lunation', DataModel.lunation],
            'Surface Visibility': [(100 * DataModel.percent_of_full_moon).toFixed(2) + '%', '(estimated)'],
            'Selenographic Terminator Longitude': [DataModel.selenographic_deg.toFixed(2) + '\u00b0', DataModel.west_or_east, '(' + DataModel.rise_or_set + ')'],
            'Next Full Moon': [_(new Date(1000 * DataModel.next_full_moon_date)), 'in', DataModel.days_until_full_moon.toFixed(), 'days'],
            'Next New Moon': [_(new Date(1000 * DataModel.next_new_moon_date)), 'in', DataModel.days_until_new_moon.toFixed(), 'days'],
            'Next Lunar eclipse': [_(new Date(1000 * DataModel.next_lunar_eclipse_date)), 'in', DataModel.days_until_lunar_eclipse.toFixed(), 'days'],
            'Next Solar eclipse': [_(new Date(1000 * DataModel.next_solar_eclipse_date)), 'in', DataModel.days_until_solar_eclipse.toFixed(), 'days']
        };

        var infoHTML = [];
        for (var k in infoParts) {
            var html = '<p>' + k + ':<br>' + infoParts[k].join(' ') + '</p>';
            infoHTML.push(html);
        }

        infoHTML = infoHTML.join('');
        document.querySelector('#panel-left').innerHTML = infoHTML;
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
        document.querySelector('#save-image-button').addEventListener('click', saveImage);
    }


    function toggleGrid() {
        showGrid = !showGrid;
        if (showGrid) {
            toggleGridBtn.classList.add('active');
        } else {
            toggleGridBtn.classList.remove('active');
        }
        window.localStorage.setItem('showGrid', showGrid);

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

        updateView();
    }


    function saveImage() {
        var dataURL = canvas.toDataURL('image/jpeg', 1);
        var downloadLink = document.querySelector('#save-image-button a');
        downloadLink.href = dataURL;
        downloadLink.click();
    }


    function _(date) {
        date = date.toString().split(' ');

        date[1] = [date[2], date[2] = date[1]][0];

        date[0] = {
            Sun: 'Sunday',
            Mon: 'Monday',
            Tue: 'Tuesday',
            Wed: 'Wednesday',
            Thu: 'Thursday',
            Fri: 'Friday',
            Sat: 'Saturday'
        }[date[0]];

        date[2] = {
            Jan: 'January',
            Feb: 'February',
            Mar: 'March',
            Apr: 'April',
            May: 'May',
            Jun: 'June',
            Jul: 'July',
            Aug: 'August',
            Sep: 'September',
            Oct: 'October',
            Nov: 'November',
            Dec: 'December'
        }[date[2]];

        date[4] = date[4].split(':');
        date[5] = ((+date[4][0]) < 12) ? 'AM' : 'PM';
        date[4][0] = ((+date[4][0]) % 12) ? (+date[4][0]) % 12 : 12;
        date[4] = date[4].join(':');

        date[6] = date[6].slice(1, -1);

        return date.join(' ');
    }

    return {
        init: init
    };
});