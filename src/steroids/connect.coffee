steroidsConnectModules = angular.module "SteroidsConnect", [
    "ui.router"
    require("./logs").name
    require("./preview").name
    require("./navigation-and-themes").name
    require("./generators").name
    require("./connect-ui").name
    require("./docs").name
    require("./build-settings").name
    require("./data").name
    require("./data-generators").name
    "AppGyver.UI-kit"
    "AppGyver.DataConfigurator"
    "AppGyver.DataBrowser"
  ]

require "../templates/SteroidsConnectTemplates"

steroidsConnectModules.config [
  "$locationProvider"
  "$stateProvider"
  "$urlRouterProvider"
  ($locationProvider, $stateProvider, $urlRouterProvider) ->

    # Absolutely NO HTML5 mode
    $locationProvider.html5Mode false

    # Configure view routes with ui-router
    $stateProvider

      .state "connect",
        url: "/connect"
        templateUrl: "/steroids-connect/preview/preview-view.html"
        controller: "ConnectViewCtrl"

      .state "logs",
        url: "/logs"
        templateUrl: "/steroids-connect/logs/log-view.html"
        controller: "LogViewCtrl"

      .state "docs",
        url: "/docs"
        templateUrl: "/steroids-connect/docs/docs-view.html"

      .state "cloud",
        url: "/cloud"
        templateUrl: "/steroids-connect/build-settings/build-settings-view.html"
        controller: "CloudViewCtrl"

      .state "data",
        url: "/data"
        templateUrl: "/steroids-connect/data/data-view.html"
        controller: "DataViewCtrl"

      .state "data.configure",
        url: "/configure"
        templateUrl: "/steroids-connect/data/data-configure.html"

      .state "data.browse",
        url: "/browse"
        templateUrl: "/steroids-connect/data/data-browse.html"

      .state "data.generators",
        url: "/generators"
        templateUrl: "/steroids-connect/data/data-generators.html"

    # Default state
    $urlRouterProvider.otherwise "/connect"

]

steroidsConnectModules.run [
  "LogCloudConnector"
  "DeviceCloudConnector",
  (LogCloudConnector, DeviceCloudConnector) ->

    # Configure and run log cloud connector
    LogCloudConnector.setEndpoint("http://localhost:4567/__appgyver/logger")
    LogCloudConnector.connect()

    # Device cloud connector
    DeviceCloudConnector.connect()

]
