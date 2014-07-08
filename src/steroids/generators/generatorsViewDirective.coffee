"use strict"

# Directive for displaying the log view
module.exports =
  [
    "GeneratorsAPI"
    (GeneratorsAPI) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/generators/generators-view.html"
        link: (scope, element, attrs) ->

          scope.GeneratorsAPI = GeneratorsAPI

      }
  ]