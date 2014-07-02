steroidsConnectModules = angular.module "SteroidsConnect", [
    require("./logs").name
    require("./preview").name
    require("./connect-ui").name
  ]

require "../templates/SteroidsConnectTemplates"