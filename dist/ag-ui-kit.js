(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var modules;

modules = angular.module("AppGyver.UI-kit", []).directive("agUiSpinner", require("./directives/agUiSpinner"));

require("./templates");

module.exports = modules;


},{"./directives/agUiSpinner":2,"./templates":3}],2:[function(require,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "E",
      replace: true,
      template: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\">\n  <path transform=\"translate(2)\" d=\"M0 12 V20 H4 V12z\">\n    <animate attributeName=\"d\" values=\"M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0\" keytimes=\"0;.2;.5;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8\" calcMode=\"spline\"  />\n  </path>\n  <path transform=\"translate(8)\" d=\"M0 12 V20 H4 V12z\">\n    <animate attributeName=\"d\" values=\"M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0.2\" keytimes=\"0;.2;.5;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8\" calcMode=\"spline\"  />\n  </path>\n  <path transform=\"translate(14)\" d=\"M0 12 V20 H4 V12z\">\n    <animate attributeName=\"d\" values=\"M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0.4\" keytimes=\"0;.2;.5;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8\" calcMode=\"spline\" />\n  </path>\n  <path transform=\"translate(20)\" d=\"M0 12 V20 H4 V12z\">\n    <animate attributeName=\"d\" values=\"M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0.6\" keytimes=\"0;.2;.5;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8\" calcMode=\"spline\" />\n  </path>\n  <path transform=\"translate(26)\" d=\"M0 12 V20 H4 V12z\">\n    <animate attributeName=\"d\" values=\"M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0.8\" keytimes=\"0;.2;.5;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8\" calcMode=\"spline\" />\n  </path>\n</svg>",
      link: function($scope, element, attrs) {
        var $element;
        $scope.color = attrs.color || "black";
        $scope.size = attrs.size || "32";
        $element = angular.element(element);
        $element.attr("width", $scope.size);
        $element.attr("height", $scope.size);
        return $element.attr("fill", $scope.color);
      }
    };
  }
];


},{}],3:[function(require,module,exports){

},{}]},{},[1]);