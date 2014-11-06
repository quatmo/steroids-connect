"use strict"

module.exports = [
  "$q"
  "$timeout"
  "Restangular"
  "BuildServerApi"
  ($q, $timeout, Restangular, BuildServerApi) ->
    restrict: "EA"
    replace: true
    templateUrl: "/steroids-connect/data-generators/data-generators-view.html"
    scope:
      configApiBaseUrl: "@"
      appId: "@"
      authorizationToken: "@"
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

      $scope.resources = []

      ###
      View Initialization
      ###

      #TODO: fetchGenerators -> CLI

      do ->
        # Set base URL
        Restangular.setBaseUrl $scope.configApiBaseUrl
        # API suffix
        Restangular.setRequestSuffix ".json"
        # Default HTTP fields
        Restangular.setDefaultHttpFields
          withCredentials: true
        # Set field names correct
        Restangular.setRestangularFields
          id: "uid"
        # Set default headers
        if $scope.authorizationToken and $scope.authorizationToken isnt ""
          Restangular.setDefaultHeaders
            Authorization: $scope.authorizationToken

        Restangular
        .one "app", $scope.appId
        .all "service_providers"
        .getList()
        .then (providers)->
          for provider in providers
            Restangular
            .one "app", $scope.appId
            .one "service_providers", provider.uid
            .all "resources"
            .getList()
            .then (resources)->
              for resource in resources
                $scope.resources.push resource


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
