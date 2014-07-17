"use strict"

# Directive for displaying the log view
module.exports =
  [
    () ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/navigation-and-themes/tabs-configurator.html"
        scope:
          steroidsSettings: "="
        link: (scope, element, attrs) ->

      }
  ]