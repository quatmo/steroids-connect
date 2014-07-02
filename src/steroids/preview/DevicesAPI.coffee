"use strict"

# API for handling devices and their states
module.exports =
  [
    () ->
      {

        ###
        EXPOSED DEVICES API DEFINITION
        ###

        # Devices cache
        #   * message - Text/object representation of the message
        #   * timestamp - UNIX timestamp for the logged event (in milliseconds! This is IMPORTANT for log accuracy)
        #   * type - type of the message for filtering and highlighting [error, log]
        #   * deviceName - Name of the device that originated the log entry
        devices: [
          {
            name: "Tomi's iPhone"
            type: "iphone"
            connected: true
            error: null
          }
          {
            name: "Bogs' iPhone"
            type: "iphone"
            connected: false
            error:
              code: 1
              message: "Old version of AppGyver Scanner"
          }
          {
            name: "Simulator"
            type: "ios-simulator"
            connected: false
            error: null
          }
        ]

      }
  ]