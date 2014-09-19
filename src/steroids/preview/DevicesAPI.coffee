"use strict"

# API for handling devices and their states
module.exports =
  [
    () ->
      {

        ###
        EXPOSED DEVICES API DEFINITION
        ###

        setDevices: (devices) ->
          @devices = devices

        # Devices cache
        devices: [
          {
            name: "Tomi's iPhone"
            type: "iphone"
            connected: true
            error: null
            lastSeen: 1404217782263
          }
          {
            name: "Simulator"
            type: "simulator"
            connected: false
            error: null
            lastAppLoad: 0
          }
        ]

      }
  ]
