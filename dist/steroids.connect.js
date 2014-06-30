!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),(o.steroids||(o.steroids={})).connect=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var steroidsConnectModules;

steroidsConnectModules = angular.module("SteroidsConnect", [_dereq_("./directives").name]);

_dereq_("../templates/SteroidsConnectTemplates");


},{"../templates/SteroidsConnectTemplates":4,"./directives":2}],2:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("SteroidsConnect.directives", []).directive("logView", _dereq_("./logViewDirective"));


},{"./logViewDirective":3}],3:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        return alert("hei");
      }
    };
  }
];


},{}],4:[function(_dereq_,module,exports){
angular.module('SteroidsConnect').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/steroids-connect/log-message.html',
    "<div>\n" +
    "  logiviesti\n" +
    "</div>"
  );

}]);

},{}]},{},[1])
(1)
});