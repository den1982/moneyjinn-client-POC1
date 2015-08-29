var MONEYJINN = MONEYJINN || {};

//Function to simply create a namespace
MONEYJINN.createNS = function (namespace) {
    var nsparts = namespace.split(".");
    var parent = MONEYJINN;

    if (nsparts[0] === "MONEYJINN") {
        nsparts = nsparts.slice(1);
    }

    for (var i = 0; i < nsparts.length; i++) {
        var partname = nsparts[i];
        if (typeof parent[partname] === "undefined") {
            parent[partname] = {};
        }
        parent = parent[partname];
    }
    return parent;
};

MONEYJINN.debug = function() {

    var logObjectToConsole = function(object, debugText) {
        console.log(debugText+ ":");
        $.each(object, function (index, value) {
            console.log(value);
        });
    }
    // public API
    return {
        logObjectToConsole:logObjectToConsole
    };
};

MONEYJINN.createNS("MONEYJINN.UTIL");

MONEYJINN.UTIL.auth = function () {

    var getRESTAuthorization = function (secret, httpVerb, contentType, url, date, body, ident) {

        httpVerb = convertToStringObject(httpVerb);
        contentType = convertToStringObject(contentType);
        url = convertToStringObject(url);
        body = convertToStringObject(body);
        ident = convertToStringObject(ident);

        if (body.length > 0) {
            var body_md5 = md5(body);
        } else {
            body_md5 = "";
        }
        stringToSign = httpVerb + "\n" + body_md5 + "\n" + contentType + "\n" + date + "\n\n" + url;

        var secret_bits = sjcl.codec.utf8String.toBits(secret);
        var hmac_bits = (new sjcl.misc.hmac(secret_bits, sjcl.hash.sha1)).mac(stringToSign);
        var hmac = sjcl.codec.hex.fromBits(hmac_bits)

        var base64bits = sjcl.codec.utf8String.toBits(hmac);
        var base64 = sjcl.codec.base64.fromBits(base64bits);
        return "MNF" + ident + ":" + base64;
    };

    var calculateSha1Value = function(value) {
        var sha1_byte = sjcl.hash.sha1.hash(value);
        var value_hash = sjcl.codec.hex.fromBits(sha1_byte);
        return value_hash
    }

    var convertToStringObject = function (string) {

        if (typeof string === 'string' || string instanceof String) {
            return string;
        }
        else {
            return new String();
        }
    }

    // public API
    return {
        calculateSha1Value:calculateSha1Value,
        getRESTAuthorization: getRESTAuthorization

    };
};

MONEYJINN.UTIL.rest = function () {
    var handleRequest = function (secret, httpVerb, contentType, url, body, ident, callback) {

        var authService = new MONEYJINN.UTIL.auth();
        var url_without_domain = url.replace(/^.*\/\/[^\/]+/, '');
        var now = new Date().toGMTString();

        var authcode = authService.getRESTAuthorization(secret, httpVerb, contentType, url_without_domain, now, body, ident);

        switch (httpVerb) {
            case 'GET':
                //GET requests have per default body empty
                body = "";
                getRequest(secret, httpVerb, contentType, url, body, ident, now, authcode, callback);
                break;
        }
    }

    var getRequest = function (secret, httpVerb, contentType, url, body, ident, now, authcode, callback) {

        $.ajax({

            url: url,
            data: body,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                MONEYJINN.debug().logObjectToConsole(response, "Response from GET Request " + url)
                callback(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //TODO: Exception handling
                alert(xhr.status);
                alert(thrownError);
            },
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Authentication", authcode);
                xhrObj.setRequestHeader("Requestdate", now);
            }
        });
    }

    return {
        handleRequest: handleRequest
    };
};



