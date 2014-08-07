"use strict"

# Directive for displaying the log view
module.exports =
  [
    () ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/navigation-and-themes/general-settings-configurator.html"
        scope:
          steroidsSettings: "="
          assets: "="
        link: (scope, element, attrs) ->

      }
  ]