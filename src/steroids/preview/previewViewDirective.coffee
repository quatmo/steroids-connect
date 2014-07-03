"use strict"

# Directive for displaying the preview & connections view
module.exports =
  [
    "$location"
    ($location) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/preview/preview-view.html"
        link: (scope, element, attrs) ->

          parseQueryParams = () ->
            params = /(?:[^\?]*\?)([^#]*)(?:#.*)?/g.exec $location.absUrl()
            if !params? then return {}
            params = params[1].split "&"
            paramObj = {}
            for param in params
              param = param.split "="
              paramObj[param[0]] = param[1]
            paramObj


          scope.qrCode = parseQueryParams()["qrcode"]


          console.log parseQueryParams()

      }
  ]