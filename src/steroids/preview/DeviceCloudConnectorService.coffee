"use strict"

# API for handling log manipulation and caching
module.exports =
  [
    "$interval"
    "$http"
    "DevicesAPI"
    ($interval, $http, DevicesAPI) ->
      # Cache for connection to the endpoint
      connection = undefined

      requestClients = () ->
        $http.get("http://localhost:4567/__appgyver/clients").success (data) ->
          devices = if Object.keys(data.clients).length is 0
            null
          else
            data.clients

          DevicesAPI.setDevices(devices)

      @connect = () ->
        # Initiate connection
        # TODO: Replace with actual socket connection
        connection = $interval requestClients, 1000

      @

  ]
