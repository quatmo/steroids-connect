"use strict"

# Directive for displaying the data view
module.exports = [
  "$scope"
  "$state"
  "$q"
  "$timeout"
  "BuildServerApi"
  ($scope, $state, $q, $timeout, BuildServerApi) ->

    $scope.$state = $state

    ###
    Internal helpers
    ###

    _deploy = ->
      BuildServerApi.deploy().then (res) ->
        $scope.cloudId = res.data.id
        $scope.cloudHash = res.data.identification_hash
        $scope.appDeployed = true
      , (err) ->
        $scope.error = "Could not deploy your project to the cloud. #{err.data.error}"

    _initializeData = ->
      BuildServerApi.initData()
        .then ->
          return
      , (err)->
        $scope.error = "Could not initialize data to your project. #{err.data.error}"

    _getCloudConfig = ->
      BuildServerApi.getCloudConfig().then (res)->
        $scope.cloudId = res.data.id
        $scope.cloudHash = res.data.identification_hash
        $scope.appDeployed = true

    _getDataConfig = ->
      BuildServerApi.getDataConfig().then (res)->
        $scope.dataReady = res.data.initialized

    ###
    View initial state
    ###

    $scope.viewReady = false
    $scope.appDeployed = false
    $scope.dataReady = false
    $scope.dataEnabled = false
    $scope.error = undefined
    $scope.isInitializing = false
    $scope.currentTab = "configure"

    ###
    View initialization
    ###

    _checkReadyState = () ->

      # Collection of promises to finish before view can be called ready
      _finishBeforeViewReady = []

      # Check if app is deployed
      _finishBeforeViewReady.push _getCloudConfig()

      # Get access token for user
      _finishBeforeViewReady.push BuildServerApi.getAccessToken().then (res)->
        $scope.accessToken = res.data # acually is the token

      _finishBeforeViewReady.push _getDataConfig()

      # After all are resolved, set view ready
      $q.all(_finishBeforeViewReady).finally () ->
        $timeout () ->
          $scope.viewReady = true
          $state.go "data.configure" if $state.is "data"
        , 100

    _checkReadyState()

    ###
    View actions
    ###

    $scope.setCurrentTab = (newTab)->
      $scope.currentTab = newTab

    $scope.initializeData = ->
      # check that deploy isn't running
      return if $scope.isInitializing

      $scope.isInitializing = true
      $scope.error = undefined

      promise = unless $scope.appDeployed
        _deploy()
          .then _initializeData
      else
        _initializeData()

      promise.then _checkReadyState

      promise.finally ->
        $scope.isInitializing = false

]
