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
          SIMULATOR
          ###

          $scope.simulatorIsLaunching = false
          _simulatorTimeout = undefined

          $scope.launchSimulator = ->
            # Only one at time
            return if $scope.simulatorIsLaunching
            $scope.simulatorIsLaunching = true
            BuildServerApi.launchSimulator().finally () ->
            $timeout () ->
              $scope.simulatorIsLaunching = false
            , 2000

      }
  ]
