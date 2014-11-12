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
        devices: {}

      }
  ]
