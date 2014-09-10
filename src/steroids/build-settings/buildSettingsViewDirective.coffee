"use strict"

# Directive for displaying the log view
module.exports =
  [
    "$http"
    ($http) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/build-settings/build-settings-view.html"
        link: (scope, element, attrs) ->
          scope.waitingForCloud = true
          scope.noCloudJson = false

          $http.get("http://localhost:4567/__appgyver/cloud_config").then(
            (res) ->
              scope.cloudId = res.data.id
              scope.cloudHash = res.data.identification_hash
            (error) ->
              console.log JSON.stringify(error)
              scope.noCloudJson = true

          ).finally ->
            scope.waitingForCloud = false

      }
  ]
