'use strict';

angular.module('beta2App', [
  'ngRoute'
])
  .config(['$routeProvider' , function ($routeProvider) {
    $routeProvider
      .when('/', {templateUrl: 'views/splash.html', controller: 'SplashCtrl'})
      .when('/login/:teamId', {templateUrl: 'views/login.html', controller: 'LoginCtrl'})
      .when('/players/:teamId', {templateUrl: 'views/players.html', controller: 'PlayersCtrl'})
      .when('/team/:teamId', {templateUrl: 'views/team.html', controller: 'TeamCtrl'})
      .when('/download/:teamId', {templateUrl: 'views/download.html', controller: 'DownloadCtrl'})
      .when('/line/:teamId', {templateUrl: 'views/line.html', controller: 'LineCtrl'})
      .when('/games/:teamId', {templateUrl: 'views/games.html', controller: 'GamesCtrl'})
      .when('/player/:teamId/:playerId', {templateUrl: 'views/player.html', controller: 'PlayerCtrl'})
      .when('/404', {templateUrl: 'views/404.html', controller: '404Ctrl'})
      .otherwise({redirectTo: '/404'});
  }]);
