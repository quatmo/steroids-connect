steroidsConnectModules = angular.module "SteroidsConnect", [
    require("./logs").name
    require("./connect-ui").name
  ]

require "../templates/SteroidsConnectTemplates"