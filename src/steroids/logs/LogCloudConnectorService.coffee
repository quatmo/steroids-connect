"use strict"

# API for handling log manipulation and caching
module.exports =
  [
    "$timeout"
    "$http"
    "LogsAPI"
    ($timeout, $http, LogsAPI) ->

      # Url to be used when connecting to endpoint
      endpoint = undefined

      # Cache for connection to the endpoint
      connection = undefined

      requestLogs = () ->
        connection = $timeout () ->
          $http.get(endpoint).success (data) ->
            LogsAPI.add data.slice(0, Math.floor((Math.random() * (data.length+1))))
            requestLogs()
        , ((Math.random() * 5000) + 500)

      @setEndpoint = (endpointUrl) ->
        endpoint = endpointUrl

      @connect = () ->
        # Don't connect with unset endpoint
        throw new Error("Endpoint is not set for LogConnector.") unless endpoint
        # Initiate connection
        # TODO: Replace with actual socket connection
        requestLogs()

      #@stop = () ->
      #  # Check if there is an actual connection to stop
      #  return unless connection
      #  # Stop connection
      #  $interval.cancel connection
      #  connection = undefined

      @

  ]