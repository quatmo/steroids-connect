"use strict"

# Directive for displaying the log view
module.exports =
  [
    "$http"
    ($http) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/build-settings/build-settings-view.html"
        link: (scope, element, attrs) ->
          scope.noCloudJson = false

          scope.getCloudJson = ->
            scope.waiting = "Fetching your App ID from Steroids CLI..."
            $http.get("http://localhost:4567/__appgyver/cloud_config").then(
              (res) ->
                scope.cloudId = res.data.id
                scope.cloudHash = res.data.identification_hash
              (error) ->
                scope.noCloudJson = true
            ).finally ->
              scope.waiting = null

          scope.getCloudJson()

          scope.deploy = ->
            scope.waiting = "Deploying your app to AppGyver Cloud..."
            $http.get("http://localhost:4567/__appgyver/deploy").then(
              (res) ->
                scope.getCloudJson()
              (error) ->
                scope.flashMsg =
                  "Could not deploy your project to the cloud. #{error.data.error}"
            ).finally ->
              scope.waiting = null

      }
  ]
