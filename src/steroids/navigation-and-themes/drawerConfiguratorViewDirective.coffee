"use strict"

# Directive for displaying the log view
module.exports =
  [
    () ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/navigation-and-themes/drawer-configurator.html"
        scope:
          position: "@drawerPosition"
          steroidsSettings: "="
        link: (scope, element, attrs) ->

      }
  ]