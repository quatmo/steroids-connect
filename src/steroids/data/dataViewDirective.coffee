"use strict"

# Directive for displaying the data view
module.exports =
  [
    "$http"
    "BuildServerApi"
    ($http, BuildServerApi) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/data/data-view.html"
        controller: ($scope) ->
          $scope.viewReady = false # Whether view is ready or not
          $scope.appDeployed = false
          $scope.dataEnabled = false

          # Check if app is deployed
          _gettingCloudJson = BuildServerApi.getCloudConfig().then(
            (res) ->
              $scope.cloudId = res.data.id
              $scope.cloudHash = res.data.identification_hash
              $scope.appDeployed = true
          )

          # Get Sandbox configuration
          _gettingSanboxConfig = BuildServerApi.getSandboxConfig().then(
            (res) ->
              $scope.appDeployed = true
          )

          # Get access token for user
          _gettingAccessToken = BuildServerApi.getAccessToken().then(
            (res) ->
              $scope.accessToken = res.data # acually is the token
          )

          # Tabs
          $scope.dataTab = "configure"
          $scope.setDataTab = (newTab) -> $scope.dataTab = newTab

          $scope.initData = ->
            $scope.waiting = "Initializing your app with Steroids Data..."
            $http.post("http://localhost:4567/__appgyver/data/init").then(
              (res) ->
                $scope.flashMsg = "Steroids Data initialized!"
                $scope.status = "dataInitialized"
              (error) ->
                $scope.flashMsg = "Could not initialize Steroids Data for your project. #{error.data.error}"
            ).finally ->
              $scope.waiting = false

      }
  ]
