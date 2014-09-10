"use strict"

# Directive for displaying the data view
module.exports =
  [
    "$http"
    ($http) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/data/data-view.html"
        link: (scope, element, attrs) ->
          # scope.waiting = "Fetching your App ID from Steroids CLI..."
          # scope.noCloudJson = false
          #
          # $http.get("http://localhost:4567/__appgyver/cloud_config").then(
          #   (res) ->
          #     scope.cloudId = res.data.id
          #     scope.cloudHash = res.data.identification_hash
          #   (error) ->
          #     scope.noCloudJson = true
          #
          # ).finally ->
          #   scope.waiting = null
          #
          # scope.initData = ->
          #   scope.waiting = "Deploying your app to AppGyver Cloud..."
          #   $http.get("http://localhost:4567/__appgyver/deploy").then(
          #     (res) ->
          #       scope.waiting = null
          #       scope.noCloudJson = false
          #       scope.flashMsg = "All done!"
          #     (error) ->
          #       scope.flashMsg =
          #         "Could not deploy your project to the cloud. #{error.data.error}"
          #
          #   ).finally ->
          #     scope.waiting = null

      }
  ]
