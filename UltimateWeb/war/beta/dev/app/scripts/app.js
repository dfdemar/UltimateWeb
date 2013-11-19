'use strict';

angular.module('iUtltimateApp', ['ui.bootstrap'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/404', {templateUrl: 'views/404.html'})
      .when('/', {templateUrl: 'views/main.html', controller: 'MainpageCtrl', reloadOnSearch: false})
      .when('/:teamId', {templateUrl: 'views/main.html', controller: 'MainpageCtrl', reloadOnSearch: false})
      .when('/:teamId/:pageName', {templateUrl: 'views/main.html', controller: 'MainpageCtrl', reloadOnSearch: false})
      .otherwise({
        redirectTo: '/'
      });
  });
