"use strict"

# Definition for the generators and generators view module
module.exports = angular.module "SteroidsConnect.build-settings", []

  # Directives
  .directive "buildSettingsView", require("./buildSettingsViewDirective")

  # Services
  .service "BuildServerApi", require("./BuildServerApiService")
