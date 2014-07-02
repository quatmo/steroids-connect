!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),(o.steroids||(o.steroids={})).connect=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/connect-ui/connect-ui.html",
      link: function(scope, element, attrs) {

        /*
        Tabs
         */
        var selectedTab;
        selectedTab = "qr";
        scope.setTab = function(tab) {
          return selectedTab = tab;
        };
        return scope.currentTab = function() {
          return selectedTab;
        };
      }
    };
  }
];


},{}],2:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("SteroidsConnect.connect-ui", []).directive("connectUi", _dereq_("./connectUiDirective"));


},{"./connectUiDirective":1}],3:[function(_dereq_,module,exports){
var steroidsConnectModules;

steroidsConnectModules = angular.module("SteroidsConnect", [_dereq_("./logs").name, _dereq_("./connect-ui").name]);

_dereq_("../templates/SteroidsConnectTemplates");


},{"../templates/SteroidsConnectTemplates":10,"./connect-ui":2,"./logs":6}],4:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return {

      /*
      EXPOSED LOGS API DEFINITION
       */
      logs: [
        {
          message: "Error msg",
          timestamp: 1404217782263,
          type: "error",
          deviceName: "Tomi's iPhone"
        }, {
          message: "Log msg",
          timestamp: 1304217782283,
          type: "log",
          deviceName: "Tomi's iPhone"
        }
      ],
      add: function(newLogMsg) {
        if (newLogMsg != null) {
          return this.logs.push(newLogMsg);
        }
      }
    };
  }
];


},{}],5:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return {

      /*
      EXPOSED LOGS FILTER API DEFINITION
       */
      filters: {
        deviceName: "",
        type: ""
      },
      clearFilters: function() {
        return this.filters = {
          deviceName: "",
          type: ""
        };
      },
      filterByDeviceName: function(deviceName) {
        if (deviceName != null) {
          return this.filters['deviceName'] = deviceName;
        } else {
          return this.filters['deviceName'] = "";
        }
      },
      availableDeviceNameFilters: function(includeAll) {
        var availableForFiltering, device, devices, _i, _len;
        if (includeAll == null) {
          includeAll = true;
        }
        availableForFiltering = [];
        if (includeAll === true) {
          availableForFiltering.push({
            label: "All devices",
            deviceName: ""
          });
        }
        devices = [
          {
            name: "Tomi's iPhone"
          }, {
            name: "Persephone"
          }
        ];
        for (_i = 0, _len = devices.length; _i < _len; _i++) {
          device = devices[_i];
          availableForFiltering.push({
            label: device.name,
            deviceName: device.name
          });
        }
        return availableForFiltering;
      },
      filterByType: function(type) {
        if (type != null) {
          return this.filters['type'] = type;
        } else {
          return this.filters['type'] = "";
        }
      },
      availableTypeFilters: function() {
        return [
          {
            label: "All",
            type: ""
          }, {
            label: "Logs",
            type: "log"
          }, {
            label: "Errors",
            type: "error"
          }
        ];
      }
    };
  }
];


},{}],6:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("SteroidsConnect.logs", []).directive("logView", _dereq_("./logViewDirective")).directive("logFiltersView", _dereq_("./logFiltersViewDirective")).filter("logTimeFormat", _dereq_("./logTimeFormatFilter")).factory("LogsAPI", _dereq_("./LogsAPI")).factory("LogsFilterAPI", _dereq_("./LogsFilterAPI"));


},{"./LogsAPI":4,"./LogsFilterAPI":5,"./logFiltersViewDirective":7,"./logTimeFormatFilter":8,"./logViewDirective":9}],7:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "LogsAPI", "LogsFilterAPI", function(LogsAPI, LogsFilterAPI) {
    return {
      restrict: "E",
      replace: true,
      templateUrl: "/steroids-connect/logs/log-filters-view.html",
      link: function(scope, element, attrs) {
        scope.logsApi = LogsAPI;
        return scope.LogsFilterAPI = LogsFilterAPI;
      }
    };
  }
];


},{}],8:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return function(input) {
      var hh, inputDateTime, mm, ms, ss;
      inputDateTime = new Date(input);
      hh = inputDateTime.getHours();
      if (hh < 10) {
        hh = "0" + hh;
      }
      mm = inputDateTime.getMinutes();
      if (mm < 10) {
        mm = "0" + mm;
      }
      ss = inputDateTime.getSeconds();
      if (ss < 10) {
        ss = "0" + ss;
      }
      ms = inputDateTime.getMilliseconds();
      if (ms < 10) {
        "00" + ms;
      } else if (ms < 100) {
        "0" + ms;
      }
      return "" + hh + ":" + mm + ":" + ss + "." + ms;
    };
  }
];


},{}],9:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "LogsAPI", "LogsFilterAPI", function(LogsAPI, LogsFilterAPI) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/logs/log-view.html",
      link: function(scope, element, attrs) {
        scope.logsApi = LogsAPI;
        return scope.LogsFilterAPI = LogsFilterAPI;
      }
    };
  }
];


},{}],10:[function(_dereq_,module,exports){
angular.module('SteroidsConnect').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/steroids-connect/connect-ui/connect-ui.html',
    "<div id=\"view-connect-ui\">\n" +
    "\n" +
    "  <!-- Navbar -->\n" +
    "  <nav class=\"navbar navbar-inverse navbar-static-top\" role=\"navigation\">\n" +
    "    <div class=\"container-fluid\">\n" +
    "\n" +
    "      <!-- Navbar header -->\n" +
    "      <div class=\"navbar-header\">\n" +
    "        <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\n" +
    "          <span class=\"icon-bar\"></span>\n" +
    "          <span class=\"icon-bar\"></span>\n" +
    "          <span class=\"icon-bar\"></span>\n" +
    "        </button>\n" +
    "        <a class=\"navbar-brand\" href=\"#\">Steroids Connect</a>\n" +
    "      </div>\n" +
    "\n" +
    "      <!-- Navbar links -->\n" +
    "      <ul class=\"nav navbar-nav navbar-right\">\n" +
    "        <li ng-class=\"{'active': currentTab() == 'qr'}\"><a ng-click=\"setTab('qr')\">Preview</a></li>\n" +
    "        <li ng-class=\"{'active': currentTab() == 'navigation'}\"><a ng-click=\"setTab('navigation')\">Navigation</a></li>\n" +
    "        <li ng-class=\"{'active': currentTab() == 'backend'}\"><a ng-click=\"setTab('backend')\">Backend</a></li>\n" +
    "        <li ng-class=\"{'active': currentTab() == 'logs'}\"><a ng-click=\"setTab('logs')\">Logs &amp; Errors</a></li>\n" +
    "        <li ng-class=\"{'active': currentTab() == 'generators'}\"><a ng-click=\"setTab('generators')\">Generators</a></li>\n" +
    "      </ul>\n" +
    "\n" +
    "    </div>\n" +
    "  </nav>\n" +
    "\n" +
    "  <!-- Subviews -->\n" +
    "  <div class=\"container-fluid\" ng-switch on=\"currentTab()\">\n" +
    "\n" +
    "    <!-- Preview -->\n" +
    "\n" +
    "    <!-- Navigation -->\n" +
    "\n" +
    "    <!-- Backend -->\n" +
    "\n" +
    "    <!-- Logs -->\n" +
    "    <div ng-switch-when=\"logs\">\n" +
    "      <log-view></log-view>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Generators -->\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/logs/log-filters-view.html',
    "<div id=\"view-log-filters\">\n" +
    "\n" +
    "  <form class=\"form-inline\" role=\"form\" id=\"log-view-filters-form\">\n" +
    "\n" +
    "    <!-- Filter for log msg type -->\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"btn-group\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-class=\"{'active': LogsFilterAPI.filters.type == availableType.type}\" ng-click=\"LogsFilterAPI.filterByType(availableType.type)\" ng-repeat=\"availableType in LogsFilterAPI.availableTypeFilters()\">{{availableType.label}}</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Filter for device name -->\n" +
    "    <div class=\"form-group\">\n" +
    "      <select name=\"filterByDeviceName\" ng-model=\"LogsFilterAPI.filters.deviceName\" ng-options=\"x.deviceName as x.label for x in LogsFilterAPI.availableDeviceNameFilters()\" class=\"form-control\"></select>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Button for clearing out all filters -->\n" +
    "    <div class=\"form-group\">\n" +
    "      <button name=\"clearFiltersBtn\" type=\"button\" ng-click=\"LogsFilterAPI.clearFilters()\" class=\"btn btn-default\">Clear</button>\n" +
    "    </div>\n" +
    "\n" +
    "  </form>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/logs/log-message.html',
    "<div>\n" +
    "  logiviesti\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/logs/log-view.html',
    "<div id=\"view-log-view\">\n" +
    "\n" +
    "  <!-- Filter options -->\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <log-filters-view></log-filters-view>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <br>\n" +
    "\n" +
    "  <!-- Table containing the log entries -->\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <table>\n" +
    "        <tr ng-repeat=\"logMsg in logsApi.logs | filter:LogsFilterAPI.filters\" class=\"logMsg\" ng-class=\"{'type-error': logMsg.type == 'error'}\">\n" +
    "          <td clas=\"logMsg-device-name\" ng-click=\"LogsFilterAPI.filterByDeviceName(logMsg.deviceName)\">{{logMsg.deviceName}}</td>\n" +
    "          <td clas=\"logMsg-time\">{{logMsg.timestamp | logTimeFormat}}</td>\n" +
    "          <td clas=\"logMsg-content\">{{logMsg.message}}</td>\n" +
    "        </tr>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>"
  );

}]);

},{}]},{},[3])
(3)
});