let app = angular.module('myApp', ['ui.router', 'cp.ngConfirm', 'ngMask']);

app.constant('config', {
    name: 'UMFG',
    version: 'v1.0.0',
    apiUrl: 'http://localhost:3000/api/',
    baseUrl: 'http://localhost/sbadmin/',
    enableDebug: true
})



app.config([
    '$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: './pages/home.html',
                
            })
            .state('product', {
                url: '/product',
                templateUrl: './pages/product/grid.html',
                controller: 'ProductController'
            })
            .state('consumer', {
                url: '/consumer',
                templateUrl: './pages/consumer/grid.html',
                controller: 'ConsumerController'
            })
            .state('user', {
                url: '/user',
                templateUrl: './pages/user/grid.html',
                controller: 'UserController'
            })
            .state('about', {
                url: '/about',
                template: '<h3>About</h3>'
            })
            .state('venda', {
                url: '/venda',
                templateUrl: './pages/venda/grid.html',
                controller: 'VendaController'
            })
            .state('mostSoldProducts', {
                url: '/mostSoldProducts',
                templateUrl: './pages/mostSoldProducts/grid.html',
                controller: 'mostSoldProductsController'
            })
            .state('topSellers', {
                url: '/topSellers',
                templateUrl: './pages/topSellers/grid.html',
                controller: 'topSellersController'
            })
            .state('topConsumers', {
                url: '/topConsumers',
                templateUrl: './pages/topConsumers/grid.html',
                controller: 'topConsumersController'
            })
            .state('category', {
                url: '/category',
                templateUrl: './pages/category/grid.html',
                controller: 'categoryController'
            })      
}])