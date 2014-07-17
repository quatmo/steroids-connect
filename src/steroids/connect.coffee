steroidsConnectModules = angular.module "SteroidsConnect", [
    require("./logs").name
    require("./preview").name
    require("./navigation-and-themes").name
    require("./generators").name
    require("./connect-ui").name
  ]

require "../templates/SteroidsConnectTemplates"

steroidsConnectModules.run [
  "LogCloudConnector"
  (LogCloudConnector) ->

    # Configure and run log cloud connector
    LogCloudConnector.setEndpoint("./test_log.json")
    LogCloudConnector.connect()
]