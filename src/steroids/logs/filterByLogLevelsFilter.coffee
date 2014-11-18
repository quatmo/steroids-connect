"use strict"

module.exports =
  [
    "LogsFilterAPI"
    (LogsFilterAPI) ->
      (input) ->

        # Return the input array if no filters are set
        return input unless LogsFilterAPI.logLevels

        # Filter out the non-selected log types
        output = []

        angular.forEach input, (row) ->
          @.push row if LogsFilterAPI.logLevels[row.level]
        , output

        output

  ]