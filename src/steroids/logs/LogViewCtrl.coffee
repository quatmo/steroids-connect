"use strict"

module.exports =
  [
    "$scope"
    "LogsAPI"
    "LogsFilterAPI"
    ($scope, LogsAPI, LogsFilterAPI) ->

      $scope.LogsAPI = LogsAPI
      $scope.LogsFilterAPI = LogsFilterAPI

  ]
