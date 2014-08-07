"use strict"

module.exports =
  [
    "$scope"
    "$modalInstance"
    "tabIndex"
    "tabs"
    "icons"
    "views"
    ($scope, $modalInstance, tabIndex, tabs, icons, views) ->

        # Expose icons to scope
        $scope.icons = icons

        # Expose views to scope
        $scope.views = views

        # Is new tab?
        $scope.isNewTab = (tabIndex == -1)

        tabs = angular.copy tabs

        # Set editable tab to scope
        if tabIndex >= 0
          # This is for editing existing tabs
          $scope.tab = tabs[tabIndex]
        else
          # This is for creating new tabs
          $scope.tab =
            title: ""
            location: ""
            icon: ""

        $scope.ok = () ->
          # Update/add edited tab
          if tabIndex >= 0 then tabs[tabIndex] = $scope.tab
          else tabs.push $scope.tab
          # Resolve with current set of tabs
          $modalInstance.close tabs

        $scope.remove = () ->
          # Remove the tab
          tabs.splice tabIndex, 1
          # Resolve with current set of tabs
          $modalInstance.close tabs

        $scope.cancel = () ->
          # Dismiss the modal without any changes
          $modalInstance.dismiss "cancel"

  ]