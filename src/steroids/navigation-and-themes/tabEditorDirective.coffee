"use strict"

# Directive for selecting view from given list
module.exports =
  [
    "$modal"
    ($modal) ->
      {
        restrict: "E"
        replace: true
        templateUrl: "/steroids-connect/navigation-and-themes/tab-editor.html"
        scope:
          tabs: "="
          icons: "="
          views: "="
        link: (scope, element, attrs) ->

          scope.openEditModal = (tabIndex) ->
            editModal = $modal.open
              templateUrl: "/steroids-connect/navigation-and-themes/tab-modal.html"
              controller: "TabModalCtrl"
              size: "lg"
              resolve:
                tabIndex: () ->
                  tabIndex
                tabs: () ->
                  scope.tabs
                icons: () ->
                  scope.icons
                views: () ->
                  scope.views

            editModal.result.then (newTabs) ->
              scope.tabs = newTabs

      }
  ]