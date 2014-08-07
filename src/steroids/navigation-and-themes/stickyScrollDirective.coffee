"use strict"

# Directive for displaying the log view
module.exports =
  [
    "$window"
    ($window) ->
      {
        restrict: "A"
        scope:
          offset: "@"
        link: (scope, element, attrs) ->

          # Cache angular element for the sticky component
          $element = angular.element element
          $windowElem = angular.element $window

          # Ensure there is offset set
          scope.offset = 0 unless scope.offset
          scope.distance = $element.offset().top - scope.offset

          #
          isOverOffset = () ->
            ($windowElem[0].pageYOffset > scope.offset)

          # Function to handle the scroll event
          handleScroll = () ->
            if isOverOffset()
              # Scroll value below offset -> stop being so sticky
              if not $element.hasClass "sticky-scroll"
                $element.addClass "sticky-scroll"
                $element.width $element.parent().width()
                $element.css "top", scope.distance+"px"
            else
              # Scroll value over offset -> become sticky
              $element.removeClass "sticky-scroll"

          $element.width $element.parent().width()
          handleScroll()

          # Monitor scroll
          $windowElem.bind "scroll", () ->
            handleScroll()


      }
  ]