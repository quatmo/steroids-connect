"use strict"

# Directive for displaying the log view
module.exports =
  [
    () ->
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
            { name: "build-settings", label: "Build Settings"}
            { name: "data", label: "Data"}
            # { name: "generators", label: "Generators" }
          ]

          selectedTab = scope.tabs[0].name

          scope.setTab = (tab) ->
            selectedTab = tab
            console.log selectedTab

          scope.currentTab = () ->
            selectedTab

      }
  ]
