"use strict"

# Definition for the logs and log view module
module.exports = angular.module "SteroidsConnect.navigation-and-themes", []
  .directive "generalSettingsConfiguratorView", require("./generalSettingsConfiguratorViewDirective")
  .directive "navigationBarConfiguratorView", require("./navigationBarConfiguratorViewDirective")
  .directive "statusBarConfiguratorView", require("./statusBarConfiguratorViewDirective")
  .directive "tabsConfiguratorView", require("./tabsConfiguratorViewDirective")
  .directive "drawerConfiguratorView", require("./drawerConfiguratorViewDirective")
  .directive "navigationAndThemesView", require("./navigationAndThemesViewDirective")