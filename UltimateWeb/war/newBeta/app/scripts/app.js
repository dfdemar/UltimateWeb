'use strict';

angular.module('newBetaApp', [
  'ngRoute'
])
  .config(['$routeProvider' , function ($routeProvider) {
    $routeProvider
      .when('/', {templateUrl: 'views/splash.html', controller: 'SplashCtrl'})
      .when('/:teamId/login', {templateUrl: 'views/login.html', controller: 'LoginCtrl'})
      .when('/:teamId/players', {templateUrl: 'views/players.html', controller: 'PlayersCtrl'})
      .when('/:teamId/team', {templateUrl: 'views/team.html', controller: 'TeamCtrl'})
      .when('/:teamId/download', {templateUrl: 'views/download.html', controller: 'DownloadCtrl'})
      .when('/:teamId/line', {templateUrl: 'views/line.html', controller: 'LineCtrl'})
      .when('/:teamId/games', {templateUrl: 'views/games.html', controller: 'GamesCtrl'})
      .when('/:teamId/player/:playerNameUri', {templateUrl: 'views/player.html', controller: 'PlayerCtrl'})
      .when('/404', {templateUrl: 'views/404.html', controller: '404Ctrl'})
      .otherwise({redirectTo: '/404'});
  }]);
