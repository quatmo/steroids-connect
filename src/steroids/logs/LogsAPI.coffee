"use strict"

# API for handling log manipulation and caching
module.exports =
  [
    () ->
      {

        ###
        EXPOSED LOGS API DEFINITION
        ###

        # Logs cache
        #   * message - Text/object representation of the message
        #   * timestamp - UNIX timestamp for the logged event (in milliseconds! This is IMPORTANT for log accuracy)
        #   * type - type of the message for filtering and highlighting [error, log]
        #   * deviceName - Name of the device that originated the log entry
        #   * view - Name of the view that originated this log entry ($native for native layer logs)
        logs: [
          {
            message: "Error msg"
            timestamp: 1404217782263
            type: "error"
            deviceName: "Tomi's iPhone"
            view: "index.html"
          }
          {
            message: "Log msg"
            timestamp: 1304217782283
            type: "log"
            deviceName: "Tomi's iPhone"
            view: "$native"
          }
          {
            message: "Log msg"
            timestamp: 1304217782282
            type: "log"
            deviceName: "Bogs' iPhone"
            view: "index.html"
          }
        ]

        # Method for adding new log msg to cache
        add: (newLogMsg) ->
          @logs.push newLogMsg if newLogMsg?

        # Method for clearing the whole log cache
        clear: () ->
          @logs = []

      }
  ]