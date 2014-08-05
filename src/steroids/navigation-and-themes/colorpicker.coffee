"use strict"

# a set of RE's that can match strings and generate color tuples. https://github.com/jquery/jquery-color/

# translate a format from Color object to a string

# HSBtoRGB from RaphaelJS

#parse a string to HSB

# HSBtoRGB from RaphaelJS
# https://github.com/DmitryBaranovskiy/raphael/
module.exports = angular.module("colorpicker.module", []).factory("Helper", ->
  closestSlider: (elem) ->
    matchesSelector = elem.matches or elem.webkitMatchesSelector or elem.mozMatchesSelector or elem.msMatchesSelector
    return elem.parentNode  if matchesSelector.bind(elem)("I")
    elem

  getOffset: (elem, fixedPosition) ->
    x = 0
    y = 0
    scrollX = 0
    scrollY = 0
    while elem and not isNaN(elem.offsetLeft) and not isNaN(elem.offsetTop)
      x += elem.offsetLeft
      y += elem.offsetTop
      if not fixedPosition and elem.tagName is "BODY"
        scrollX += document.documentElement.scrollLeft or elem.scrollLeft
        scrollY += document.documentElement.scrollTop or elem.scrollTop
      else
        scrollX += elem.scrollLeft
        scrollY += elem.scrollTop
      elem = elem.offsetParent
    top: y
    left: x
    scrollX: scrollX
    scrollY: scrollY

  stringParsers: [
    {
      re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/
      parse: (execResult) ->
        [
          execResult[1]
          execResult[2]
          execResult[3]
          execResult[4]
        ]
    }
    {
      re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/
      parse: (execResult) ->
        [
          2.55 * execResult[1]
          2.55 * execResult[2]
          2.55 * execResult[3]
          execResult[4]
        ]
    }
    {
      re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/
      parse: (execResult) ->
        [
          parseInt(execResult[1], 16)
          parseInt(execResult[2], 16)
          parseInt(execResult[3], 16)
        ]
    }
    {
      re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/
      parse: (execResult) ->
        [
          parseInt(execResult[1] + execResult[1], 16)
          parseInt(execResult[2] + execResult[2], 16)
          parseInt(execResult[3] + execResult[3], 16)
        ]
    }
  ]
).factory("Color", [
  "Helper"
  (Helper) ->
    return (
      value:
        h: 1
        s: 1
        b: 1
        a: 1

      rgb: ->
        rgb = @toRGB()
        "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")"

      rgba: ->
        rgb = @toRGB()
        "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ")"

      hex: ->
        @toHex()

      RGBtoHSB: (r, g, b, a) ->
        r /= 255
        g /= 255
        b /= 255
        H = undefined
        S = undefined
        V = undefined
        C = undefined
        V = Math.max(r, g, b)
        C = V - Math.min(r, g, b)
        H = ((if C is 0 then null else (if V is r then (g - b) / C else (if V is g then (b - r) / C + 2 else (r - g) / C + 4))))
        H = ((H + 360) % 6) * 60 / 360
        S = (if C is 0 then 0 else C / V)
        h: H or 1
        s: S
        b: V
        a: a or 1

      setColor: (val) ->
        val = val.toLowerCase()
        for key of Helper.stringParsers
          if Helper.stringParsers.hasOwnProperty(key)
            parser = Helper.stringParsers[key]
            match = parser.re.exec(val)
            values = match and parser.parse(match)
            if values
              @value = @RGBtoHSB.apply(null, values)
              return false
        return

      setHue: (h) ->
        @value.h = 1 - h
        return

      setSaturation: (s) ->
        @value.s = s
        return

      setLightness: (b) ->
        @value.b = 1 - b
        return

      setAlpha: (a) ->
        @value.a = parseInt((1 - a) * 100, 10) / 100
        return

      toRGB: (h, s, b, a) ->
        unless h
          h = @value.h
          s = @value.s
          b = @value.b
        h *= 360
        R = undefined
        G = undefined
        B = undefined
        X = undefined
        C = undefined
        h = (h % 360) / 60
        C = b * s
        X = C * (1 - Math.abs(h % 2 - 1))
        R = G = B = b - C
        h = ~~h
        R += [
          C
          X
          0
          0
          X
          C
        ][h]
        G += [
          X
          C
          C
          X
          0
          0
        ][h]
        B += [
          0
          0
          X
          C
          C
          X
        ][h]
        r: Math.round(R * 255)
        g: Math.round(G * 255)
        b: Math.round(B * 255)
        a: a or @value.a

      toHex: (h, s, b, a) ->
        rgb = @toRGB(h, s, b, a)
        "#" + ((1 << 24) | (parseInt(rgb.r, 10) << 16) | (parseInt(rgb.g, 10) << 8) | parseInt(rgb.b, 10)).toString(16).substr(1)
    )
]).factory("Slider", [
  "Helper"
  (Helper) ->
    slider =
      maxLeft: 0
      maxTop: 0
      callLeft: null
      callTop: null
      knob:
        top: 0
        left: 0

    pointer = {}
    return (
      getSlider: ->
        slider

      getLeftPosition: (event) ->
        Math.max 0, Math.min(slider.maxLeft, slider.left + ((event.pageX or pointer.left) - pointer.left))

      getTopPosition: (event) ->
        Math.max 0, Math.min(slider.maxTop, slider.top + ((event.pageY or pointer.top) - pointer.top))

      setSlider: (event, fixedPosition) ->
        target = Helper.closestSlider(event.target)
        targetOffset = Helper.getOffset(target, fixedPosition)
        slider.knob = target.children[0].style
        slider.left = event.pageX - targetOffset.left - window.pageXOffset + targetOffset.scrollX
        slider.top = event.pageY - targetOffset.top - window.pageYOffset + targetOffset.scrollY
        pointer =
          left: event.pageX
          top: event.pageY

        return

      setSaturation: (event, fixedPosition) ->
        slider =
          maxLeft: 100
          maxTop: 100
          callLeft: "setSaturation"
          callTop: "setLightness"

        @setSlider event, fixedPosition
        return

      setHue: (event, fixedPosition) ->
        slider =
          maxLeft: 0
          maxTop: 100
          callLeft: false
          callTop: "setHue"

        @setSlider event, fixedPosition
        return

      setAlpha: (event, fixedPosition) ->
        slider =
          maxLeft: 0
          maxTop: 100
          callLeft: false
          callTop: "setAlpha"

        @setSlider event, fixedPosition
        return

      setKnob: (top, left) ->
        slider.knob.top = top + "px"
        slider.knob.left = left + "px"
        return
    )
]).directive "colorpicker", [
  "$document"
  "$compile"
  "Color"
  "Slider"
  "Helper"
  ($document, $compile, Color, Slider, Helper) ->
    return (
      require: "?ngModel"
      restrict: "A"
      link: ($scope, elem, attrs, ngModel) ->
        thisFormat = (if attrs.colorpicker then attrs.colorpicker else "hex")
        position = (if angular.isDefined(attrs.colorpickerPosition) then attrs.colorpickerPosition else "bottom")
        fixedPosition = (if angular.isDefined(attrs.colorpickerFixedPosition) then attrs.colorpickerFixedPosition else false)
        target = (if angular.isDefined(attrs.colorpickerParent) then elem.parent() else angular.element(document.body))
        withInput = (if angular.isDefined(attrs.colorpickerWithInput) then attrs.colorpickerWithInput else false)
        inputTemplate = (if withInput then "<input type=\"text\" name=\"colorpicker-input\">" else "")
        template = "<div class=\"colorpicker dropdown\">" + "<div class=\"dropdown-menu\">" + "<colorpicker-saturation><i></i></colorpicker-saturation>" + "<colorpicker-hue><i></i></colorpicker-hue>" + "<colorpicker-alpha><i></i></colorpicker-alpha>" + "<colorpicker-preview></colorpicker-preview>" + inputTemplate + "<button class=\"close close-colorpicker\">&times;</button>" + "</div>" + "</div>"
        colorpickerTemplate = angular.element(template)
        pickerColor = Color
        sliderAlpha = undefined
        sliderHue = colorpickerTemplate.find("colorpicker-hue")
        sliderSaturation = colorpickerTemplate.find("colorpicker-saturation")
        colorpickerPreview = colorpickerTemplate.find("colorpicker-preview")
        pickerColorPointers = colorpickerTemplate.find("i")
        $compile(colorpickerTemplate) $scope
        if withInput
          pickerColorInput = colorpickerTemplate.find("input")
          pickerColorInput.on("mousedown", (event) ->
            event.stopPropagation()
            return
          ).on "keyup", (event) ->
            newColor = @value
            elem.val newColor
            $scope.$apply ngModel.$setViewValue(newColor)  if ngModel
            event.stopPropagation()
            event.preventDefault()
            return

          elem.on "keyup", ->
            pickerColorInput.val elem.val()
            return

        bindMouseEvents = ->
          $document.on "mousemove", mousemove
          $document.on "mouseup", mouseup
          return

        if thisFormat is "rgba"
          colorpickerTemplate.addClass "alpha"
          sliderAlpha = colorpickerTemplate.find("colorpicker-alpha")
          sliderAlpha.on("click", (event) ->
            Slider.setAlpha event, fixedPosition
            mousemove event
            return
          ).on "mousedown", (event) ->
            Slider.setAlpha event, fixedPosition
            bindMouseEvents()
            return

        sliderHue.on("click", (event) ->
          Slider.setHue event, fixedPosition
          mousemove event
          return
        ).on "mousedown", (event) ->
          Slider.setHue event, fixedPosition
          bindMouseEvents()
          return

        sliderSaturation.on("click", (event) ->
          Slider.setSaturation event, fixedPosition
          mousemove event
          return
        ).on "mousedown", (event) ->
          Slider.setSaturation event, fixedPosition
          bindMouseEvents()
          return

        colorpickerTemplate.addClass "colorpicker-fixed-position"  if fixedPosition
        colorpickerTemplate.addClass "colorpicker-position-" + position
        target.append colorpickerTemplate
        if ngModel
          ngModel.$render = ->
            elem.val ngModel.$viewValue
            return

          $scope.$watch attrs.ngModel, ->
            update()
            return

        elem.on "$destroy", ->
          colorpickerTemplate.remove()
          return

        previewColor = ->
          try
            colorpickerPreview.css "backgroundColor", pickerColor[thisFormat]()
          catch e
            colorpickerPreview.css "backgroundColor", pickerColor.toHex()
          sliderSaturation.css "backgroundColor", pickerColor.toHex(pickerColor.value.h, 1, 1, 1)
          sliderAlpha.css.backgroundColor = pickerColor.toHex()  if thisFormat is "rgba"
          return

        mousemove = (event) ->
          left = Slider.getLeftPosition(event)
          top = Slider.getTopPosition(event)
          slider = Slider.getSlider()
          Slider.setKnob top, left
          pickerColor[slider.callLeft].call pickerColor, left / 100  if slider.callLeft
          pickerColor[slider.callTop].call pickerColor, top / 100  if slider.callTop
          previewColor()
          newColor = pickerColor[thisFormat]()
          elem.val newColor
          $scope.$apply ngModel.$setViewValue(newColor)  if ngModel
          pickerColorInput.val newColor  if withInput
          false

        mouseup = ->
          $document.off "mousemove", mousemove
          $document.off "mouseup", mouseup
          return

        update = ->
          pickerColor.setColor elem.val()
          pickerColorPointers.eq(0).css
            left: pickerColor.value.s * 100 + "px"
            top: 100 - pickerColor.value.b * 100 + "px"

          pickerColorPointers.eq(1).css "top", 100 * (1 - pickerColor.value.h) + "px"
          pickerColorPointers.eq(2).css "top", 100 * (1 - pickerColor.value.a) + "px"
          previewColor()
          return

        getColorpickerTemplatePosition = ->
          positionValue = undefined
          positionOffset = Helper.getOffset(elem[0])
          if angular.isDefined(attrs.colorpickerParent)
            positionOffset.left = 0
            positionOffset.top = 0
          if position is "top"
            positionValue =
              top: positionOffset.top - 147
              left: positionOffset.left
          else if position is "right"
            positionValue =
              top: positionOffset.top
              left: positionOffset.left + 126
          else if position is "bottom"
            positionValue =
              top: positionOffset.top + elem[0].offsetHeight + 2
              left: positionOffset.left
          else if position is "left"
            positionValue =
              top: positionOffset.top
              left: positionOffset.left - 150
          top: positionValue.top + "px"
          left: positionValue.left + "px"

        documentMousedownHandler = ->
          hideColorpickerTemplate()
          return

        elem.on "click", ->
          update()
          colorpickerTemplate.addClass("colorpicker-visible").css getColorpickerTemplatePosition()

          # register global mousedown event to hide the colorpicker
          $document.on "mousedown", documentMousedownHandler
          return

        colorpickerTemplate.on "mousedown", (event) ->
          event.stopPropagation()
          event.preventDefault()
          return

        emitEvent = (name) ->
          if ngModel
            $scope.$emit name,
              name: attrs.ngModel
              value: ngModel.$modelValue

          return

        hideColorpickerTemplate = ->
          if colorpickerTemplate.hasClass("colorpicker-visible")
            colorpickerTemplate.removeClass "colorpicker-visible"
            emitEvent "colorpicker-closed"

            # unregister the global mousedown event
            $document.off "mousedown", documentMousedownHandler
          return

        colorpickerTemplate.find("button").on "click", ->
          hideColorpickerTemplate()
          return

        return
    )
]