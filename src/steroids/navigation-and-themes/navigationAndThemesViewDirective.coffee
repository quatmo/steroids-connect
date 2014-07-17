"use strict"

# Directive for displaying the log view
module.exports =
  [
    () ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/navigation-and-themes/navigation-and-themes-view.html"
        link: (scope, element, attrs) ->

          #scope.LogsAPI = LogsAPI
          #scope.LogsFilterAPI = LogsFilterAPI

      }
  ]