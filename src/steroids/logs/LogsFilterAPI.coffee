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
        filters: {
          deviceName: "" # Name of the device originating the log entry
          view: ""       # Name of the view originating the log entry
          level: ""      # Level of the log entry (eg. "error" or "info")
        }

        # Method for clearing ALL filters
        clearFilters: () ->
          @filters = {
            deviceName: ""
            view: ""
            level: ""
          }

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
          console.log devicesNow
          if devicesNow
            for ip, device of devicesNow
              availableForFiltering.push
                label: device.device
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

        # Returns a list of available log levels to filter on
        availableLogLevelFilters: [
            {
              label: "All"
              level: ""
            }
            {
              label: "Info"
              level: "info"
            }
            {
              label: "Errors"
              level: "error"
            }
            {
              label: "Warnings"
              level: "warn"
            }
            {
              label: "Debug"
              level: "debug"
            }
          ]

      }
  ]
