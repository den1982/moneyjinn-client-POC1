var MONEYJINN = MONEYJINN || {};

// Create the namespace for the logic
MONEYJINN.createNS("MONEYJINN");


MONEYJINN.login = function () {

    var userService = new MONEYJINN.MODEL.user();
    var authService = new MONEYJINN.MODEL.NAVIGATION.rules();
    var username= null;
    var password = null;

    var submitLoginForm = function () {
        var userService = new MONEYJINN.MODEL.user();
        username = $('#user').val();
        password = $('#password').val();

        var login_nav_rules = authService.restSettings.login.GET;
        var restService = new MONEYJINN.UTIL.rest();

        password = MONEYJINN.UTIL.auth().calculateSha1Value(password);

        restService.handleRequest(password, login_nav_rules.verb, login_nav_rules.contentType,
            login_nav_rules.url + username, null, username, handleLoginResponseCallback)

    }

    var handleLoginResponseCallback = function (response) {
        $('#response').text("Response von Request:  " + JSON.stringify(response));

        if (response.getUserSettingsForStartupResponse != undefined) {

            var settings = response.getUserSettingsForStartupResponse;

            var userId =settings.userId;
            var settingDateFormat = settings.settingDateFormat;
            var settingDisplayedLanguage = settings.settingDisplayedLanguage;
            var permissionAdmin = settings.permissionAdmin;
            var attributeNew = settings.attributeNew;
            var nextPageToken = "ToDo:";

            userService.storeUserSettings(username, password, userId, settingDateFormat, settingDisplayedLanguage, permissionAdmin, attributeNew, nextPageToken);

            window.location.replace("home.html");


        } else {
            alert("TODO: Login error handling");
        }
    }

    var checkUserLoggedIn = function(redirect_url) {
        var userSettings = userService.getUserSettings();
        if (userSettings == undefined || userSettings.userId == undefined) {
           if (redirect_url != undefined && redirect_url != null) {
               window.location.replace(redirect_url);
           }
            return false;
        }

        return true;
    }

// public API
    return {
        submitLoginForm: submitLoginForm,
        checkUserLoggedIn: checkUserLoggedIn

    };

}
;