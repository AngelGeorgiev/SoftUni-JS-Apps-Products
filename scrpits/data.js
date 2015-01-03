var app = app || {};

app.data = (function () {
    function Data (baseUrl, ajaxRequester) {
        this.users = new Users(baseUrl, ajaxRequester);
        this.products = new Products(baseUrl, ajaxRequester);
    }

    var credentials = (function () {

        function getHeaders() {
            var headers = {
                "X-Parse-Application-Id": "XXsPgrzQjPQMSMrFBXs1PxyYOxeids97gScOFF2X",
                "X-Parse-REST-API-Key": "euHcNBRafL6fXQWn6oyVgnRojKidAyycRrlRS5us",
                "X-Parse-Session-Token": getSessionToken()
            };
            return headers;
        }

        function getSessionToken() {
            return localStorage.getItem("sessionToken");
        }

        function setSessionToken(sessionToken) {
            localStorage.setItem("sessionToken", sessionToken);
        }

        function getUsername() {
            return localStorage.getItem("username");
        }

        function setUsername(username) {
            localStorage.setItem("username", username);
        }

        function getUserId() {
            return localStorage.getItem("userId");
        }

        function setUserId(userId) {
            localStorage.setItem("userId", userId);
        }

        return {
            getSessionToken: getSessionToken,
            setSessionToken: setSessionToken,
            getUsername: getUsername,
            setUsername: setUsername,
            getUserId: getUserId,
            setUserId: setUserId,
            getHeaders: getHeaders
        }
    }());

    var Users = (function (args) {
        function Users(baseUrl, ajaxRequester) {
            this._serviceUrl = baseUrl;
            this._ajaxRequester = ajaxRequester;
            this._headers = credentials.getHeaders();
        }

        Users.prototype.login = function (username, password) {
            var url = this._serviceUrl + "login?username=" + username + "&password=" + password;
            return this._ajaxRequester.get(url, this._headers)
                .then(function (data) {
                    credentials.setSessionToken(data.sessionToken);
                    credentials.setUsername(data.username);
                    credentials.setUserId(data.objectId);
                    return data;
                });
        };

        Users.prototype.register = function (username, password) {
            var user = {
                username: username,
                password: password
            };
            var url = this._serviceUrl + "users";
            return this._ajaxRequester.post(url, user, this._headers)
                .then(function (data) {
                    credentials.setSessionToken(data.sessionToken);
                    return data;
                });
        };

        Users.prototype.validateToken = function () {
            var url = this._serviceUrl + "users/me";
            return this._ajaxRequester.get(url, this._headers);
        };

        Users.prototype.isLogged = function () {
            return credentials.getSessionToken() ? true : false;
        };

        Users.prototype.getData = function () {
            return localStorage;
        };

        return Users;
    }());

    var Products = (function (args) {
        function Products(baseUrl, ajaxRequester) {
            this._serviceUrl = baseUrl + "classes/Product";
            this._ajaxRequester = ajaxRequester;
            this._headers = credentials.getHeaders();
        }

        Products.prototype.getAll = function () {
            return this._ajaxRequester.get(this._serviceUrl, this._headers);
        };

        Products.prototype.getById = function (objectId) {
            var url = this._serviceUrl + "/" + objectId;
            return this._ajaxRequester.get(url, this._headers);
        };

        Products.prototype.add = function (name, category, price, userId) {
            var product = {
                "name": name,
                "category": category,
                "price": price
            };
            product.ACL = { };
            product.ACL[userId] = {"write": true, "read": true};
            product.ACL['*'] = {"read": true};
            return this._ajaxRequester.post(this._serviceUrl, product, this._headers)
        };

        Products.prototype.edit = function (objectId, name, category, price) {
            var url = this._serviceUrl + "/" + objectId;
            var product = {
                "name": name,
                "category": category,
                "price": price
            };
            return this._ajaxRequester.put(url, product, this._headers)

        };

        Products.prototype.delete = function (objectId) {
            var url = this._serviceUrl + "/" + objectId;
            return this._ajaxRequester.delete(url, this._headers);
        };

        return Products;
    }());

    return {
        get: function (baseUrl, ajaxRequester) {
            return new Data(baseUrl, ajaxRequester);
        }
    }
}());