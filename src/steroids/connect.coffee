steroidsConnectModules = angular.module "SteroidsConnect", [
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

steroidsConnectModules.run [
  "LogCloudConnector"
  (LogCloudConnector) ->

    # Configure and run log cloud connector
    LogCloudConnector.setEndpoint("http://localhost:4567/__appgyver/logger")
    LogCloudConnector.connect()

]

steroidsConnectModules.run [
  "DeviceCloudConnector",
  (DeviceCloudConnector) ->

    DeviceCloudConnector.connect()

]
