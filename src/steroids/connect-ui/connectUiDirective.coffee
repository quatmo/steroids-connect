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
            { name: "navigation", label: "Navigation & themes" }
            { name: "backend", label: "Backend" }
            { name: "logs", label: "Logs & Errors" }
            { name: "generators", label: "Generators" }
          ]

          selectedTab = scope.tabs[0].name

          scope.setTab = (tab) ->
            selectedTab = tab

          scope.currentTab = () ->
            selectedTab

      }
  ]