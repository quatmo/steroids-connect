"use strict"

# Definition for the preview displaying connected devices and QR code to connect
module.exports = angular.module "SteroidsConnect.preview", [
    require("./angular-qrcode").name
  ]
  .directive "previewView", require("./previewViewDirective")
  .factory "DevicesAPI", require("./DevicesAPI")
  .service "DeviceCloudConnector", require("./DeviceCloudConnectorService")
  .controller "ConnectViewCtrl", require("./ConnectViewCtrl")
  .filter "strReplace", require("./strReplaceFilter")
