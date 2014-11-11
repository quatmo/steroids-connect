"use strict"

# Service for fetching cloud settings
module.exports = [
  "$http"
  ($http) ->

    _apiBase = "http://localhost:4567/__appgyver"

    @ping = ->
      $http.get "#{_apiBase}/ping"

    @getCloudConfig = ->
      $http.get "#{_apiBase}/cloud_config"

    @getAppConfig = ->
      $http.get "#{_apiBase}/app_config"

    @getAccessToken = ->
      $http.get "#{_apiBase}/access_token"

    @deploy = ->
      $http.get "#{_apiBase}/deploy"

    @launchSimulator = ->
      $http.get "#{_apiBase}/launch_simulator"

    @launchEmulator = ->
      $http.get "#{_apiBase}/launch_emulator"

    @getDataConfig = ->
      $http.get "#{_apiBase}/data/config"

    @initData = ->
      $http.post "#{_apiBase}/data/init"

    @syncData = ->
      $http.post "#{_apiBase}/data/sync"

    @generate = (parameters)->
      $http.post "#{_apiBase}/generate", parameters

    # Return this
    @

]
