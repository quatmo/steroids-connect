"use strict"

# API for handling log manipulation and caching
module.exports =
  [
    "$interval"
    "$http"
    "LogsAPI"
    ($interval, $http, LogsAPI) ->

      # Url to be used when connecting to endpoint
      endpoint = undefined

      # Cache for connection to the endpoint
      connection = undefined

      lastRequestTime = undefined

      requestLogs = () ->
        $http.get("#{endpoint}?from=#{lastRequestTime}").success (data) ->
          LogsAPI.add data
          lastRequestTime = new Date().toISOString()

      @setEndpoint = (endpointUrl) ->
        endpoint = endpointUrl

      @connect = () ->
        # Don't connect with unset endpoint
        throw new Error("Endpoint is not set for LogConnector.") unless endpoint
        # Initiate connection
        # TODO: Replace with actual socket connection
        connection = $interval requestLogs, 1000


      # @stop = () ->
      #  # Check if there is an actual connection to stop
      #  return unless connection
      #  # Stop connection
      #  $interval.cancel connection
      #  connection = undefined

      @

  ]
