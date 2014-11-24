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
        #   * level - log level of the message for filtering and highlighting [error, info]
        #   * deviceName - Name of the device that originated the log entry
        #   * view - Name of the view that originated this log entry ($native for native layer logs)
        logs: []

        # Method for adding new log msg to cache
        add: (newLogMsg) ->
          if $.isArray(newLogMsg)
            @logs = newLogMsg.concat @logs
          else
            @logs.unshift newLogMsg if newLogMsg?
          if @logs.length > 600 then @logs = @logs.slice 0, 500

        # Method for clearing the whole log cache
        clear: () ->
          @logs = []

      }
  ]
