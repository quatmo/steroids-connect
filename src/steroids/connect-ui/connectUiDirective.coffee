"use strict"

# Directive for displaying the log view
module.exports =
  [
    "$rootScope"
    "$interval"
    "BuildServerApi"
    ($rootScope, $interval, BuildServerApi) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/connect-ui/connect-ui.html"
        link: (scope, element, attrs) ->

          ###
          Tabs
          ###

          scope.tabs = [
            { name: "qr", label: "Connect" }
            { name: "logs", label: "Logs", legacyAppIncompatible: true }
            { name: "docs", label: "Documentation" }
            { name: "build-settings", label: "Cloud" }
            { name: "data", label: "Data", legacyAppIncompatible: true }
            # { name: "generators", label: "Generators" }
          ]

          selectedTab = scope.tabs[0].name

          scope.setTab = (tab) ->
            selectedTab = tab

          scope.currentTab = () ->
            selectedTab

          ###
          Legacy app logic
          ###

          scope.getAppConfig = ->
            BuildServerApi.getAppConfig().then(
              (res) ->
                if res.status == 204
                  newTabs = []
                  angular.forEach scope.tabs, (tab) ->
                    @.push tab unless tab.legacyAppIncompatible?
                  , newTabs
                  scope.tabs = newTabs
            )

          scope.getAppConfig()

          ###
          State
          ###

          scope.isConnected = true
          scope.workingOn = undefined

          scope.startWorkingOn = (what) ->
            scope.workingOn = what

          scope.finishWorking = () ->
            scope.workingOn = undefined

          $interval ->
            BuildServerApi.ping().then(
              ->
                scope.isConnected = true
            ,
              ->
                scope.isConnected = false
            )
          , 1000

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
              scope.startWorkingOn "Synchronizing app data configuration..."
              console.log "Syncing data..."
              BuildServerApi.syncData().then(
                () ->
                  console.log "Data synced successfully."
              ,
                (error) ->
                  console.log "Failed to sync data.", error
              ).finally () ->
                scope.finishWorking()

      }
  ]
