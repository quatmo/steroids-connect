"use strict"

# API for handling generator details
module.exports =
  [
    () ->
      {

        ###
        EXPOSED GENERATORS API DEFINITION
        ###

        # Generators cache
        generators: [
          {
            name: "AngularJS SPA Scaffold"
            image_url: "//localhost:3000/assets/new/views/steroids-overview/grid-no-native-coding.png"
          }
          {
            name: "MPA Scaffold"
            image_url: "//localhost:3000/assets/new/views/steroids-overview/grid-multi-page-architecture.png"
          }
          {
            name: "Camera Example"
            image_url: "//localhost:3000/assets/new/views/steroids-overview/grid-native-performance.png"
          }
          {
            name: "Mankeli"
            image_url: "//localhost:3000/assets/new/views/steroids-overview/grid-native-performance.png"
          }
          {
            name: "Hilavitkutin"
            image_url: "//localhost:3000/assets/new/views/steroids-overview/grid-native-performance.png"
          }
        ]

      }
  ]