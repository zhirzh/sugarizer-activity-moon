define(['activity/data-model', 'activity/draw', 'webL10n'], function(DataModel, Draw, l10n) {

    'use strict';

    var toggleGridBtn = document.querySelector('#toggle-grid-button'),
        toggleHemisphereBtn = document.querySelector('#toggle-hemisphere-button');

    var canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d');

    var _ = l10n.get;

    var IMAGE_SIZE, HALF_SIZE, updateTimeout;
    var showGrid, showSouth;



    function setup() {
        /*
            Exposed function - calls all other functions
        */

        initPrefs();
        initEventListeners();
        updateSizes();
        updateView();
    }


    function initPrefs() {
        /*
            Read/write user preferences from/to window.localStorage
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
            Update moon data and
            draw moon, repeteadly, after a fixed interval.

            Also, depending on user's preferences:
                * Toggle hemisphere
                * Draw grid
        */

        clearTimeout(updateTimeout);
        updateInfo();
        Draw.setImageSize(IMAGE_SIZE);
        Draw.moon(DataModel.phase_of_moon);
        if (showSouth) {
            ctx.save();
            ctx.rotate(Math.PI);
            ctx.drawImage(canvas, -IMAGE_SIZE, -IMAGE_SIZE);
            ctx.restore();

            if (showGrid) {
                Draw.grid(_('SNWE'));
            }
        } else if (showGrid) {
            Draw.grid(_('NSEW'));
        }
        updateTimeout = setTimeout(updateView, 5000);
    }


    function updateInfo() {
        /*
            Update moon data and
            render updated information as HTML
        */

        DataModel.update_moon_calculations();

        var infoParts = {};
        var keys = [
            'moonInfo',
            'phase',
            'julian',
            'age',
            'lunation',
            'visibility',
            'seleno',
            'full',
            'new',
            'lunar',
            'solar'
        ];

        infoParts[_(keys[0])] = [
            formatDate()
        ];

        infoParts[_(keys[1])] = [
            _(DataModel.moon_phase_name())
        ];

        infoParts[_(keys[2])] = [
            DataModel.julian_date.toFixed(2),
            _('astro')
        ];

        infoParts[_(keys[3])] = [DataModel.days_old,
            _('days') + ',',
            DataModel.hours_old,
            _('hours') + ',',
            DataModel.minutes_old,
            _('minutes')
        ];

        infoParts[_(keys[4])] = [
            100 * DataModel.phase_of_moon.toFixed(2) + '%',
            _('thru'),
            DataModel.lunation
        ];

        infoParts[_(keys[5])] = [
            100 * DataModel.percent_of_full_moon.toFixed(2) + '%',
            _('estimated')
        ];

        infoParts[_(keys[6])] = [
            DataModel.selenographic_deg.toFixed(2) + '\u00b0',
            _(DataModel.west_or_east),
            '(' + _(DataModel.rise_or_set) + ')'
        ];

        infoParts[_(keys[7])] = [
            formatDate(DataModel.next_full_moon_date),
            _('in'),
            DataModel.days_until_full_moon.toFixed(),
            _('days')
        ];

        infoParts[_(keys[8])] = [
            formatDate(DataModel.next_new_moon_date),
            _('in'),
            DataModel.days_until_new_moon.toFixed(),
            _('days')
        ];

        infoParts[_(keys[9])] = [
            formatDate(DataModel.next_lunar_eclipse_date),
            _('in'),
            DataModel.days_until_lunar_eclipse.toFixed(),
            _('days')
        ];

        infoParts[_(keys[10])] = [
            formatDate(DataModel.next_solar_eclipse_date),
            _('in'),
            DataModel.days_until_solar_eclipse.toFixed(),
            _('days')
        ];


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
        /*
            Show/hide grid
        */

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
        /*
            Read canvas data as base64 string and
            initiate download
        */

        var dataURL = canvas.toDataURL('image/jpeg', 1);
        var downloadLink = document.querySelector('#save-image-button a');
        downloadLink.href = dataURL;
        downloadLink.click();
    }


    function formatDate(date) {
        /*
            Modify rendered dates to match Sugar Moon format
        */

        if (!date) {
            date = new Date();
        } else {

            date = new Date(1000 * date);
        }

        date = date.toString().split(' ');

        date[0] = _(date[0]);
        date[1] = [date[2], date[2] = date[1]][0];
        date[2] = _(date[2]);
        date[4] = date[4].split(':');
        date[5] = ((+date[4][0]) < 12) ? 'AM' : 'PM';
        date[4][0] = ((+date[4][0]) % 12) ? (+date[4][0]) % 12 : 12;
        date[4] = date[4].join(':');

        date[6] = date[6].slice(1, -1);

        return date.join(' ');
    }

    return {
        setup: setup,
        updateInfo: updateInfo
    };
});