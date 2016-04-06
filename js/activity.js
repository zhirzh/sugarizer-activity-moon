define(function (require) {
    var activity = require("sugar-web/activity/activity");
    var moonActivity = require("activity/moon-activity");
    window.l10n = require("webL10n");

    // Manipulate the DOM only when it is ready.
    require(['domReady!'], function (doc) {

        // Initialize the activity.
        activity.setup();
        moonActivity.setup();
        l10n.ready(function() {
            /*
                Whenever language changes, render translated text
            */
            moonActivity.updateInfo();
        });

    });

});
