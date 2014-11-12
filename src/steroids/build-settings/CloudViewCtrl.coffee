"use strict"

# Directive for displaying the log view
module.exports =
  [
    "$scope"
    "BuildServerApi"
    ($scope, BuildServerApi) ->

      $scope.viewReady = false # As in, has the initial load of cloud settings been completed?
      $scope.isDeploying = false # Whether app is currently being deployed
      $scope.hasCloudJson = false
      $scope.deployError = undefined

      $scope.getCloudJson = ->
        $scope.waiting = "Fetching your App ID from Steroids CLI..."
        BuildServerApi.getCloudConfig().then(
          (res) ->
            $scope.cloudId = res.data.id
            $scope.cloudHash = res.data.identification_hash
            $scope.hasCloudJson = true
          (error) ->
            $scope.hasCloudJson = false
        ).finally ->
          $scope.waiting = null
          $scope.viewReady = true

      # View ready is controlled by getting the cloud data
      $scope.getCloudJson()

      $scope.deploy = ->
        return if $scope.isDeploying
        $scope.isDeploying = true
        BuildServerApi.deploy().then(
          (res) ->
            $scope.getCloudJson()
            $scope.deployError = undefined
          (error) ->
            $scope.deployError = "Could not deploy your project to the cloud. #{error.data.error}"
        ).finally ->
          $scope.isDeploying = false

  ]
