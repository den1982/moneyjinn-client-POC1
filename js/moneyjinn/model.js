var MONEYJINN = MONEYJINN || {};

MONEYJINN.createNS("MONEYJINN.MODEL");

MONEYJINN.MODEL.user = function(){
    // private variables

    var userSettings = {
        username: null,
        password_sha1: null,
        userId: null,
        settingDateFormat: null,
        settingDisplayedLanguage: null,
        permissionAdmin: null,
        attributeNew: false,
        nextPageToken: null
    };
    // private methods


    var storeUserCookie = function() {
        Cookies.set('userCredentials', userSettings);
    }

    var deleteUserCookie = function() {
        Cookies.remove('userCredentials');
    }

    var storeUserSettings = function (username, password, userId, settingDateFormat, settingDisplayedLanguage, permissionAdmin, attributeNew, nextPageToken) {

        userSettings.username = username;
        userSettings.password_sha1 = password;
        userSettings.userId = userId;
        userSettings.settingDateFormat = settingDateFormat;
        userSettings.settingDisplayedLanguage = settingDisplayedLanguage;
        userSettings.permissionAdmin = permissionAdmin;
        userSettings.attributeNew = attributeNew;
        userSettings.nextPageToken = nextPageToken;

        storeUserCookie();
    }

    var getUserCookie= function() {
        return Cookies.getJSON('userCredentials');
    }

    // public API
    return {
        storeUserSettings: storeUserSettings,
        deleteUserSettings:deleteUserCookie,
        getUserSettings: getUserCookie
    };
};

MONEYJINN.createNS("MONEYJINN.MODEL.NAVIGATION");

MONEYJINN.MODEL.NAVIGATION.rules = function(){

    var restSettings = {

        "login" : {
            "GET": {
                "url": 'http://laladev.org/moneyflow/server/user/getUserSettingsForStartup/',
                "contentType": null,
                "verb": "GET"
            }
        }
    };

    // public API
    return {
        restSettings: restSettings

    };
};