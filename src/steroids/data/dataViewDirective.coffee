"use strict"

# Directive for displaying the data view
module.exports = [
  "$http"
  "$q"
  "$timeout"
  "BuildServerApi"
  ($http, $q, $timeout, BuildServerApi) ->
    restrict: "EA"
    replace: true
    templateUrl: "/steroids-connect/data/data-view.html"
    controller: ($scope) ->

      ###
      View state
      ###

      $scope.viewReady = false # Whether view is ready or not
      $scope.appDeployed = false
      $scope.dataEnabled = false
      $scope.error = undefined

      ###
      View initialization
      ###

      # Collection of promises to finish before view can be called ready
      _finishBeforeViewReady = []


      # Check if app is deployed
      _finishBeforeViewReady.push _getCloudConfig()

      # Get access token for user
      _finishBeforeViewReady.push BuildServerApi.getAccessToken().then (res)->
        $scope.accessToken = res.data # acually is the token

      # After all are resolved, set view ready
      $q.all(_finishBeforeViewReady).finally () ->
        $timeout () ->
          $scope.viewReady = true
        , 100

      ###
      View tabs
      ###

      $scope.dataTab = "configure"
      $scope.setDataTab = (newTab) -> $scope.dataTab = newTab

      ###
      View functionalities
      ###

      $scope.isDeploying = false
      $scope.deploy = () ->
        # check that deploy isn't running
        return if $scope.isDeploying
        $scope.isDeploying = true
        $scope.error = undefined
        #
        BuildServerApi.deploy().then(
          () ->
            _getCloudConfig()
          (err) ->
            $scope.error = "Could not deploy your project to the cloud. #{err.data.error}"
        ).finally ->
          $scope.isDeploying = false

      ###
      Internal helpers
      ###
      _getCloudConfig = () ->
        BuildServerApi.getCloudConfig().then (res)->
          $scope.cloudId = res.data.id
          $scope.cloudHash = res.data.identification_hash
          $scope.appDeployed = true

]
