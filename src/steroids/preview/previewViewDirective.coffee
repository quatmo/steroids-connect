"use strict"

# Directive for displaying the preview & connections view
module.exports =
  [
    "$location"
    "$timeout"
    "DevicesAPI"
    "BuildServerApi"
    ($location, $timeout, DevicesAPI, BuildServerApi) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/preview/preview-view.html"
        link: ($scope, element, attrs) ->

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
          EMULATOR
          ###

          $scope.emulatorIsLaunching = false
          _emulatorTimeout = undefined

          $scope.launchEmulator = ->
            # Only one at time
            return if $scope.emulatorIsLaunching
            $scope.emulatorIsLaunching = true
            BuildServerApi.launchEmulator().then(
              (res) ->
                $scope.emulatorLaunchError = undefined
              (error) ->
                $scope.emulatorIsLaunching = false
                $scope.emulatorLaunchError = error.data.error
            ).finally () ->
            $timeout ->
              $scope.emulatorIsLaunching = false
            , 2000


          ###
          SIMULATOR
          ###

          $scope.simulatorIsLaunching = false
          _simulatorTimeout = undefined

          $scope.launchSimulator = ->
            # Only one at time
            return if $scope.simulatorIsLaunching
            $scope.simulatorIsLaunching = true
            BuildServerApi.launchSimulator().then(
              (res) ->
                $scope.simulatorLaunchError = undefined
              (error) ->
                $scope.simulatorIsLaunching = false
                $scope.simulatorLaunchError = error.data.error
            ).finally () ->
            $timeout ->
              $scope.simulatorIsLaunching = false
            , 2000
      }
  ]
