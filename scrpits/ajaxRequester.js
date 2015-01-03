var app = app || {};

app.ajaxRequester = (function () {

    function AjaxRequester() {
        this.get = makeGetRequest;
        this.post = makePostRequest;
        this.put = makePutRequest;
        this.delete = makeDeleteRequest;
    }

    var makeReuqest = function (url, method, data, headers) {
        var defer = Q.defer();

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(data),
            headers: headers,
            success: function (data) {
                defer.resolve(data);
            },
            error: function (error) {
                defer.reject(error);
            }
        })

        return defer.promise;
    };

    var makeGetRequest = function (url, headers) {
        return makeReuqest(url, 'GET', null, headers);
    };

    var makePostRequest = function (url, data, headers) {
        return makeReuqest(url, 'POST', data, headers);
    };

    var makePutRequest = function (url, data, headers) {
        return makeReuqest(url, 'PUT', data, headers);
    };

    var makeDeleteRequest = function (url, headers) {
        return makeReuqest(url, 'DELETE', null, headers);
    };


    return {
        get: function () {
            return new AjaxRequester();
        }
    }
}());