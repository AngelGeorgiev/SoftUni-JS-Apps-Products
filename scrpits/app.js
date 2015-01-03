var app = app || {};

(function () {
    var baseUrl = 'https://api.parse.com/1/';
    var ajaxRequester = app.ajaxRequester.get();
    var data = app.data.get(baseUrl, ajaxRequester);
    var controller = app.controller.get(data);
    controller.attachEventHandlers();

    app.router = Sammy(function () {
        var selector = "#main";
        var menuSelector = "#menu";

        this.get('#/', function () {
            controller.loadWelcomeMenu(menuSelector);
            controller.loadWelcome(selector);

        });

        this.get('#/login', function () {
            controller.loadWelcomeMenu(menuSelector);
            controller.loadLogin(selector);

        });

        this.get('#/register', function () {
            controller.loadWelcomeMenu(menuSelector);
            controller.loadRegister(selector);

        });

        this.get('#/home', function () {
            controller.loadUserMenu(menuSelector);
            controller.loadHome(selector);

        });

        this.get('#/products', function () {
            controller.loadUserMenu(menuSelector);
            controller.loadProducts(selector);

        });

        this.get('#/add-product', function () {
            controller.loadUserMenu(menuSelector);
            controller.loadAddProduct(selector);

        });

        this.get('#/delete-product/:id', function () {
            controller.loadUserMenu(menuSelector);
            controller.loadDeleteProduct(selector, this.params['id']);

        });

        this.get('#/edit-product/:id', function () {
            controller.loadUserMenu(menuSelector);
            controller.loadEditProduct(selector, this.params['id']);

        });

    });

    app.router.run('#/');
}());