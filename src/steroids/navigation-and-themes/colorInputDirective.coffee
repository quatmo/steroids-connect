"use strict"

# Directive for displaying the log view
module.exports =
  [
    () ->
      {
        restrict: "E"
        replace: true
        templateUrl: "/steroids-connect/navigation-and-themes/color-input.html"
        scope:
          color: "="
        link: (scope, element, attrs) ->

      }
  ]