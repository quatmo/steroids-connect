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

      $scope.loadingResources = true
      $scope.isGenerating = false
      $scope.selectedResource = undefined
      $scope.format = "coffee"

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

        promisesForQ = []

        Restangular
          .one "app", $scope.appId
          .all "service_providers"
          .getList()
          .then (providers)->
            for provider in providers
              tempPromise = Restangular
                .one "app", $scope.appId
                .one "service_providers", provider.uid
                .all "resources"
                .getList()
                .then (resources)->
                  for resource in resources
                    $scope.resources.push resource
              promisesForQ.push tempPromise
            return
          .then () ->
            $q.all promisesForQ
              .finally ->
                $scope.loadingResources = false
          return


      # fetchResources -> cloud

      ###
      View actions
      ###

      $scope.generate = () ->
        return if $scope.isGenerating or $scope.loadingResources or not $scope.selectedResource
        $scope.isGenerating = true
        BuildServerApi
          .generate
            name: "scaffold",
            parameters:
              name: $scope.selectedResource.name
              options: [$scope.format]
          .then(
            ->
              console.log "Data scaffold generation successful!"
            ->
              console.log "Data scaffold generation failed!"
          ).finally ->
            $scope.isGenerating = false



]
