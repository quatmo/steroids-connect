"use strict"

# Directive for displaying the preview & connections view
module.exports =
  [
    () ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/preview/preview-view.html"
        link: (scope, element, attrs) ->

          scope.qrCode = "vittu"

      }
  ]