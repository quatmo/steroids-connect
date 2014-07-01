"use strict"

# Directive for displaying the log view
module.exports =
  [
    "LogsAPI"
    "LogsFilterAPI"
    (LogsAPI, LogsFilterAPI) ->
      {
        restrict: "A"
        templateUrl: "/steroids-connect/log-view.html"
        link: (scope, element, attrs) ->

          scope.logsApi = LogsAPI
          scope.LogsFilterAPI = LogsFilterAPI

      }
  ]