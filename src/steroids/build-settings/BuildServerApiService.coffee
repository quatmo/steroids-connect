"use strict"

# Service for fetching cloud settings
module.exports =
  [
    "$http"
    ($http) ->

      _apiBase = "http://localhost:4567"

      @getCloudConfig = ->
        $http
          .get "#{_apiBase}/__appgyver/cloud_config"

      @getAccessToken = ->
        $http
          .get "#{_apiBase}/__appgyver/access_token"

      @deploy = ->
        $http
          .get "#{_apiBase}/__appgyver/deploy"

      @launchSimulator = ->
        $http
          .get "#{_apiBase}/__appgyver/launch_simulator"

      # Return this
      @

  ]
