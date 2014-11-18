"use strict"

# Definition for the logs and log view module
module.exports = angular.module "SteroidsConnect.logs", [
    require("./../preview").name
    require("./filterUnique").name
  ]
  .directive "logMessage", require("./logMessageDirective")
  .directive "logView", require("./logViewDirective")
  .directive "logFiltersView", require("./logFiltersViewDirective")
  .filter "logTimeFormat", require("./logTimeFormatFilter")
  .filter "logTimeMillisecondsFormat", require("./logTimeMillisecondsFormatFilter")
  .filter "logDateFormat", require("./logDateFormatFilter")
  .filter "viewUrlToRouteName", require("./viewUrlToRouteNameFilter")
  .filter "filterByLogLevels", require("./filterByLogLevelsFilter")
  .factory "LogsAPI", require("./LogsAPI")
  .factory "LogsFilterAPI", require("./LogsFilterAPI")
  .service "LogCloudConnector", require("./LogCloudConnectorService")
  .controller "LogViewCtrl", require("./LogViewCtrl")