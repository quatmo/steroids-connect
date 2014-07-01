"use strict"

# Definition for the logs and log view module
module.exports = angular.module "SteroidsConnect.logs", []
  .directive "logView", require("./logViewDirective")
  .directive "logFiltersView", require("./logFiltersViewDirective")
  .filter "logTimeFormat", require("./logTimeFormatFilter")
  .factory "LogsAPI", require("./LogsAPI")
  .factory "LogsFilterAPI", require("./LogsFilterAPI")