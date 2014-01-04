'use strict';

angular.module('beta2App', [
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/players', {
        templateUrl: 'views/players.html',
        controller: 'PlayersCtrl'
      })
      .when('/team', {
        templateUrl: 'views/team.html',
        controller: 'TeamCtrl'
      })
      .when('/player', {
        templateUrl: 'views/player.html',
        controller: 'PlayerCtrl'
      })
      .when('/download', {
        templateUrl: 'views/download.html',
        controller: 'DownloadCtrl'
      })
      .when('/', {
        templateUrl: 'views/splash.html',
        controller: 'SplashCtrl'
      })
      .otherwise({
        redirectTo: '/404.html'
      });
  });
