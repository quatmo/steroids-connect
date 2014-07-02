"use strict"

# Directive for displaying the log view
module.exports =
  [
    "LogsAPI"
    "LogsFilterAPI"
    (LogsAPI, LogsFilterAPI) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/logs/log-view.html"
        link: (scope, element, attrs) ->

          scope.logsApi = LogsAPI
          scope.LogsFilterAPI = LogsFilterAPI

      }
  ]