#
# jQuery UI Sortable plugin wrapper
#
# @param [ui-sortable] {object} Options to pass to $.fn.sortable() merged onto ui.config
#
module.exports = angular.module("ui.sortable", []).value("uiSortableConfig", {}).directive "uiSortable", [
  "uiSortableConfig"
  "$timeout"
  "$log"
  (uiSortableConfig, $timeout, $log) ->
    return (
      require: "?ngModel"
      link: (scope, element, attrs, ngModel) ->
        combineCallbacks = (first, second) ->
          if second and (typeof second is "function")
            return (e, ui) ->
              first e, ui
              second e, ui
              return
          first
        hasSortingHelper = (element, ui) ->
          helperOption = element.sortable("option", "helper")
          helperOption is "clone" or (typeof helperOption is "function" and ui.item.sortable.isCustomHelperUsed())
        savedNodes = undefined
        opts = {}
        callbacks =
          receive: null
          remove: null
          start: null
          stop: null
          update: null

        wrappers = helper: null
        angular.extend opts, uiSortableConfig, scope.$eval(attrs.uiSortable)
        if not angular.element.fn or not angular.element.fn.jquery
          $log.error "ui.sortable: jQuery should be included before AngularJS!"
          return
        if ngModel

          # When we add or remove elements, we need the sortable to 'refresh'
          # so it can find the new/removed elements.
          scope.$watch attrs.ngModel + ".length", ->

            # Timeout to let ng-repeat modify the DOM
            $timeout ->

              # ensure that the jquery-ui-sortable widget instance
              # is still bound to the directive's element
              element.sortable "refresh"  unless not element.data("ui-sortable")
              return

            return

          callbacks.start = (e, ui) ->

            # Save the starting position of dragged item
            ui.item.sortable =
              index: ui.item.index()
              cancel: ->
                ui.item.sortable._isCanceled = true
                return

              isCanceled: ->
                ui.item.sortable._isCanceled

              isCustomHelperUsed: ->
                !!ui.item.sortable._isCustomHelperUsed

              _isCanceled: false
              _isCustomHelperUsed: ui.item.sortable._isCustomHelperUsed

            return

          callbacks.activate = -> #e, ui

            # We need to make a copy of the current element's contents so
            # we can restore it after sortable has messed it up.
            # This is inside activate (instead of start) in order to save
            # both lists when dragging between connected lists.
            savedNodes = element.contents()

            # If this list has a placeholder (the connected lists won't),
            # don't inlcude it in saved nodes.
            placeholder = element.sortable("option", "placeholder")

            # placeholder.element will be a function if the placeholder, has
            # been created (placeholder will be an object).  If it hasn't
            # been created, either placeholder will be false if no
            # placeholder class was given or placeholder.element will be
            # undefined if a class was given (placeholder will be a string)
            if placeholder and placeholder.element and typeof placeholder.element is "function"
              phElement = placeholder.element()

              # workaround for jquery ui 1.9.x,
              # not returning jquery collection
              phElement = angular.element(phElement)

              # exact match with the placeholder's class attribute to handle
              # the case that multiple connected sortables exist and
              # the placehoilder option equals the class of sortable items
              excludes = element.find("[class=\"" + phElement.attr("class") + "\"]")
              savedNodes = savedNodes.not(excludes)
            return

          callbacks.update = (e, ui) ->

            # Save current drop position but only if this is not a second
            # update that happens when moving between lists because then
            # the value will be overwritten with the old value
            unless ui.item.sortable.received
              ui.item.sortable.dropindex = ui.item.index()
              ui.item.sortable.droptarget = ui.item.parent()

              # Cancel the sort (let ng-repeat do the sort for us)
              # Don't cancel if this is the received list because it has
              # already been canceled in the other list, and trying to cancel
              # here will mess up the DOM.
              element.sortable "cancel"

            # Put the nodes back exactly the way they started (this is very
            # important because ng-repeat uses comment elements to delineate
            # the start and stop of repeat sections and sortable doesn't
            # respect their order (even if we cancel, the order of the
            # comments are still messed up).

            # restore all the savedNodes except .ui-sortable-helper element
            # (which is placed last). That way it will be garbage collected.
            savedNodes = savedNodes.not(savedNodes.last())  if hasSortingHelper(element, ui) and not ui.item.sortable.received
            savedNodes.appendTo element

            # If received is true (an item was dropped in from another list)
            # then we add the new item to this list otherwise wait until the
            # stop event where we will know if it was a sort or item was
            # moved here from another list
            if ui.item.sortable.received and not ui.item.sortable.isCanceled()
              scope.$apply ->
                ngModel.$modelValue.splice ui.item.sortable.dropindex, 0, ui.item.sortable.moved
                return

            return

          callbacks.stop = (e, ui) ->

            # If the received flag hasn't be set on the item, this is a
            # normal sort, if dropindex is set, the item was moved, so move
            # the items in the list.
            if not ui.item.sortable.received and ("dropindex" of ui.item.sortable) and not ui.item.sortable.isCanceled()
              scope.$apply ->
                ngModel.$modelValue.splice ui.item.sortable.dropindex, 0, ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0]
                return

            else

              # if the item was not moved, then restore the elements
              # so that the ngRepeat's comment are correct.
              savedNodes.appendTo element  if (("dropindex" of ui.item.sortable) or ui.item.sortable.isCanceled()) and not hasSortingHelper(element, ui)
            return

          callbacks.receive = (e, ui) ->

            # An item was dropped here from another list, set a flag on the
            # item.
            ui.item.sortable.received = true
            return

          callbacks.remove = (e, ui) ->

            # Workaround for a problem observed in nested connected lists.
            # There should be an 'update' event before 'remove' when moving
            # elements. If the event did not fire, cancel sorting.
            unless "dropindex" of ui.item.sortable
              element.sortable "cancel"
              ui.item.sortable.cancel()

            # Remove the item from this list's model and copy data into item,
            # so the next list can retrive it
            unless ui.item.sortable.isCanceled()
              scope.$apply ->
                ui.item.sortable.moved = ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0]
                return

            return

          wrappers.helper = (inner) ->
            if inner and typeof inner is "function"
              return (e, item) ->
                innerResult = inner(e, item)
                item.sortable._isCustomHelperUsed = item isnt innerResult
                innerResult
            inner

          scope.$watch attrs.uiSortable, ((newVal) -> #, oldVal

            # ensure that the jquery-ui-sortable widget instance
            # is still bound to the directive's element
            unless not element.data("ui-sortable")
              angular.forEach newVal, (value, key) ->
                if callbacks[key]
                  if key is "stop"

                    # call apply after stop
                    value = combineCallbacks(value, ->
                      scope.$apply()
                      return
                    )

                  # wrap the callback
                  value = combineCallbacks(callbacks[key], value)
                else value = wrappers[key](value)  if wrappers[key]
                element.sortable "option", key, value
                return

            return
          ), true
          angular.forEach callbacks, (value, key) ->
            opts[key] = combineCallbacks(value, opts[key])
            return

        else
          $log.info "ui.sortable: ngModel not provided!", element

        # Create sortable
        element.sortable opts
        return
    )
]