"use strict"

# Directive for displaying the log view
module.exports =
  [
    () ->
      (input) ->
        # Create a Date object of the millisecond timestamp
        inputDateTime = new Date input
        # Get hours
        hh = inputDateTime.getHours()
        hh = "0" + hh if hh < 10
        # Get minutes
        mm = inputDateTime.getMinutes()
        mm = "0" + mm if mm < 10
        # Get seconds
        ss = inputDateTime.getSeconds()
        ss = "0" + ss if ss < 10
        # Return the formatted string
        "#{hh}:#{mm}:#{ss}"
  ]