"use strict"

# Directive for selecting view from given list
module.exports =
  [
    () ->
      {
        restrict: "E"
        replace: true
        templateUrl: "/steroids-connect/navigation-and-themes/view-selector.html"
        scope:
          view: "="
          views: "="
        link: (scope, element, attrs) ->

          # Cache internal value
          scope.selectedId= scope.view.id

          # Monitor changes in external value
          scope.$watch "view", () ->
            scope.selectedId = scope.view.id
          , true

          # Set view object based on ID
          scope.setViewById = (id) ->
            for view in scope.views when view.id is id
              scope.view = view
              return

      }
  ]