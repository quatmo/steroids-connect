"use strict"

module.exports =
  [
    () ->
      {
        restrict: "A"
        link: (scope, element, attrs) ->

          alert "hei"

      }
  ]