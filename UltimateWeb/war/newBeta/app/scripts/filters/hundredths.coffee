'use strict'

angular.module('newBetaApp')
  .filter 'hundredths', () ->
    (input) ->
      if _(input).isNaN()
        '*'
      else if _(input).isNumber()
        input.toFixed(2).replace /(\.00$)|(0*$)/, ''
      else 'NA'
