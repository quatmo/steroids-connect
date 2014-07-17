"use strict"

# Directive for displaying the log view
module.exports =
  [
    () ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/navigation-and-themes/status-bar-configurator.html"
        scope:
          steroidsSettings: "="
        link: (scope, element, attrs) ->

      }
  ]