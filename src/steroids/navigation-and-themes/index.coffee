"use strict"

# Definition for the logs and log view module
module.exports = angular.module "SteroidsConnect.navigation-and-themes", []
  #.directive "logMessage", require("./logMessageDirective")
  .directive "navigationAndThemesView", require("./navigationAndThemesViewDirective")
  #.directive "logFiltersView", require("./logFiltersViewDirective")
  #.filter "logTimeFormat", require("./logTimeFormatFilter")
  #.filter "logTimeMillisecondsFormat", require("./logTimeMillisecondsFormatFilter")
  #.filter "logDateFormat", require("./logDateFormatFilter")
  #.factory "LogsAPI", require("./LogsAPI")
  #.factory "LogsFilterAPI", require("./LogsFilterAPI")
  #.service "LogCloudConnector", require("./LogCloudConnectorService")