"use strict"

# API for handling and serving log view filters
module.exports =
  [
    "$filter"
    "DevicesAPI"
    "LogsAPI"
    ($filter, DevicesAPI, LogsAPI) ->
      {

        ###
        EXPOSED LOGS FILTER API DEFINITION
        ###

        # Current filters
        # Empty strings = do not filter
        filters:
          #deviceName: "" # Name of the device originating the log entry
          view: ""       # Name of the view originating the log entry

        logLevels:
          "info": true
          "error": true
          "warn": true

        # Method for clearing ALL filters
        clearFilters: () ->
          @filters =
            #deviceName: ""
            view: ""
          @logLevels =
            "info": true
            "error": true
            "warn": true

        # Method for settings the filter on device name
        filterByDeviceName: (deviceName) ->
          if deviceName? then @filters['deviceName'] = deviceName else @filters['deviceName'] = ""

        # Returns a list of available devices to filter on
        availableDeviceNameFilters: (includeAll=true) ->
          # Set the base for the filter
          availableForFiltering = []
          # If option "All" should be included:
          if includeAll is true
            availableForFiltering.push
              label: "All devices"
              filterBy: ""
          # Include available devices
          devicesNow = DevicesAPI.devices
          if devicesNow
            for ip, device of devicesNow
              availableForFiltering.push
                label: if device.simulator then "#{device.device} simulator" else device.device
                filterBy: device.ipAddress
          # Return the composed list of filterable devices
          availableForFiltering

        # Method for settings the filter on view name
        filterByViewName: (viewName) ->
          if viewName? then @filters['view'] = viewName else @filters['view'] = ""

        # Returns a list of available views to filter on
        availableViewNameFilters: (includeAll=true) ->
          # Set the base for the filter
          availableForFiltering = []
          # If option "All" should be included:
          if includeAll is true then availableForFiltering.push
            label: "All views"
            filterBy: ""
          # Include available devices
          for logMsg in $filter("unique")(LogsAPI.logs, "view")
            availableForFiltering.push
              label: $filter("viewUrlToRouteName")(logMsg.view)
              filterBy: logMsg.view
          # Return the composed list of filterable devices
          availableForFiltering

        # Method for settings the filter on message log level
        filterByLogLevel: (level) ->
          if level? then @filters['level'] = level else @filters['level'] = ""

        # Method for toggling filter log levels on/off
        toggleFilterLogLevel: (level) ->
          # When "all" is clicked
          if not level or level is ""
            for logLevel, idx in @availableLogLevelFilters
              if @availableLogLevelFilters[idx].level is "" then @availableLogLevelFilters[idx].active = true else @availableLogLevelFilters[idx].active = false
          # When an option other than "all" is selected
          else
            for logLevel, idx in @availableLogLevelFilters when logLevel.level is level
              @availableLogLevelFilters[idx].active = !@availableLogLevelFilters[idx].active
              break
            @availableLogLevelFilters[0].active = false
          # Create levels
          _tempLevels = {}
          _tempCount = 0
          for curLevel in @availableLogLevelFilters when curLevel.level isnt "" and curLevel.active
            _tempLevels[curLevel.level] = true
            _tempCount++
          # Set level
          if _tempCount is 0
            @logLevels = null
            @availableLogLevelFilters[0].active = true
          else
            @logLevels = _tempLevels
          return

        # Returns a list of available log levels to filter on
        availableLogLevelFilters: [
            {
              label: "All"
              level: ""
              active: false
            }
            {
              label: "Info"
              level: "info"
              active: true
            }
            {
              label: "Errors"
              level: "error"
              active: true
            }
            {
              label: "Warnings"
              level: "warn"
              active: true
            }
            {
              label: "Debug"
              level: "debug"
              active: false
            }
          ]

      }
  ]
