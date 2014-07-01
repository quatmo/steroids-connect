!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),(o.steroids||(o.steroids={})).connect=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var steroidsConnectModules;

steroidsConnectModules = angular.module("SteroidsConnect", [_dereq_("./logs").name]);

_dereq_("../templates/SteroidsConnectTemplates");


},{"../templates/SteroidsConnectTemplates":6,"./logs":3}],2:[function(_dereq_,module,exports){
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
          type: "error"
        }, {
          message: "Log msg",
          timestamp: 1304217782283,
          type: "log"
        }
      ],
      add: function(newLogMsg) {
        if (newLogMsg == null) {
          return logs.push(newLogMsg);
        }
      }
    };
  }
];


},{}],3:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("SteroidsConnect.logs", []).directive("logView", _dereq_("./logViewDirective")).filter("logTimeFormat", _dereq_("./logTimeFormatFilter")).factory("LogsAPI", _dereq_("./LogsAPI"));


},{"./LogsAPI":2,"./logTimeFormatFilter":4,"./logViewDirective":5}],4:[function(_dereq_,module,exports){
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


},{}],5:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "LogsAPI", function(LogsAPI) {
    return {
      restrict: "A",
      templateUrl: "/steroids-connect/log-view.html",
      link: function(scope, element, attrs) {
        return scope.logsApi = LogsAPI;
      }
    };
  }
];


},{}],6:[function(_dereq_,module,exports){
angular.module('SteroidsConnect').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/steroids-connect/log-message.html',
    "<div>\n" +
    "  logiviesti\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/log-view.html',
    "<div>\n" +
    "\n" +
    "  <!-- Table containing the erros -->\n" +
    "  <table>\n" +
    "    <tr ng-repeat=\"logMsg in logsApi.logs\" ng-class=\"{'type-error': logMsg.type == 'error'}\">\n" +
    "      <td>{{logMsg.timestamp | logTimeFormat}}</td>\n" +
    "      <td>{{logMsg.message}}</td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "\n" +
    "</div>"
  );

}]);

},{}]},{},[1])
(1)
});