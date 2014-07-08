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
        devices: [
          {
            name: "Tomi's iPhone"
            type: "iphone"
            connected: true
            error: null
            lastAppLoad: 1404217782263
          }
          {
            name: "Bogs' iPhone"
            type: "iphone"
            connected: false
            error:
              code: 1
              message: "Old version of AppGyver Scanner"
              url: "See AppStore, faget"
            lastAppLoad: 1404217782263
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