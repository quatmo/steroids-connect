"use strict"

# Directive for displaying the log view
module.exports =
  [
    () ->
      (input) ->
        # Create a Date object of the millisecond timestamp
        inputDateTime = new Date input
        # Get milliseconds
        ms = inputDateTime.getMilliseconds()
        if ms < 10 then "00" + ms
        else if ms < 100 then "0" + ms
        # Return the formatted string
        "#{ms}"
  ]