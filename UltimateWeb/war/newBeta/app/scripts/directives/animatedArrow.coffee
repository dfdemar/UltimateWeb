'use strict'

angular.module('newBetaApp')
  .directive 'animatedArrow', () ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      parentLength = $(element.parent()).width()
      num = 0
      go = ->
        $(element).css 'left', (num++ % 2 * 42 + 5) + '%'
        $(element).animate 
          left: '+=' + parentLength * 0.42
        , 3000, go
      go()



      
      