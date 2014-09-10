"use strict"

# Definition for the generators and generators view module
module.exports = angular.module "SteroidsConnect.build-settings", []
  .directive "buildSettingsView", require("./buildSettingsViewDirective")
