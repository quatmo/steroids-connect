"use strict"

# API for handling Steroids settings
module.exports =
  [
    "$http"
    ($http) ->
      {

        ###
        EXPOSED SETTINGS API DEFINITION
        ###

        settings: undefined

        # Method loading settings file
        load: () ->
          @settings = $http.get "__appgyver_settings.json" # TODO: Create provider for settings file configurations
          @settings

        # Method for saving settings
        save: () ->
          console.log "Saving Steroids settings..."

      }
  ]