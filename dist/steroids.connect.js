!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),(o.steroids||(o.steroids={})).connect=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var steroidsConnectModules;

steroidsConnectModules = angular.module("SteroidsConnect", [_dereq_("./logs").name]);

_dereq_("../templates/SteroidsConnectTemplates");


},{"../templates/SteroidsConnectTemplates":8,"./logs":4}],2:[function(_dereq_,module,exports){
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


},{}],3:[function(_dereq_,module,exports){
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
      availableDeviceNameFilters: function() {
        return [
          {
            label: "All",
            deviceName: ""
          }, {
            label: "Tomi's iPhone",
            deviceName: "Tomi's iPhone"
          }, {
            label: "Persephone",
            deviceName: "Persephone"
          }
        ];
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
            label: "All devices",
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


},{}],4:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("SteroidsConnect.logs", []).directive("logView", _dereq_("./logViewDirective")).directive("logFiltersView", _dereq_("./logFiltersViewDirective")).filter("logTimeFormat", _dereq_("./logTimeFormatFilter")).factory("LogsAPI", _dereq_("./LogsAPI")).factory("LogsFilterAPI", _dereq_("./LogsFilterAPI"));


},{"./LogsAPI":2,"./LogsFilterAPI":3,"./logFiltersViewDirective":5,"./logTimeFormatFilter":6,"./logViewDirective":7}],5:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "LogsAPI", "LogsFilterAPI", function(LogsAPI, LogsFilterAPI) {
    return {
      restrict: "E",
      replace: true,
      templateUrl: "/steroids-connect/log-filters-view.html",
      link: function(scope, element, attrs) {
        scope.logsApi = LogsAPI;
        return scope.LogsFilterAPI = LogsFilterAPI;
      }
    };
  }
];


},{}],6:[function(_dereq_,module,exports){
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


},{}],7:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "LogsAPI", "LogsFilterAPI", function(LogsAPI, LogsFilterAPI) {
    return {
      restrict: "A",
      templateUrl: "/steroids-connect/log-view.html",
      link: function(scope, element, attrs) {
        scope.logsApi = LogsAPI;
        return scope.LogsFilterAPI = LogsFilterAPI;
      }
    };
  }
];


},{}],8:[function(_dereq_,module,exports){
angular.module('SteroidsConnect').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/steroids-connect/log-filters-view.html',
    "<div id=\"view-log-filters\">\n" +
    "\n" +
    "  <div ng-click=\"LogsFilterAPI.clearFilters()\">\n" +
    "    {{LogsFilterAPI.filters | json}}\n" +
    "  </div>\n" +
    "\n" +
    "  <div>\n" +
    "    <select name=\"filterByType\" ng-model=\"currentTypeFilter\" ng-init=\"currentTypeFilter=LogsFilterAPI.filters.type\" ng-change=\"LogsFilterAPI.filterByType(currentTypeFilter)\" ng-options=\"x.type as x.label for x in LogsFilterAPI.availableTypeFilters()\"></select>\n" +
    "    <select name=\"filterByDeviceName\" ng-model=\"currentDeviceNameFilter\" ng-init=\"currentDeviceNameFilter=LogsFilterAPI.filters.deviceName\" ng-change=\"LogsFilterAPI.filterByDeviceName(currentDeviceNameFilter)\" ng-options=\"x.deviceName as x.label for x in LogsFilterAPI.availableDeviceNameFilters()\"></select>\n" +
    "  </div>\n" +
    "\n" +
    "  <br><br>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/log-message.html',
    "<div>\n" +
    "  logiviesti\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/log-view.html',
    "<div id=\"view-log-view\">\n" +
    "\n" +
    "  <log-filters-view></log-filters-view>\n" +
    "\n" +
    "  <!-- Table containing the erros -->\n" +
    "  <table>\n" +
    "    <tr ng-repeat=\"logMsg in logsApi.logs | filter:LogsFilterAPI.filters\" class=\"logMsg\" ng-class=\"{'type-error': logMsg.type == 'error'}\">\n" +
    "      <td clas=\"logMsg-device-name\" ng-click=\"LogsFilterAPI.filterByDeviceName(logMsg.deviceName)\">{{logMsg.deviceName}}</td>\n" +
    "      <td clas=\"logMsg-time\">{{logMsg.timestamp | logTimeFormat}}</td>\n" +
    "      <td clas=\"logMsg-content\">{{logMsg.message}}</td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "\n" +
    "</div>"
  );

}]);

},{}]},{},[1])
(1)
});