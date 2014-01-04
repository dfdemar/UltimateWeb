'use strict';

angular.module('beta2App')
  .factory('viewer', function () {
    return {
      isMobile: function () {
        return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      }
    };
  });
