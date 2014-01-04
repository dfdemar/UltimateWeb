'use strict';

angular.module('beta2App', [
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/splash.html',
        controller: 'SplashCtrl'
      })
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
      .when('/404', {
        templateUrl: 'views/404.html',
        controller: '404Ctrl'
      })
      .when('/line', {
        templateUrl: 'views/line.html',
        controller: 'LineCtrl'
      })
      .when('/games', {
        templateUrl: 'views/games.html',
        controller: 'GamesCtrl'
      })
      .otherwise({
        redirectTo: '/404'
      });
  });
