var MONEYJINN = MONEYJINN || {};

MONEYJINN.createNS("MONEYJINN.DIALOG");

MONEYJINN.DIALOG.init = function () {

    var initDialog = function(){
        //Init navigation menue
        $( "#navigation_container" ).load( "navigation.html #navigation" );

        //register logout link to destroy user cookie
        $(document).on('click','#logoutLink', function() {
            MONEYJINN.MODEL.user().deleteUserSettings();
            MONEYJINN.login().checkUserLoggedIn('login.html');
        });


    }


    // public API
    return {
        initDialog:initDialog
    };
};