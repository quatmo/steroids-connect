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
          type: ""       # Type of the log entry (eg. "error" or "log")
        }

        # Method for clearing ALL filters
        clearFilters: () ->
          @filters = {
            deviceName: ""
            view: ""
            type: ""
          }

        # Method for settings the filter on device name
        filterByDeviceName: (deviceName) ->
          if deviceName? then @filters['deviceName'] = deviceName else @filters['deviceName'] = ""

        # Returns a list of available devices to filter on
        availableDeviceNameFilters: (includeAll=true) ->
          # Set the base for the filter
          availableForFiltering = []
          # If option "All" should be included:
          if includeAll is true then availableForFiltering.push
            label: "All devices"
            filterBy: ""
          # Include available devices
          for device in DevicesAPI.devices
            availableForFiltering.push
              label: device.name
              filterBy: device.name
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
              label: logMsg.view
              filterBy: logMsg.view
          # Return the composed list of filterable devices
          availableForFiltering

        # Method for settings the filter on message type
        filterByType: (type) ->
          if type? then @filters['type'] = type else @filters['type'] = ""

        # Returns a list of available types to filter on
        availableTypeFilters: [
            {
              label: "All"
              type: ""
            }
            {
              label: "Logs"
              type: "log"
            }
            {
              label: "Errors"
              type: "error"
            }
          ]

      }
  ]