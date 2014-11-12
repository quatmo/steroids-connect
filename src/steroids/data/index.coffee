"use strict"

# Definition for the data module
module.exports = angular.module "SteroidsConnect.data", []

  # Directives
  .directive "cloudDataView", require("./dataViewDirective")

  # Controllers
  .controller "DataViewCtrl", require("./DataViewCtrl")