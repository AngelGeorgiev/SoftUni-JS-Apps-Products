var app = app || {};

app.controller = (function () {
    function BaseController(data) {
        this._data = data;

    }

    BaseController.prototype.loadWelcomeMenu = function (menuSelector) {
        $(menuSelector).load('./views/menu-guest.html');
    };

    BaseController.prototype.loadUserMenu = function (menuSelector) {
        $(menuSelector).load("./views/menu-user.html");
    };

    BaseController.prototype.loadWelcome = function (selector) {
        $(selector).load("./views/welcome.html");
    };

    BaseController.prototype.loadLogin = function (selector) {
        $(selector).load("./views/login.html");
    };

    BaseController.prototype.loadRegister = function (selector) {
        $(selector).load("./views/register.html");
    };

    BaseController.prototype.loadHome = function (selector) {
        if (!this._data.users.isLogged()) {
            Noty.error("You are not logged in.");
            window.location = "#/";
            return;
        }

        var local = localStorage;
        $.get("./views/home.html", function (template) {
            var output = Mustache.render(template, {
                username: local.username
            });
            $(selector).html(output);
        });
    };

    BaseController.prototype.loadProducts = function (selector) {
        var _this = this;
        if (!this._data.users.isLogged()) {
            Noty.error("You are not logged in.");
            window.location = "#/";
            return;
        }

        this._data.products.getAll()
            .then(function (data) {
                $.get("./views/products-list.html", function (template) {
                    var products = data.results;
                    var categories = [];
                    var userId = _this._data.users.getData().userId;

                    products.forEach(function(product) {
                        product.priceString = parseFloat(product.price).toFixed(2);

                        if(product.ACL[userId]) {
                            product.buttonVisibility = "visible";
                        } else {
                            product.buttonVisibility = "hidden";
                        }

                        if($.inArray(product.category, categories) === -1) {
                            categories.push(product.category);
                        }
                    });

                    data.categories = categories;

                    var output = Mustache.render(template, data);
                    $(selector).html(output);
                });
            });
    };

    BaseController.prototype.loadAddProduct = function (selector) {
        if (!this._data.users.isLogged()) {
            Noty.error("You are not logged in.");
            window.location = "#/";
            return;
        }

        $(selector).load("./views/add-product.html");
    };

    BaseController.prototype.loadEditProduct = function (selector, productId) {
        if (!this._data.users.isLogged()) {
            Noty.error("You are not logged in.");
            window.location = "#/";
            return;
        }

        this._data.products.getById(productId)
            .then(function (data) {
                $.get("./views/edit-product.html", function (template) {
                    var output = Mustache.render(template, data);
                    $(selector).html(output);
                });
            });
    };

    BaseController.prototype.loadDeleteProduct = function (selector, productId) {
        if (!this._data.users.isLogged()) {
            Noty.error("You are not logged in.");
            window.location = "#/";
            return;
        }

        this._data.products.getById(productId)
            .then(function (data) {
                $.get("./views/delete-product.html", function (template) {
                    var output = Mustache.render(template, data);
                    $(selector).html(output);
                });
            });
    };


    BaseController.prototype.attachEventHandlers = function () {
        var selector = "#wrapper";
        attachLoginHandler.call(this, selector);
        attachRegisterHandler.call(this, selector);
        attachLogoutHandler.call(this, selector);
        attachCreateProductHandler.call(this, selector);
        attachEditProductHandler.call(this, selector);
        attachDeleteProductHandler.call(this, selector);
        attachSubmitFilterHandler.call(this, selector);
        attachClearFiltersHandler.call(this, selector);
    };

    var attachLoginHandler = function (selector) {
        var _this = this;
        $(selector).on("click", "#login-button", function () {
            var username = $('#username').val();
            var password = $('#password').val();
            _this._data.users.login(username, password)
                .then(function (data) {
                    Noty.success("Login successful.");
                    window.location = "#/home";
                },
                function (error) {
                    Noty.error("Incorrect username/password.");
                });
        });
    };

    var attachRegisterHandler = function (selector) {
        var _this = this;
        $(selector).on("click", "#register-button", function () {
            var username = $('#username').val();
            var password = $('#password').val();
            var confirmPassword = $('#confirm-password').val();

            if(password !== confirmPassword) {
                Noty.error("The two passwords does not match.");
                return;
            }

            _this._data.users.register(username, password)
                .then(function (data) {
                    Noty.success("Registration successful, please login.");
                    window.location = "#/login";
                },
                function (error) {
                    Noty.error("Registration unsuccessful, please try again.");
                });
        });
    };

    var attachLogoutHandler = function (selector) {
        var _this = this;
        $(selector).on("click", "#logout-button", function () {
            localStorage.clear();
            Noty.success("Logout successful.");
            window.location = "#/";
        });
    };

    var attachCreateProductHandler = function (selector) {
        var _this = this;
        $(selector).on("click", "#add-product-button", function () {
            var name = $("#name").val();
            var category = $("#category").val();
            var price = parseFloat($("#price").val());
            var userId = _this._data.users.getData().userId;
            _this._data.products.add(name, category, price, userId)
                .then(function (data) {
                    Noty.success("Product creation successful.");
                    window.location = "#/products";
                },
                function (error) {
                    Noty.error("Product creation unsuccessful, please try again.");
                });
        })
    };

    var attachEditProductHandler = function (selector) {
        var _this = this;
        $(selector).on("click", "#edit-product-button", function () {
            var name = $("#name").val();
            var category = $("#category").val();
            var price = parseFloat($("#price").val());
            var objectId = $(this).parent().parent().data("id");
            _this._data.products.edit(objectId, name, category, price)
                .then(function(product) {
                    Noty.success("Product edit successful.");
                    window.location = "#/products";
                },
                function (error) {
                    Noty.error("Product edit unsuccessful, please try again.");
                });
        })
    };

    var attachDeleteProductHandler = function (selector) {
        var _this = this;
        $(selector).on("click", "#delete-product-button", function () {
            var objectId = $(this).parent().parent().data("id");
            _this._data.products.delete(objectId)
                .then(function(product) {
                    Noty.success("Product delete successful.");
                    window.location = "#/products";
                },
                function (error) {
                    Noty.error("Product delete unsuccessful, please try again.");
                });
        })
    };

    var attachSubmitFilterHandler = function (selector) {
        var _this = this;
        $(selector).on("click", "#filter", function () {
            var searchString = $('#search-bar').val();
            var minPrice = parseFloat($('#min-price').val());
            var maxPrice = parseFloat($('#max-price').val());
            var searchCategory = $('#category').val();

            $(".products").children().children()
                .each(function (index) {
                    var currentProduct = $(this).children();
                    var productName = currentProduct.children(".item-name")
                        .text();
                    var productCategory = currentProduct.children(".category")
                        .clone().children().remove().end().text();
                    var productPrice = parseFloat(currentProduct.children(".price")
                        .clone().children().remove().end().text());


                    if ((productName.toLowerCase().indexOf(searchString.toLowerCase()) !== -1) &&
                        productPrice >= minPrice && productPrice <= maxPrice &&
                        (searchCategory == "All" || searchCategory == productCategory)) {

                        $(this).show();
                    } else {

                        $(this).hide();
                    }
                })
        })
    };

    var attachClearFiltersHandler = function (selector) {
        var _this = this;
        $(selector).on("click", "#clear-filters", function () {
            $('#search-bar').val("");
            $('#min-price').val("0");
            $('#max-price').val("10000");
            $('#category').val("All");

            $(".products").children().children()
                .each(function (index) {
                    $(this).show();
                })
        })
    };

    return {
        get: function (data) {
            return new BaseController(data);
        }
    }

}());