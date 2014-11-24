"use strict"

module.exports =
  [
    () ->

      viewNameRegex = /^http\:\/\/localhost\/app\/([^\/]+)\/([^\/]+)\.\w+$/g

      (input) ->

        matches = input.match viewNameRegex

        if matches
          return input
            .replace "http://localhost/app/", ""
            .replace ".html", ""
            .replace "/", "#"
        else
          return input

  ]