"use strict"

# Service for fetching cloud settings
module.exports =
  [
    "$http"
    ($http) ->

      # Get cloud config from Steroids API
      @getCloudConfig = ->
        $http
          .get "http://localhost:4567/__appgyver/cloud_config"

      # Get cloud config from Steroids API
      @deploy = ->
        $http
          .get "http://localhost:4567/__appgyver/deploy"
          #.then (res) ->
          #  @getCloudConfig

      # Return this
      @

  ]
