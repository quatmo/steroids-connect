"use strict"

# Definition for the logs and log view module
module.exports = angular.module "SteroidsConnect.navigation-and-themes", [
    require("./colorpicker").name
    "ui.bootstrap"
  ]

  # Directives

  .directive "stickyScroll", require("./stickyScrollDirective")
  .directive "colorInput", require("./colorInputDirective")
  .directive "viewSelector", require("./viewSelectorDirective")
  .directive "tabEditor", require("./tabEditorDirective")
  .directive "generalSettingsConfiguratorView", require("./generalSettingsConfiguratorViewDirective")
  .directive "navigationBarConfiguratorView", require("./navigationBarConfiguratorViewDirective")
  .directive "statusBarConfiguratorView", require("./statusBarConfiguratorViewDirective")
  .directive "tabsConfiguratorView", require("./tabsConfiguratorViewDirective")
  .directive "drawerConfiguratorView", require("./drawerConfiguratorViewDirective")
  .directive "navigationAndThemesView", require("./navigationAndThemesViewDirective")

  # Factories / services

  .factory "SteroidsSettingsAPI", require("./SteroidsSettingsAPI")

  # Controllers

  .controller "TabModalCtrl", require("./TabModalCtrl")