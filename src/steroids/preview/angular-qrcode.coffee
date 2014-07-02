"use strict"

# angular-qrcode depends on qrcode-generator
qrcode = require("../../../bower_components/qrcode-generator/js/qrcode.js")
window.qrcode = qrcode

# angular-qrcode does not export itself as node.js/CommonJS module
require("../../../bower_components/angular-qrcode/qrcode.js")
# but after the require we can just export the jQuery
# global from this module
module.exports = angular.module "monospaced.qrcode"