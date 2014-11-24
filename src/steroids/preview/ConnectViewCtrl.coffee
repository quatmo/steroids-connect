"use strict"

# API for handling devices and their states
module.exports =
  [
    "$scope"
    "$location"
    "$timeout"
    "DevicesAPI"
    "BuildServerApi"
    ($scope, $location, $timeout, DevicesAPI, BuildServerApi) ->

      $scope.DevicesAPI = DevicesAPI
      $scope.simulatorLaunchError = undefined
      $scope.emulatorLaunchError = undefined

      parseQueryParams = () ->
        params = /(?:[^\?]*\?)([^#]*)(?:#.*)?/g.exec $location.absUrl()
        if !params? then return {}
        params = params[1].split "&"
        paramObj = {}
        for param in params
          param = param.split "="
          paramObj[param[0]] = param[1]
        paramObj

      qrCode = parseQueryParams()["qrcode"]

      decodedQrCode = decodeURIComponent(qrCode)

      $scope.qrCode = decodedQrCode

      ###
      VIEW DEBUGGING
      ###

      $scope.viewsToDebug = []
      $scope.loadingViewsToDebug = true

      $scope.reloadViewsToDebug = ->
        $scope.loadingViewsToDebug = true
        BuildServerApi.getViewsToDebug().then(
          (list) ->
            $scope.viewsToDebug = list.data
          () ->
            $scope.viewsToDebug = []
        ).finally ->
          $scope.loadingViewsToDebug = false

      $scope.debugViewByUrl = (url) ->
        BuildServerApi.debugView(url)

      ###
      EMULATOR
      ###

      $scope.emulatorStatus =
        isLaunching: false
        state: ""
        stateMessage: ""

      $scope.launchEmulator = ->
        return if $scope.emulatorStatus.isLaunching
        $scope.emulatorStatus.isLaunching = true
        $scope.emulatorStatus.state = "launching"
        $scope.emulatorStatus.stateMessage = "Launching Android emulator..."
        BuildServerApi.launchEmulator().then(
          (res) ->
            $scope.emulatorStatus.state = "success"
            $scope.emulatorStatus.stateMessage = "Android emulator launched!"
            $timeout ->
              $scope.emulatorStatus.isLaunching = false
              $scope.emulatorStatus.state = ""
            , 2000
          (error) ->
            $scope.emulatorStatus.isLaunching = false
            $scope.emulatorStatus.state = "error"
            $scope.emulatorStatus.stateMessage = error.data.error
        )

      # chrome://inspect

      ###
      EMULATOR
      ###

      $scope.genymotionStatus =
        isLaunching: false
        state: ""
        stateMessage: ""

      $scope.launchGenymotion = ->
        return if $scope.genymotionStatus.isLaunching
        $scope.genymotionStatus.isLaunching = true
        $scope.genymotionStatus.state = "launching"
        $scope.genymotionStatus.stateMessage = "Launching Genymotion for Android..."
        BuildServerApi.launchGenymotion().then(
          (res) ->
            $scope.genymotionStatus.state = "success"
            $scope.genymotionStatus.stateMessage = "Genymotion for Android launched!"
            $timeout ->
              $scope.genymotionStatus.isLaunching = false
              $scope.genymotionStatus.state = ""
            , 2000
          (error) ->
            $scope.genymotionStatus.isLaunching = false
            $scope.genymotionStatus.state = "error"
            $scope.genymotionStatus.stateMessage = error.data.error
        )

      ###
      SIMULATOR
      ###

      $scope.simulatorStatus =
        isLaunching: false
        state: ""
        stateMessage: ""

      $scope.launchSimulator = ->
        return if $scope.simulatorStatus.isLaunching
        $scope.simulatorStatus.isLaunching = true
        $scope.simulatorStatus.state = "launching"
        $scope.simulatorStatus.stateMessage = "Launching iOS simulator..."
        BuildServerApi.launchSimulator().then(
          (res) ->
            $scope.simulatorStatus.state = "success"
            $scope.simulatorStatus.stateMessage = "iOS simulator launched!"
            $timeout ->
              $scope.simulatorStatus.isLaunching = false
              $scope.simulatorStatus.state = ""
            , 2000
          (error) ->
            $scope.simulatorStatus.isLaunching = false
            $scope.simulatorStatus.state = "error"
            $scope.simulatorStatus.stateMessage = error.data.error
        )

  ]
