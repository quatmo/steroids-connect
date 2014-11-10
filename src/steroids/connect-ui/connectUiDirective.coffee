"use strict"

# Directive for displaying the log view
module.exports =
  [
    "$rootScope"
    "BuildServerApi"
    ($rootScope, BuildServerApi) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/connect-ui/connect-ui.html"
        link: (scope, element, attrs) ->

          ###
          Tabs
          ###

          scope.tabs = [
            { name: "qr", label: "Preview" }
            { name: "logs", label: "Logs" }
            { name: "docs", label: "Documentation" }
            { name: "build-settings", label: "Cloud Settings"}
            { name: "data", label: "Data"}
            # { name: "generators", label: "Generators" }
          ]

          selectedTab = scope.tabs[0].name

          scope.setTab = (tab) ->
            selectedTab = tab

          scope.currentTab = () ->
            selectedTab

          ###
          Events
          ###

          syncDataAfterTheseEvents = [
            # Provider CRUD
            "ag.data-configurator.provider.created"
            "ag.data-configurator.provider.updated"
            "ag.data-configurator.provider.destroyed"
            # Resource CRUD
            "ag.data-configurator.resource.created"
            "ag.data-configurator.resource.updated"
            "ag.data-configurator.resource.destroyed"
            # Service CRUD
            "ag.data-configurator.service.created"
            "ag.data-configurator.service.updated"
            "ag.data-configurator.service.destroyed"
          ]

          angular.forEach syncDataAfterTheseEvents, (eventName) ->
            $rootScope.$on eventName, () ->
              console.log "Syncing data..."
              BuildServerApi.syncData().then ->
                console.log "Data synced successfully."

      }
  ]
