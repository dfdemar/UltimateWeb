'use strict'

angular.module('newBetaApp')
  .directive 'droppable', () ->
    restrict: 'A'
    scope:
      onDrop: '='
    link: (scope, element, attrs)->
      element.on 'dragenter', ->
        console.log 'dragenter'
      element.on 'dragover', ->
        console.log 'dragover'
      element.on 'dragleave', ->
        console.log 'dragleave'
      element.on 'drop', ->
        console.log 'drop'

