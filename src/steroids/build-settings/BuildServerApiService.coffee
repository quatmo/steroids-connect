"use strict"

# Service for fetching cloud settings
module.exports = [
  "$http"
  ($http) ->

    # General

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

    # Emulators / Simulators

    @launchSimulator = ->
      $http.get "#{_apiBase}/emulators/simulator/start"

    @launchEmulator = ->
      $http.get "#{_apiBase}/emulators/android/start"

    @launchGenymotion = ->
      $http.get "#{_apiBase}/emulators/genymotion/start"

    # Data & scaffolds

    @getDataConfig = ->
      $http.get "#{_apiBase}/data/config"

    @initData = ->
      $http.post "#{_apiBase}/data/init"

    @syncData = ->
      $http.post "#{_apiBase}/data/sync"

    @generate = (parameters)->
      $http.post "#{_apiBase}/generate", parameters

    # Debugging

    @getViewsToDebug = ->
      $http.get "#{_apiBase}/debug/safari/views"

    @debugView = (viewUrl) ->
      $http.get "#{_apiBase}/debug/safari/view",
        params:
          "url": viewUrl

    # Return this
    @

]
