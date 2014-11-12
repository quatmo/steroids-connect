"use strict"

module.exports =
  [
    () ->
      (input) ->

        input
          .replace "http://localhost/app/", ""
          .replace ".html", ""
          .replace "/", "#"

  ]