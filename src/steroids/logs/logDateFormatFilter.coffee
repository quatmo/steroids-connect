"use strict"

# Directive for displaying the log view
module.exports =
  [
    () ->
      (input) ->
        # Create a Date object of the millisecond timestamp
        inputDateTime = new Date input
        # Get date
        dd = inputDateTime.getDate()
        dd = "0" + dd if dd < 10
        # Get month
        mm = inputDateTime.getMonth()
        mm = "0" + mm if mm < 10
        # Get year
        yyyy = inputDateTime.getFullYear()
        # Return the formatted string
        "#{yyyy}-#{mm}-#{dd}"
  ]