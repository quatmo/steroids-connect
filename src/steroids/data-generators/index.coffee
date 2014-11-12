"use strict"

# Definition for the data-generators and data-generators view module
module.exports = angular.module "SteroidsConnect.data-generators", []

  # Directives
  .directive "dataGeneratorsView", require("./dataGeneratorsViewDirective")