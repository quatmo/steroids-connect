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
        controller: ($scope) ->
          $scope.waiting = "Fetching your App ID from Steroids CLI..."
          $scope.status = false
          $scope.cloudId = false

          $http.get("http://localhost:4567/__appgyver/cloud_config").then(
            (res) ->
              $scope.cloudId = res.data.id
              $scope.cloudHash = res.data.identification_hash
              $http.get("http://localhost:4567/__appgyver/data/sandboxdb_yaml").then(
                (res) ->
                  $scope.status = "dataInitialized"
                (error) ->
                  $scope.status = "noDataConnection"
              )
            (error) ->
              $scope.status = "notDeployed"
          ).finally ->
            $scope.waiting = false

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
