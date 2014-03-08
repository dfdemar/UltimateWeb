'use strict'

angular.module('newBetaApp')
  .directive 'feedback', ['$cookies', ($cookies) ->
    templateUrl: 'includes/partials/feedback.html'
    restrict: 'E'
    link: (scope, element, attrs) ->
      scope.firstTime = false
      scope.submitted = false
      checkOverSubmitted = ->
        if parseInt($cookies.iUltimateFeedbacked) > 15 then scope.tooMuchSubmitted = true
      checkOverSubmitted()
      # this with the jquery was done to combat the way ng-animate works.
      setTimeout ->
        scope.closeModal = ->
          scope.firstTime = false
      , 1000

      scope.closeModal = ->
        scope.firstTime = false
        # sometimes we have to break the angular rules.
        try # to avoid the whiny error message angular produces.
          $('.first-time-modal').remove()

      setTimeout ->
        scope.closeEmail = ->
          scope.emailOpen = false
      , 1000

      scope.closeEmail = ->
        scope.emailOpen = false
        # sometimes we have to break the angular rules.
        try # to avoid the whiny error message angular produces.
          $('.email-modal').remove()

      scope.submitEmail = (email, subject, message)->
        if scope.isValid email, message
          #send email.
          scope.closeEmail()
          $cookies.iUltimateFeedbacked = if $cookies.iUltimateFeedbacked then String parseInt($cookies.iUltimateFeedbacked) + 1 else '1'
          checkOverSubmitted()
        else submitted = true

      scope.isValid = (email, message)->
        (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email) && (unless message is undefined then message.length > 10 else true)

      unless $cookies.iUltimateVisited
        scope.firstTime = true
      $cookies.iUltimateVisited = String new Date().getTime()

  ]