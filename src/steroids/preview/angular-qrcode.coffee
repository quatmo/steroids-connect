"use strict"

# angular-qrcode depends on qrcode-generator
qrcode = require("../../../bower_components/qrcode-generator/js/qrcode.js")
window.qrcode = qrcode

# angular-qrcode does not export itself as node.js/CommonJS module
#
# * angular-qrcode v3.1.0
# * (c) 2013 Monospaced http://monospaced.com
# * License: MIT
#
angular.module("monospaced.qrcode", []).directive "qrcode", [
  "$window"
  ($window) ->
    canvas2D = !!$window.CanvasRenderingContext2D
    levels =
      L: "Low"
      M: "Medium"
      Q: "Quartile"
      H: "High"

    draw = (context, qr, modules, tile) ->
      row = 0

      while row < modules
        col = 0

        while col < modules
          w = (Math.ceil((col + 1) * tile) - Math.floor(col * tile))
          h = (Math.ceil((row + 1) * tile) - Math.floor(row * tile))
          context.fillStyle = (if qr.isDark(row, col) then "#000" else "#fff")
          context.fillRect Math.round(col * tile), Math.round(row * tile), w, h
          col++
        row++
      return

    return (
      restrict: "E"
      template: "<canvas></canvas>"
      link: (scope, element, attrs) ->
        domElement = element[0]
        canvas = element.find("canvas")[0]
        context = (if canvas2D then canvas.getContext("2d") else null)
        trim = /^\s+|\s+$/g
        error = undefined
        version = undefined
        errorCorrectionLevel = undefined
        data = undefined
        size = undefined
        modules = undefined
        tile = undefined
        qr = undefined
        setVersion = (value) ->
          version = Math.max(1, Math.min(parseInt(value, 10), 10)) or 4
          return

        setErrorCorrectionLevel = (value) ->
          errorCorrectionLevel = (if value of levels then value else "M")
          return

        setData = (value) ->
          return  unless value
          data = value.replace(trim, "")
          qr = qrcode(version, errorCorrectionLevel)
          qr.addData data
          try
            qr.make()
          catch e
            error = e.message
            return
          error = false
          modules = qr.getModuleCount()
          return

        isMonitoring = false
        monitorParentSize = () ->
          if not isMonitoring
            isMonitoring = true
            $(window).resize ->
              setSize attrs.size
              render()
              console.log "RESIZE", size

        setSize = (value) ->
          if String(value).indexOf("%") > -1
            # Calculate based on parent size
            size = element.width()
            monitorParentSize()
          else
            # Use the given value
            size = parseInt(value, 10) or modules * 2
          tile = size / modules
          canvas.width = canvas.height = size
          return

        render = ->
          return  unless qr
          if error
            domElement.innerHTML = "<img src width=\"" + size + "\"" + "height=\"" + size + "\">"  unless canvas2D
            scope.$emit "qrcode:error", error
            return
          if canvas2D
            draw context, qr, modules, tile
          else
            domElement.innerHTML = qr.createImgTag(tile, 0)
          return

        setVersion attrs.version
        setErrorCorrectionLevel attrs.errorCorrectionLevel
        setSize attrs.size
        attrs.$observe "version", (value) ->
          return  unless value
          setVersion value
          setData data
          setSize size
          render()
          return

        attrs.$observe "errorCorrectionLevel", (value) ->
          return  unless value
          setErrorCorrectionLevel value
          setData data
          setSize size
          render()
          return

        attrs.$observe "data", (value) ->
          return  unless value
          setData value
          setSize size
          render()
          return

        attrs.$observe "size", (value) ->
          return  unless value
          setSize value
          render()
          return

        return
    )
]
# but after the require we can just export the jQuery
# global from this module
module.exports = angular.module "monospaced.qrcode"