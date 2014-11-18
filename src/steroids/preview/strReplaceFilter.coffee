"use strict"

module.exports =
  [
    () ->
      (input, find, replaceWith) ->

        input.replace new RegExp(find, "g"), replaceWith

  ]