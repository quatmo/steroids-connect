"use strict"

# Directive for displaying the log view
module.exports =
  [
    "$http"
    "BuildServerApi"
    ($http, BuildServerApi) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/build-settings/build-settings-view.html"
        link: (scope, element, attrs) ->

          scope.viewReady = false # As in, has the initial load of cloud settings been completed?
          scope.isDeploying = false # Whether app is currently being deployed
          scope.hasCloudJson = false

          scope.getCloudJson = ->
            scope.waiting = "Fetching your App ID from Steroids CLI..."
            BuildServerApi.getCloudConfig().then(
              (res) ->
                scope.cloudId = res.data.id
                scope.cloudHash = res.data.identification_hash
                scope.hasCloudJson = true
              (error) ->
                scope.hasCloudJson = false
            ).finally ->
              scope.waiting = null
              scope.viewReady = true

          # View ready is controlled by getting the cloud data
          scope.getCloudJson()

          scope.deploy = ->
            return if scope.isDeploying
            scope.isDeploying = true
            BuildServerApi.deploy().then(
              (res) ->
                scope.getCloudJson()
              (error) ->
                scope.flashMsg =
                  "Could not deploy your project to the cloud. #{error.data.error}"
            ).finally ->
              scope.isDeploying = false

      }
  ]
