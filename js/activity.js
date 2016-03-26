define(function (require) {
    var activity = require("sugar-web/activity/activity");
    var moonActivity = require("activity/moon-activity");

    // Manipulate the DOM only when it is ready.
    require(['domReady!'], function (doc) {

        // Initialize the activity.
        activity.setup();
        moonActivity.init();

    });

});
