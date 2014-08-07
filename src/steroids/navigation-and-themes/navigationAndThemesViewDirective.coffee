"use strict"

# Directive for displaying the log view
module.exports =
  [
    "SteroidsSettingsAPI"
    "$timeout"
    "$interval"
    (SteroidsSettingsAPI, $timeout, $interval) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/navigation-and-themes/navigation-and-themes-view.html"
        link: (scope, element, attrs) ->

          ###
          SETTINGS
          ###

          scope.savingSettings = false
          scope.unsavedChanges = false
          scope.loadingSettings = true
          scope.steroidsSettings = undefined
          scope.appAssets = undefined

          scope.loadSettings = () ->
            scope.loadingSettings = true
            SteroidsSettingsAPI.load()
              .success (data) ->
                scope.steroidsSettings = data
              .finally () ->
                scope.loadingSettings = false
          scope.loadSettings()

          scope.save = () ->
            if not scope.unsavedChanges then return
            scope.savingSettings = true
            $timeout () ->
              scope.savingSettings = false
              scope.unsavedChanges = false
            , 1000

          # Watch for changes in settings.
          # On changes, set "unsaved changes" notification on.
          scope.$watch "steroidsSettings", (newVal, oldVal) ->
            scope.unsavedChanges = true unless oldVal is undefined
          , true

          # Load assets
          scope.loadAssets = () ->
            SteroidsSettingsAPI.loadAssets()
              .success (data) ->
                scope.appAssets = data
          scope.loadAssets()

      }
  ]