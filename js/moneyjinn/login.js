var MONEYJINN = MONEYJINN || {};

// Create the namespace for the logic
MONEYJINN.createNS("MONEYJINN");


MONEYJINN.login = function () {

    var username= null;
    var password = null;

    var submitLoginForm = function () {

        username = $('#user').val();
        password = $('#password').val();

        var login_nav_rules = new MONEYJINN.MODEL.NAVIGATION.rules().restSettings.login.GET;
        var restService = new MONEYJINN.UTIL.rest();

        password = MONEYJINN.UTIL.auth().calculateSha1Value(password);

        restService.handleRequest(password, login_nav_rules.verb, login_nav_rules.contentType,
            login_nav_rules.url + username, null, username, handleLoginResponseCallback)

    }

    var handleLoginResponseCallback = function (response) {
        $('#response').text("Response von Request:  " + JSON.stringify(response));

        if (response.getUserSettingsForStartupResponse != undefined) {
            var userService = new MONEYJINN.MODEL.user();
            var settings = response.getUserSettingsForStartupResponse;

            var userId =settings.userId;
            var settingDateFormat = settings.settingDateFormat;
            var settingDisplayedLanguage = settings.settingDisplayedLanguage;
            var permissionAdmin = settings.permissionAdmin;
            var attributeNew = settings.attributeNew;
            var nextPageToken = "ToDo:";

            userService.storeUserSettings(username, password, userId, settingDateFormat, settingDisplayedLanguage, permissionAdmin, attributeNew, nextPageToken);
            var userSettings = userService.getUserSettings();

        } else {
            alert("TODO: Login error handling");
        }
    }

// public API
    return {
        submitLoginForm: submitLoginForm

    };

}
;