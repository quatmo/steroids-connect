"use strict"

# Directive for displaying the log view
module.exports =
  [
    () ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/docs/docs-view.html"
        link: (scope, element, attrs) ->

      }
  ]
