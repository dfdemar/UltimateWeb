'use strict';

angular.module('newBetaApp', [
  'ngRoute',
  'ngAnimate'
])
  .config(['$routeProvider',
    function($routeProvider) {
      function checkAuth($location, Authorization, next) {
        next.set($location.path());
        return Authorization.ping($location.url().match(/^\/\d+/)[0].slice(1));
      }
      $routeProvider
        .when('/', {templateUrl: 'views/splash.html', controller: 'SplashCtrl'})
        .when('/:teamId/login', {templateUrl: 'views/login.html', controller: 'LoginCtrl'})
        .when('/:teamId/players', {templateUrl: 'views/players.html', controller: 'PlayersCtrl', resolve: {
          authorized: checkAuth }})
        .when('/:teamId/team', {templateUrl: 'views/team.html', controller: 'TeamCtrl', resolve: {
          authorized: checkAuth }})
        .when('/:teamId/download', {templateUrl: 'views/download.html', controller: 'DownloadCtrl', resolve: {
          authorized: checkAuth }})
        .when('/:teamId/line', {templateUrl: 'views/line.html', controller: 'LineCtrl', resolve: {
          authorized: checkAuth }})
        .when('/:teamId/games', {templateUrl: 'views/games.html', controller: 'GamesCtrl', resolve: {
          authorized: checkAuth }})
        .when('/:teamId/player/:playerNameUri', {templateUrl: 'views/player.html', controller: 'PlayerCtrl', resolve: {
          authorized: checkAuth }})
        .when('/404', {templateUrl: 'views/404.html', controller: '404Ctrl'})
        .otherwise({redirectTo: '/404'});
    }
  ]);