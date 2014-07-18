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

          scope.statusBarStyles = [
            "Dark"
            "Light"
          ]

          scope.isEnabled = () ->
            if scope.steroidsSettings.configuration?.status_bar_enabled then true else false

          scope.enable = () ->
            if scope.isEnabled() then return
            if !scope.steroidsSettings.configuration
              scope.steroidsSettings.configuration =
                status_bar_enabled: true
                status_bar_style: "Light"
            else
              scope.steroidsSettings.configuration?.status_bar_enabled = true

          scope.disable = () ->
            if !scope.isEnabled() then return
            if !scope.steroidsSettings.configuration
              scope.steroidsSettings.configuration =
                status_bar_enabled: false
                status_bar_style: "Light"
            else
              scope.steroidsSettings.configuration?.status_bar_enabled = false

          ###
          "configuration": {
            "status_bar_style": "Light",
            "status_bar_enabled": true
          }
          ###

      }
  ]