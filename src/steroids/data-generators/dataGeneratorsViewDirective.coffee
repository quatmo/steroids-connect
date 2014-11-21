"use strict"

module.exports = [
  "$q"
  "$timeout"
  "$sce"
  "Restangular"
  "BuildServerApi"
  ($q, $timeout, $sce, Restangular, BuildServerApi) ->
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
                $scope.selectedResource = $scope.resources[0] if $scope.resources.length >= 1
                $scope.loadingResources = false
          return


      # fetchResources -> cloud

      ###
      View actions
      ###

      $scope.generatorError = false
      $scope.generatorErrorMessage = ""
      $scope.generatorSuccess = false
      $scope.generatorSuccessMessage = ""

      $scope.generate = () ->
        return if $scope.isGenerating or $scope.loadingResources or not $scope.selectedResource
        $scope.generatorError = false
        $scope.generatorSuccess = false
        $scope.isGenerating = true
        $scope.generatorSuccessMessage = $sce.trustAsHtml(""" To access your new data scaffold, open the project structure file at<br><br>&nbsp;&nbsp;&nbsp;<code style="margin-left: 20px;">myProject/app/structure.coffee</code><br><br>and change the location of the root view (or a tab) to: <br><br><p class="lead text-selectable" style="margin-left: 20px; font-family: monospace; white-space: none;">#{$scope.selectedResource.name.toLowerCase()}#index</p> """)
        BuildServerApi
          .generate
            name: "scaffold",
            parameters:
              name: $scope.selectedResource.name
              options:
                scriptExt: $scope.format
          .then(
            () ->
              console.log "Data scaffold generation successful!"
              $scope.generatorSuccess = true
            (e) ->
              console.log "Data scaffold generation failed!", e
              $scope.generatorError = true
              $scope.generatorErrorMessage = e.data.error
          ).finally ->
            $scope.isGenerating = false



]
