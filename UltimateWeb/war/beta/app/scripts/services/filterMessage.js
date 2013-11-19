'use strict';

angular.module('iUtltimateApp')
  .service('Filtermessage', function Filtermessage() {
    var message = {};
    message.message = 'All Games';
    message.set = function(value){
      this.message = value;
    }
    return message;
  });
