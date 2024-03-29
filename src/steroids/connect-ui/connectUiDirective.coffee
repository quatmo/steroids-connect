"use strict"

# Directive for displaying the log view
module.exports =
  [
    "$rootScope"
    "$state"
    "$interval"
    "BuildServerApi"
    ($rootScope, $state, $interval, BuildServerApi) ->
      {
        restrict: "EA"
        replace: true
        templateUrl: "/steroids-connect/connect-ui/connect-ui.html"
        link: (scope, element, attrs) ->

          ###
          Tabs
          ###

          scope.$state = $state

          scope.tabs = [
            { stateHref: "connect", name: "qr", label: "Connect" }
            { stateHref: "logs", name: "logs", label: "Logs", legacyAppIncompatible: true }
            { stateHref: "docs", name: "docs", label: "Documentation" }
            { stateHref: "cloud", name: "build-settings", label: "Cloud" }
            { stateHref: "data", name: "data", label: "Data", legacyAppIncompatible: true }
            # { stateHref: "generators", name: "generators", label: "Generators" }
          ]

          ###
          Legacy app logic
          ###

          scope.getAppConfig = ->
            BuildServerApi.getAppConfig().then(
              (res) ->
                if res.status == 200 and res.data.legacy
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
