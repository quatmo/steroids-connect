"use strict"

# Definition for the logs and log view module
module.exports = angular.module "SteroidsConnect.logs", [
    require("./../preview").name
  ]
  .directive "logView", require("./logViewDirective")
  .directive "logFiltersView", require("./logFiltersViewDirective")
  .filter "logTimeFormat", require("./logTimeFormatFilter")
  .filter "logDateFormat", require("./logDateFormatFilter")
  .factory "LogsAPI", require("./LogsAPI")
  .factory "LogsFilterAPI", require("./LogsFilterAPI")