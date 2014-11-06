"use strict"

# Service for fetching cloud settings
module.exports = [
  "$http"
  ($http) ->

    _apiBase = "http://localhost:4567/__appgyver"

    @getCloudConfig = ->
      $http.get "#{_apiBase}/cloud_config"

    @getAccessToken = ->
      $http.get "#{_apiBase}/access_token"

    @deploy = ->
      $http.get "#{_apiBase}/deploy"

    @launchSimulator = ->
      $http.get "#{_apiBase}/launch_simulator"

    # Return this
    @

]
