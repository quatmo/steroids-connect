"use strict"

module.exports = [
  "$q"
  "$timeout"
  "BuildServerApi"
  ($q, $timeout, BuildServerApi) ->
    restrict: "EA"
    replace: true
    templateUrl: "/steroids-connect/data-generators/data-generators-view.html"
    controller: ($scope)->

      ###
      Initial State
      ###

      # names of generators are found from steroids src/steroids/Generators
      $scope.generators = [
          humanName: "Coffeescript scaffold"
          name: "scaffold"
        ,
          humanName: "Javascript scaffold"
          name: "scaffold"
      ]

      $scope.resources = [
          name: "Product"
        ,
          name: "Car"
      ]

      ###
      View Initialization
      ###

      # fetchGenerators -> CLI

      # fetchResources -> cloud

      ###
      View actions
      ###

      $scope.generate = (generator, resource)->
        BuildServerApi.generate
          name: generator.name,
          parameters:
            name: resource.name
            options: []
        .then ->
          alert("Generated!")


]
