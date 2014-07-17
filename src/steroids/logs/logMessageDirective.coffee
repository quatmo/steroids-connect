"use strict"

# Directive for displaying the log view
module.exports =
  [
    "LogsFilterAPI"
    (LogsFilterAPI) ->
      {
        restrict: "A"
        replace: true
        scope:
          logMessage: "=logMessage"
        templateUrl: "/steroids-connect/logs/log-message.html"
        link: (scope, element, attrs) ->

          # Expose LogsFilterAPI
          scope.LogsFilterAPI = LogsFilterAPI

          # Show/hide additional details
          scope.isOpen = false
          scope.toggleAdditionalDetails = () ->
            scope.isOpen = !scope.isOpen

          # Check if additional details are available
          scope.hasAdditionalDetails = () ->
            if scope.logMessage.blob and scope.logMessage.blob.length > 0 then true else false

      }
  ]