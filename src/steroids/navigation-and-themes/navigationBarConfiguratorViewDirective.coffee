"use strict"

# Directive for displaying the log view
module.exports =
  [
    () ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/navigation-and-themes/navigation-bar-configurator.html"
        scope:
          steroidsSettings: "="
        link: (scope, element, attrs) ->

      }
  ]