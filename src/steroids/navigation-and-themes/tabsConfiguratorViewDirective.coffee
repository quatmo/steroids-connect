"use strict"

# Directive for displaying the log view
module.exports =
  [
    "$timeout"
    ($timeout) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/navigation-and-themes/tabs-configurator.html"
        scope:
          steroidsSettings: "="
        link: (scope, element, attrs) ->

          # Check whether the feature is enabled or not
          scope.isEnabled = () ->
            if scope.steroidsSettings.tabBar.enabled then true else false

          scope.enable = () ->
            if scope.isEnabled() then return
            scope.steroidsSettings.tabBar.enabled = true

          scope.disable = () ->
            if !scope.isEnabled() then return
            scope.steroidsSettings.tabBar.enabled = false

      }
  ]