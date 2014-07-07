steroidsConnectModules = angular.module "SteroidsConnect", [
    require("./logs").name
    require("./preview").name
    require("./generators").name
    require("./connect-ui").name
  ]

require "../templates/SteroidsConnectTemplates"