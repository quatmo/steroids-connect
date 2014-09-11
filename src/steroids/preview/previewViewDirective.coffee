"use strict"

# Directive for displaying the preview & connections view
module.exports =
  [
    "$location"
    "$http"
    "DevicesAPI"
    ($location, $http, DevicesAPI) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/preview/preview-view.html"
        link: (scope, element, attrs) ->

          scope.DevicesAPI = DevicesAPI

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

          scope.qrCode = decodedQrCode

          scope.launchSimulator = ->
            $http.get("http://localhost:4567/__appgyver/launch_simulator")
      }
  ]
