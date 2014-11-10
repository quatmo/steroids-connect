(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var modules;

modules = angular.module("AppGyver.DataConfigurator", [require("./providers").name, require("./ui").name, "ui.bootstrap", "restangular", "AppGyver.UI-kit"]);

require("./templates");

module.exports = modules;


},{"./providers":13,"./templates":21,"./ui":23}],2:[function(require,module,exports){
"use strict";
module.exports = [
  "$rootScope", "AgDataProviders", "AgDataProvidersModal", "AgDataResources", "AgDataResourcesModal", "AgDataServices", "AgDataServicesModal", function($rootScope, AgDataProviders, AgDataProvidersModal, AgDataResources, AgDataResourcesModal, AgDataServices, AgDataServicesModal) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/appgyver/data-configurator/providers/provider-details.html",
      link: function($scope, element, attrs) {

        /*
        Provider template
         */
        $scope.providerTemplateLoading = true;
        $scope.providerTemplate = void 0;
        AgDataProviders.getTemplate($scope.provider.providerTypeId).then(function(data) {
          return $scope.providerTemplate = data;
        })["finally"](function() {
          return $scope.providerTemplateLoading = false;
        });

        /*
        Provider resources
         */
        $scope.resources = [];
        $scope.resourcesMeta = {
          loading: true,
          error: false
        };
        AgDataResources.allConfiguredResources($scope.provider.uid).then(function(data) {
          return $scope.resources = data;
        }, function(err) {
          return $scope.resourcesMeta.error = true;
        })["finally"](function() {
          return $scope.resourcesMeta.loading = false;
        });

        /*
        Provider services
         */
        $scope.services = [];
        $scope.servicesMeta = {
          loading: true,
          error: false
        };
        AgDataServices.allConfiguredServices($scope.provider.uid).then(function(data) {
          return $scope.services = data;
        }, function(err) {
          return $scope.servicesMeta.error = true;
        })["finally"](function() {
          return $scope.servicesMeta.loading = false;
        });

        /*
        Methods
         */
        $scope.manageProvider = function() {
          return AgDataProvidersModal.manageProvider($scope.providerTemplate, $scope.provider);
        };
        $scope.newResource = function() {
          return AgDataResourcesModal.newResource($scope.providerTemplate, $scope.provider);
        };
        return $scope.newService = function() {
          return AgDataServicesModal.newService($scope.providerTemplate, $scope.provider);
        };
      }
    };
  }
];


},{}],3:[function(require,module,exports){
"use strict";
module.exports = [
  "$rootScope", "AgDataProviders", "AgDataProvidersModal", function($rootScope, AgDataProviders, AgDataProvidersModal) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/appgyver/data-configurator/providers/providers.html",
      link: function($scope, element, attrs) {

        /*
        Providers
         */
        $scope.providers = [];
        $scope.providersMeta = {
          loading: true,
          error: false
        };
        AgDataProviders.allConfiguredProviders().then(function(data) {
          return $scope.providers = data;
        }, function(err) {
          return $scope.providersMeta.error = true;
        })["finally"](function() {
          return $scope.providersMeta.loading = false;
        });

        /*
        Events
         */
        $rootScope.$on("ag.data-configurator.provider.created", function($event, newProvider) {
          return $scope.providers.push(newProvider);
        });
        $rootScope.$on("ag.data-configurator.provider.updated", function($event, updatedProvider) {
          var i, provider, _i, _len, _ref;
          _ref = $scope.providers;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            provider = _ref[i];
            if (!(provider.uid === updatedProvider.uid)) {
              continue;
            }
            $scope.providers[i] = updatedProvider;
            return;
          }
        });
        $rootScope.$on("ag.data-configurator.provider.destroyed", function($event, destroyedProviderId) {
          var i, provider, _i, _len, _ref;
          _ref = $scope.providers;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            provider = _ref[i];
            if (!(provider.uid === destroyedProviderId)) {
              continue;
            }
            $scope.providers.splice(i, 1);
            return;
          }
        });

        /*
        Provider templates
         */
        $scope.providerTemplates = [];
        $scope.providerTemplatesMeta = {
          loading: true,
          error: false
        };
        AgDataProviders.allTemplates().then(function(data) {
          return $scope.providerTemplates = data;
        }, function(err) {
          return $scope.providerTemplatesMeta.error = true;
        })["finally"](function() {
          return $scope.providerTemplatesMeta.loading = false;
        });

        /*
        Methods
         */
        return $scope.newProvider = function(template) {
          return AgDataProvidersModal.newProvider(template);
        };
      }
    };
  }
];


},{}],4:[function(require,module,exports){
"use strict";
module.exports = [
  "$rootScope", "AgDataProviders", "AgDataResources", "AgDataResourcesModal", "AgDataResourceActionsModal", function($rootScope, AgDataProviders, AgDataResources, AgDataResourcesModal, AgDataResourceActionsModal) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/appgyver/data-configurator/providers/resource-details.html",
      link: function($scope, element, attrs) {

        /*
        Provider template
         */
        $scope.providerTemplateLoading = true;
        $scope.providerTemplate = void 0;
        AgDataProviders.getTemplate($scope.provider.providerTypeId).then(function(data) {
          return $scope.providerTemplate = data;
        })["finally"](function() {
          return $scope.providerTemplateLoading = false;
        });

        /*
        Resource columns
         */
        $scope.columns = [];
        $scope.columnsMeta = {
          loading: false,
          error: false
        };
        $scope.hadColumnsToBeginWith = !($scope.resource.columns === null);
        $scope.columnsSaving = false;
        $scope.saveColumns = function() {
          $scope.columnsSaving = true;
          $scope.resource.columns = $scope.columns;
          return AgDataResources.save($scope.resource).then(function(data) {
            $scope.resource = data;
            return $scope.columns = data.columns;
          })["finally"](function() {
            return $scope.columnsSaving = false;
          });
        };
        $scope.fetchColumns = function() {
          $scope.columnsMeta.loading = true;
          return AgDataResources.getColumnsFor($scope.resource).then(function(data) {
            $scope.resource.columns = $scope.columns = data.columns;
            if (data.response_status_code === 500) {
              $scope.columnsMeta.error = true;
              return;
            }
            return $scope.columnsMeta.error = false;
          }, function(err) {
            return $scope.columnsMeta.error = true;
          })["finally"](function() {
            return $scope.columnsMeta.loading = false;
          });
        };
        if (!$scope.hadColumnsToBeginWith) {
          $scope.fetchColumns();
        } else {
          $scope.columns = $scope.resource.columns;
        }

        /*
        Methods
         */
        $scope.manageResource = function() {
          return AgDataResourcesModal.manageResource($scope.providerTemplate, $scope.provider, $scope.resource);
        };
        return $scope.manageResourceActions = function() {
          return AgDataResourceActionsModal.manageResourceActions($scope.providerTemplate, $scope.provider, $scope.resource);
        };
      }
    };
  }
];


},{}],5:[function(require,module,exports){
"use strict";
module.exports = [
  "$rootScope", "AgDataProviders", "AgDataServices", "AgDataServicesModal", function($rootScope, AgDataProviders, AgDataServices, AgDataServicesModal) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/appgyver/data-configurator/providers/service-details.html",
      link: function($scope, element, attrs) {

        /*
        Provider template
         */
        $scope.providerTemplateLoading = true;
        $scope.providerTemplate = void 0;
        AgDataProviders.getTemplate($scope.provider.providerTypeId).then(function(data) {
          return $scope.providerTemplate = data;
        })["finally"](function() {
          return $scope.providerTemplateLoading = false;
        });

        /*
        Service details
         */
        $scope.saving = false;
        $scope.saveError = false;
        $scope.saveService = function() {
          if ($scope.saving) {
            return;
          }
          $scope.saving = true;
          $scope.saveError = false;
          return AgDataServices.save($scope.service).then(function(data) {
            return $scope.service = data;
          }, function(err) {
            return $scope.saveError = true;
          })["finally"](function() {
            return $scope.saving = false;
          });
        };
        $scope.getAction = function() {
          var actionDetails, actionName, _ref;
          _ref = $scope.service.actions;
          for (actionName in _ref) {
            actionDetails = _ref[actionName];
            return $scope.service.actions[actionName];
          }
        };

        /*
        Methods
         */
        return $scope.manageService = function() {
          return AgDataServicesModal.manageService($scope.providerTemplate, $scope.provider, $scope.service);
        };
      }
    };
  }
];


},{}],6:[function(require,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/appgyver/data-configurator/providers/data-model.html",
      scope: {
        columns: "=",
        columnsEditable: "@",
        identifierKey: "=",
        identifierKeyEditable: "@"
      },
      link: function($scope, element, attrs) {
        var _makeNewTemp;
        if ($scope.columnsEditable !== true) {
          $scope.columnsEditable = false;
        }
        if ($scope.identifierKeyEditable !== true) {
          $scope.identifierKeyEditable = false;
        }
        if (!$scope.columns) {
          $scope.columns = [];
        }
        $scope.availableTypes = ["string", "integer", "boolean", "array", "object", "image", "file"];
        _makeNewTemp = function() {
          return $scope.temp = {
            name: "",
            type: "string",
            required: false,
            "default": ""
          };
        };
        _makeNewTemp();
        $scope.canAdd = function() {
          if ($scope.temp.name === "" || $scope.temp.type === "") {
            return false;
          }
          return true;
        };
        $scope.add = function() {
          if (!$scope.canAdd()) {
            return;
          }
          if (!$scope.columns) {
            $scope.columns = [];
          }
          $scope.columns.push($scope.temp);
          return _makeNewTemp();
        };
        $scope.removeByName = function(name) {
          var column, idx, _i, _len, _ref, _results;
          _ref = $scope.columns;
          _results = [];
          for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
            column = _ref[idx];
            if (!(column.name === name)) {
              continue;
            }
            $scope.columns.splice(idx, 1);
            break;
          }
          return _results;
        };
        return $scope.setIdentifierKey = function(identifierKey) {
          return $scope.identifierKey = identifierKey;
        };
      }
    };
  }
];


},{}],7:[function(require,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/appgyver/data-configurator/providers/headers.html",
      scope: {
        headers: "=",
        forResource: "@"
      },
      link: function($scope, element, attrs) {
        if (!$scope.headers) {
          $scope.headers = {};
        }
        $scope.temp = {};
        $scope.canAddHeader = function() {
          if (!$scope.temp.name || $scope.temp.name.length === 0) {
            return false;
          }
          if (!$scope.temp.value || $scope.temp.value.length === 0) {
            return false;
          }
          return true;
        };
        $scope.addHeader = function() {
          if (!$scope.canAddHeader()) {
            return;
          }
          $scope.headers[$scope.temp.name] = $scope.temp.value;
          return $scope.temp = {};
        };
        return $scope.removeHeader = function(name) {
          return delete $scope.headers[name];
        };
      }
    };
  }
];


},{}],8:[function(require,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/appgyver/data-configurator/providers/authentication.html",
      link: function($scope, element, attrs) {
        $scope.canChangeType = false;
        if (attrs.canChangeType === "true" || attrs.canChangeType === true) {
          $scope.canChangeType = true;
        }

        /*
        Auth types
         */
        $scope.authTypes = {
          "none": {
            label: "None",
            fields: []
          },
          "basic": {
            label: "Basic auth",
            fields: [
              {
                label: "User",
                key: "user",
                regex: "",
                description: "Your Basic AUTH user name"
              }, {
                label: "Password",
                key: "password",
                regex: "",
                description: "Your Basic AUTH password"
              }
            ]
          }
        };

        /*
        Manage auth type changes
         */
        return $scope.$watch("provider.auth", function(newVal, oldVal) {
          if (!oldVal || newVal === oldVal) {
            return;
          }
          return angular.forEach($scope.authTypes[oldVal].fields, function(field) {
            if (this[field.key]) {
              return delete this[field.key];
            }
          }, $scope.provider.configurationKeys);
        });
      }
    };
  }
];


},{}],9:[function(require,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/appgyver/data-configurator/providers/query-parameters.html",
      scope: {
        queryParameters: "="
      },
      link: function($scope, element, attrs) {
        var _makeNewTemp;
        if ($scope.queryParameters == null) {
          $scope.queryParameters = [];
        }
        _makeNewTemp = function() {
          return $scope.temp = {
            name: "",
            column_type: "string",
            required: false,
            "default": ""
          };
        };
        _makeNewTemp();
        $scope.canAdd = function() {
          if ($scope.temp.name === "" || $scope.temp.column_type === "") {
            return false;
          }
          return true;
        };
        $scope.add = function() {
          if (!$scope.canAdd()) {
            return;
          }
          if ($scope.queryParameters == null) {
            $scope.queryParameters = [];
          }
          $scope.queryParameters.push($scope.temp);
          return _makeNewTemp();
        };
        return $scope.removeByName = function(name) {
          var idx, param, _i, _len, _ref, _results;
          _ref = $scope.queryParameters;
          _results = [];
          for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
            param = _ref[idx];
            if (!(param.name === name)) {
              continue;
            }
            $scope.queryParameters.splice(idx, 1);
            break;
          }
          return _results;
        };
      }
    };
  }
];


},{}],10:[function(require,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/appgyver/data-configurator/providers/url-substitutions.html",
      scope: {
        urlSubstitutions: "="
      },
      link: function($scope, element, attrs) {
        if (!$scope.urlSubstitutions) {
          $scope.urlSubstitutions = {};
        }
        $scope.temp = {
          optional: false
        };
        $scope.canAdd = function() {
          if (!$scope.temp.name || $scope.temp.name.length === 0) {
            return false;
          }
          return true;
        };
        $scope.add = function() {
          if (!$scope.canAdd()) {
            return;
          }
          $scope.urlSubstitutions[$scope.temp.name] = {
            "default": $scope.temp["default"],
            optional: $scope.temp.optional
          };
          return $scope.temp = {
            optional: false
          };
        };
        return $scope.remove = function(name) {
          return delete $scope.urlSubstitutions[name];
        };
      }
    };
  }
];


},{}],11:[function(require,module,exports){
"use strict";
module.exports = [
  function() {
    return function(template, propertyName) {
      if (!template) {
        return false;
      }
      return !(template.ui_configuration_restrictions.indexOf(propertyName) > -1);
    };
  }
];


},{}],12:[function(require,module,exports){
"use strict";
module.exports = [
  function() {
    return function(input) {
      var output;
      output = [];
      angular.forEach(input, function(template) {
        if (!template.hidden) {
          return this.push(template);
        }
      }, output);
      return output;
    };
  }
];


},{}],13:[function(require,module,exports){
"use strict";
module.exports = angular.module("AppGyver.DataConfigurator.Providers", []).filter("agNoHiddenTemplates", require("./filters/agNoHiddenTemplates")).filter("agCanManage", require("./filters/agCanManage")).directive("agDataConfiguratorProviders", require("./directives/agDataConfiguratorProviders")).directive("agDataConfiguratorProviderDetails", require("./directives/agDataConfiguratorProviderDetails")).directive("agProviderAuthentication", require("./directives/agProviderAuthentication")).directive("agHeaders", require("./directives/agHeaders")).directive("agUrlSubstitutions", require("./directives/agUrlSubstitutions")).directive("agQueryParameters", require("./directives/agQueryParameters")).directive("agDataModel", require("./directives/agDataModel")).directive("agDataConfiguratorResourceDetails", require("./directives/agDataConfiguratorResourceDetails")).directive("agDataConfiguratorServiceDetails", require("./directives/agDataConfiguratorServiceDetails")).service("AgDataProviders", require("./services/AgDataProviders")).service("AgDataProvidersModal", require("./services/AgDataProvidersModal")).service("AgDataResources", require("./services/AgDataResources")).service("AgDataResourcesModal", require("./services/AgDataResourcesModal")).service("AgDataResourceActionsModal", require("./services/AgDataResourceActionsModal")).service("AgDataServices", require("./services/AgDataServices")).service("AgDataServicesModal", require("./services/AgDataServicesModal"));


},{"./directives/agDataConfiguratorProviderDetails":2,"./directives/agDataConfiguratorProviders":3,"./directives/agDataConfiguratorResourceDetails":4,"./directives/agDataConfiguratorServiceDetails":5,"./directives/agDataModel":6,"./directives/agHeaders":7,"./directives/agProviderAuthentication":8,"./directives/agQueryParameters":9,"./directives/agUrlSubstitutions":10,"./filters/agCanManage":11,"./filters/agNoHiddenTemplates":12,"./services/AgDataProviders":14,"./services/AgDataProvidersModal":15,"./services/AgDataResourceActionsModal":16,"./services/AgDataResources":17,"./services/AgDataResourcesModal":18,"./services/AgDataServices":19,"./services/AgDataServicesModal":20}],14:[function(require,module,exports){
"use strict";
module.exports = [
  "$rootScope", "Restangular", "AgDataSettings", function($rootScope, Restangular, AgDataSettings) {
    var _templates;
    _templates = void 0;

    /*
    Providers
     */
    this.allConfiguredProviders = function() {
      return Restangular.one("app", AgDataSettings.getApplicationId()).all("service_providers").getList();
    };
    this.save = function(provider) {
      if (!provider.uid) {
        return Restangular.one("app", AgDataSettings.getApplicationId()).all("service_providers").post(provider).then(function(data) {
          $rootScope.$broadcast("ag.data-configurator.provider.created", data);
          return data;
        });
      } else {
        return provider.put().then(function(data) {
          $rootScope.$broadcast("ag.data-configurator.provider.updated", data);
          return data;
        });
      }
    };
    this.destroy = function(provider) {
      return provider.remove().then(function() {
        return $rootScope.$broadcast("ag.data-configurator.provider.destroyed", provider.uid);
      });
    };

    /*
    Templates
     */
    this.allTemplates = function() {
      if (_templates !== void 0) {
        return _templates;
      }
      _templates = Restangular.all("available_service_providers").getList();
      return _templates;
    };
    this.getTemplate = function(uid) {
      return this.allTemplates().then(function(data) {
        var tpl, _i, _len;
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          tpl = data[_i];
          if (tpl.uid === uid) {
            return tpl;
          }
        }
      });
    };
    return this;
  }
];


},{}],15:[function(require,module,exports){
"use strict";
module.exports = [
  "$modal", "Restangular", "AgDataProviders", function($modal, Restangular, AgDataProviders) {
    var _openModal;
    _openModal = function(options) {
      var modalInstance;
      modalInstance = $modal.open({
        templateUrl: "/appgyver/data-configurator/providers/provider-modal.html",
        resolve: options.resolvables,
        windowClass: "ag__data-configurator__record-modal",
        controller: [
          "$scope", "$modalInstance", "template", "provider", function($scope, $modalInstance, template, provider) {

            /*
            Modal instance controller
             */
            $scope.template = angular.copy(template);
            $scope.provider = angular.copy(provider);
            $scope.isLoading = false;
            $scope.statusMessage = void 0;
            $scope.hasBeenDeleted = false;
            $scope.isNew = function() {
              return !$scope.provider.uid;
            };
            if ($scope.isNew()) {
              $scope.provider = {
                providerTypeId: $scope.template.uid,
                name: $scope.template.human_name,
                configurationKeys: {},
                headers: {},
                auth: "none"
              };
            }

            /*
            Modal methods
             */
            $scope.save = function() {
              if ($scope.isLoading) {
                return;
              }
              $scope.isLoading = true;
              $scope.statusMessage = {
                text: "Saving provider...",
                isInfo: true
              };
              return AgDataProviders.save($scope.provider).then(function(data) {
                if ($scope.isNew()) {
                  $modalInstance.dismiss("cancel");
                  return;
                }
                $scope.provider = Restangular.copy(data);
                return $scope.statusMessage = {
                  text: "The provider was saved.",
                  isSuccess: true
                };
              }, function(err) {
                return $scope.statusMessage = {
                  text: "Couldn't save the provider.",
                  additional: err.data,
                  isError: true
                };
              })["finally"](function() {
                return $scope.isLoading = false;
              });
            };
            $scope.remove = function() {
              if ($scope.isLoading || $scope.hasBeenDeleted || $scope.isNew()) {
                return;
              }
              $scope.isLoading = true;
              $scope.statusMessage = {
                text: "Removing provider...",
                isInfo: true
              };
              return AgDataProviders.destroy($scope.provider).then(function(data) {
                $modalInstance.dismiss("cancel");
                $scope.hasBeenDeleted = true;
                return $scope.statusMessage = {
                  text: "The provider was removed.",
                  isSuccess: true
                };
              }, function(err) {
                return $scope.statusMessage = {
                  text: "Couldn't remove the provider.",
                  additional: err.data,
                  isError: true
                };
              })["finally"](function() {
                return $scope.isLoading = false;
              });
            };
            return $scope.cancel = function() {
              return $modalInstance.dismiss("cancel");
            };
          }
        ]
      });
      return modalInstance.result;
    };
    this.manageProvider = function(template, provider) {
      var options;
      options = {
        resolvables: {
          template: function() {
            return template;
          },
          provider: function() {
            return provider;
          }
        }
      };
      return _openModal(options);
    };
    this.newProvider = function(template) {
      return this.manageProvider(template, {});
    };
    return this;
  }
];


},{}],16:[function(require,module,exports){
"use strict";
module.exports = [
  "$modal", "Restangular", "AgDataProviders", "AgDataResources", function($modal, Restangular, AgDataProviders, AgDataResources) {
    var _openModal;
    _openModal = function(options) {
      var modalInstance;
      modalInstance = $modal.open({
        templateUrl: "/appgyver/data-configurator/providers/resource-actions-modal.html",
        resolve: options.resolvables,
        windowClass: "ag__data-configurator__record-modal",
        controller: [
          "$scope", "$modalInstance", "template", "provider", "resource", function($scope, $modalInstance, template, provider, resource) {

            /*
            Modal instance controller
             */
            $scope.template = Restangular.copy(template);
            $scope.provider = Restangular.copy(provider);
            $scope.resource = Restangular.copy(resource);
            $scope.isLoading = false;
            $scope.statusMessage = void 0;
            $scope.availableActions = {
              "collection": {
                method: "GET",
                label: "Get collection",
                description: "«get collection» action allows you to load an array of records from the backend."
              },
              "find": {
                method: "GET",
                label: "Get",
                description: "«get» action allows you to load a single record from the backend."
              },
              "create": {
                method: "POST",
                label: "Post",
                description: "«post» action allows you to create a new record in the backend."
              },
              "update": {
                method: "PUT",
                label: "Put",
                description: "«put» action allows you to update an existing record in the backend."
              },
              "destroy": {
                method: "DELETE",
                label: "Delete",
                description: "«delete» action allows you to remove an existing record from the backend."
              }
            };
            $scope.selectedAction = "collection";
            $scope.selectAction = function(name) {
              return $scope.selectedAction = name;
            };
            $scope.getAction = function() {
              return $scope.resource.actions[$scope.selectedAction];
            };

            /*
            Modal methods
             */
            $scope.save = function() {
              if ($scope.isLoading) {
                return;
              }
              $scope.isLoading = true;
              $scope.statusMessage = {
                text: "Saving resource...",
                isInfo: true
              };
              return AgDataResources.save($scope.resource).then(function(data) {
                $scope.resource = Restangular.copy(data);
                return $scope.statusMessage = {
                  text: "The resource was saved.",
                  isSuccess: true
                };
              }, function(err) {
                return $scope.statusMessage = {
                  text: "Couldn't save the resource.",
                  additional: err.data,
                  isError: true
                };
              })["finally"](function() {
                return $scope.isLoading = false;
              });
            };
            return $scope.cancel = function() {
              return $modalInstance.dismiss("cancel");
            };
          }
        ]
      });
      return modalInstance.result;
    };
    this.manageResourceActions = function(template, provider, resource) {
      var options;
      options = {
        resolvables: {
          template: function() {
            return template;
          },
          provider: function() {
            return provider;
          },
          resource: function() {
            return resource;
          }
        }
      };
      return _openModal(options);
    };
    return this;
  }
];


},{}],17:[function(require,module,exports){
"use strict";
module.exports = [
  "$rootScope", "Restangular", "AgDataSettings", function($rootScope, Restangular, AgDataSettings) {

    /*
    Resources
     */
    this.allConfiguredResources = function(providerId) {
      return Restangular.one("app", AgDataSettings.getApplicationId()).one("service_providers", providerId).all("resources").getList();
    };
    this.save = function(resource) {
      if (!resource.uid) {
        return Restangular.one("app", AgDataSettings.getApplicationId()).one("service_providers", resource.serviceProviderUid).all("resources").post(resource).then(function(data) {
          $rootScope.$broadcast("ag.data-configurator.resource.created", data);
          return data;
        });
      } else {
        return resource.put().then(function(data) {
          $rootScope.$broadcast("ag.data-configurator.resource.updated", data);
          return data;
        });
      }
    };
    this.destroy = function(resource) {
      return resource.remove().then(function() {
        return $rootScope.$broadcast("ag.data-configurator.resource.destroyed", resource.uid);
      });
    };

    /*
    Resource columns
     */
    this.getColumnsFor = function(resource) {
      return Restangular.one("app", AgDataSettings.getApplicationId()).one("service_providers", resource.serviceProviderUid).one("resources", resource.uid).one("columns", "").get().then(function() {
        return Restangular.stripRestangular(data);
      });
    };
    return this;
  }
];


},{}],18:[function(require,module,exports){
"use strict";
module.exports = [
  "$modal", "Restangular", "AgDataProviders", "AgDataResources", function($modal, Restangular, AgDataProviders, AgDataResources) {
    var _openModal;
    _openModal = function(options) {
      var modalInstance;
      modalInstance = $modal.open({
        templateUrl: "/appgyver/data-configurator/providers/resource-modal.html",
        resolve: options.resolvables,
        windowClass: "ag__data-configurator__record-modal",
        controller: [
          "$scope", "$modalInstance", "template", "provider", "resource", function($scope, $modalInstance, template, provider, resource) {

            /*
            Modal instance controller
             */
            $scope.template = Restangular.copy(template);
            $scope.provider = Restangular.copy(provider);
            $scope.resource = Restangular.copy(resource);
            $scope.isLoading = false;
            $scope.statusMessage = void 0;
            $scope.hasBeenDeleted = false;
            $scope.isNew = function() {
              return !$scope.resource.uid;
            };
            if ($scope.isNew()) {
              $scope.resource = {
                name: "",
                path: "",
                columns: [],
                serviceProviderUid: $scope.provider.uid,
                identifierKey: "",
                actions: {
                  collection: {
                    path: "",
                    method: "GET",
                    queryParameters: [],
                    rootKeys: {
                      response: null,
                      request: null
                    }
                  },
                  find: {
                    path: "/{id}",
                    method: "GET",
                    queryParameters: [],
                    rootKeys: {
                      response: null,
                      request: null
                    }
                  },
                  create: {
                    path: "",
                    method: "POST",
                    queryParameters: [],
                    rootKeys: {
                      response: null,
                      request: null
                    }
                  },
                  update: {
                    path: "/{id}",
                    method: "PUT",
                    queryParameters: [],
                    rootKeys: {
                      response: null,
                      request: null
                    }
                  },
                  destroy: {
                    path: "/{id}",
                    method: "DELETE",
                    queryParameters: [],
                    rootKeys: {
                      response: null,
                      request: null
                    }
                  }
                }
              };
              if ($scope.template.default_resource_name && $scope.template.default_resource_name !== "") {
                $scope.resource.name = $scope.template.default_resource_name;
              }
              if ($scope.template.default_resource_path && $scope.template.default_resource_path !== "") {
                $scope.resource.path = $scope.template.default_resource_path;
              }
            }

            /*
            Modal methods
             */
            $scope.save = function() {
              if ($scope.isLoading) {
                return;
              }
              $scope.isLoading = true;
              $scope.statusMessage = {
                text: "Saving resource...",
                isInfo: true
              };
              return AgDataResources.save($scope.resource).then(function(data) {
                if ($scope.isNew()) {
                  $modalInstance.dismiss("cancel");
                  return;
                }
                $scope.resource = Restangular.copy(data);
                return $scope.statusMessage = {
                  text: "The resource was saved.",
                  isSuccess: true
                };
              }, function(err) {
                return $scope.statusMessage = {
                  text: "Couldn't save the resource.",
                  additional: err.data,
                  isError: true
                };
              })["finally"](function() {
                return $scope.isLoading = false;
              });
            };
            $scope.remove = function() {
              if ($scope.isLoading || $scope.hasBeenDeleted || $scope.isNew()) {
                return;
              }
              $scope.isLoading = true;
              $scope.statusMessage = {
                text: "Removing resource...",
                isInfo: true
              };
              return AgDataResources.destroy($scope.resource).then(function(data) {
                $modalInstance.dismiss("cancel");
                $scope.hasBeenDeleted = true;
                return $scope.statusMessage = {
                  text: "The resource was removed.",
                  isSuccess: true
                };
              }, function(err) {
                return $scope.statusMessage = {
                  text: "Couldn't remove the resource.",
                  additional: err.data,
                  isError: true
                };
              })["finally"](function() {
                return $scope.isLoading = false;
              });
            };
            return $scope.cancel = function() {
              return $modalInstance.dismiss("cancel");
            };
          }
        ]
      });
      return modalInstance.result;
    };
    this.manageResource = function(template, provider, resource) {
      var options;
      options = {
        resolvables: {
          template: function() {
            return template;
          },
          provider: function() {
            return provider;
          },
          resource: function() {
            return resource;
          }
        }
      };
      return _openModal(options);
    };
    this.newResource = function(template, provider) {
      return this.manageResource(template, provider, {});
    };
    return this;
  }
];


},{}],19:[function(require,module,exports){
"use strict";
module.exports = [
  "$rootScope", "Restangular", "AgDataSettings", function($rootScope, Restangular, AgDataSettings) {

    /*
    Services
     */
    this.allConfiguredServices = function(providerId) {
      return Restangular.one("app", AgDataSettings.getApplicationId()).one("service_providers", providerId).all("services").getList();
    };
    this.save = function(service) {
      if (!service.uid) {
        return Restangular.one("app", AgDataSettings.getApplicationId()).one("service_providers", service.serviceProviderUid).all("services").post(service).then(function(data) {
          $rootScope.$broadcast("ag.data-configurator.service.created", data);
          return data;
        });
      } else {
        return service.put().then(function(data) {
          $rootScope.$broadcast("ag.data-configurator.service.updated", data);
          return data;
        });
      }
    };
    this.destroy = function(service) {
      return service.remove().then(function() {
        return $rootScope.$broadcast("ag.data-configurator.service.destroyed", service.uid);
      });
    };

    /*
    Service columns
     */
    this.getColumnsFor = function(service) {
      return Restangular.one("app", AgDataSettings.getApplicationId()).one("service_providers", service.serviceProviderUid).one("services", service.uid).one("columns", "").get().then(function() {
        return Restangular.stripRestangular(data);
      });
    };
    return this;
  }
];


},{}],20:[function(require,module,exports){
"use strict";
module.exports = [
  "$modal", "Restangular", "AgDataProviders", "AgDataServices", function($modal, Restangular, AgDataProviders, AgDataServices) {
    var _openModal;
    _openModal = function(options) {
      var modalInstance;
      modalInstance = $modal.open({
        templateUrl: "/appgyver/data-configurator/providers/service-modal.html",
        resolve: options.resolvables,
        windowClass: "ag__data-configurator__record-modal",
        controller: [
          "$scope", "$modalInstance", "template", "provider", "service", function($scope, $modalInstance, template, provider, service) {

            /*
            Modal instance controller
             */
            $scope.template = Restangular.copy(template);
            $scope.provider = Restangular.copy(provider);
            $scope.service = Restangular.copy(service);
            $scope.isLoading = false;
            $scope.statusMessage = void 0;
            $scope.hasBeenDeleted = false;
            $scope.isNew = function() {
              return !$scope.service.uid;
            };
            if ($scope.isNew()) {
              $scope.service = {
                name: "",
                path: "",
                columns: [],
                serviceProviderUid: $scope.provider.uid,
                identifierKey: "",
                actions: {
                  collection: {
                    path: "",
                    method: "GET",
                    queryParameters: [],
                    rootKeys: {
                      response: null,
                      request: null
                    }
                  }
                }
              };
            }
            $scope.actionToMethod = {
              "collection": "GET",
              "create": "POST"
            };
            $scope.getCurrentActionName = function() {
              var actionDetails, actionName;
              return ((function() {
                var _ref, _results;
                _ref = $scope.service.actions;
                _results = [];
                for (actionName in _ref) {
                  actionDetails = _ref[actionName];
                  _results.push(actionName);
                }
                return _results;
              })())[0];
            };
            $scope.actionName = $scope.getCurrentActionName();
            $scope.setAction = function(newAction) {
              var oldAction;
              if ((newAction && $scope.actionName) && (newAction !== $scope.actionName) && ($scope.actionToMethod[newAction] != null)) {
                oldAction = $scope.getCurrentActionName();
                if (oldAction !== newAction) {
                  $scope.service.actions[newAction] = $scope.service.actions[oldAction];
                  $scope.service.actions[newAction].method = $scope.actionToMethod[newAction];
                  return delete $scope.service.actions[oldAction];
                }
              }
            };

            /*
            Modal methods
             */
            $scope.save = function() {
              if ($scope.isLoading) {
                return;
              }
              $scope.isLoading = true;
              $scope.statusMessage = {
                text: "Saving service...",
                isInfo: true
              };
              return AgDataServices.save($scope.service).then(function(data) {
                if ($scope.isNew()) {
                  $modalInstance.dismiss("cancel");
                  return;
                }
                $scope.service = Restangular.copy(data);
                return $scope.statusMessage = {
                  text: "The service was saved.",
                  isSuccess: true
                };
              }, function(err) {
                return $scope.statusMessage = {
                  text: "Couldn't save the service.",
                  additional: err.data,
                  isError: true
                };
              })["finally"](function() {
                return $scope.isLoading = false;
              });
            };
            $scope.remove = function() {
              if ($scope.isLoading || $scope.hasBeenDeleted || $scope.isNew()) {
                return;
              }
              $scope.isLoading = true;
              $scope.statusMessage = {
                text: "Removing service...",
                isInfo: true
              };
              return AgDataServices.destroy($scope.service).then(function(data) {
                $modalInstance.dismiss("cancel");
                $scope.hasBeenDeleted = true;
                return $scope.statusMessage = {
                  text: "The service was removed.",
                  isSuccess: true
                };
              }, function(err) {
                return $scope.statusMessage = {
                  text: "Couldn't remove the service.",
                  additional: err.data,
                  isError: true
                };
              })["finally"](function() {
                return $scope.isLoading = false;
              });
            };
            return $scope.cancel = function() {
              return $modalInstance.dismiss("cancel");
            };
          }
        ]
      });
      return modalInstance.result;
    };
    this.manageService = function(template, provider, service) {
      var options;
      options = {
        resolvables: {
          template: function() {
            return template;
          },
          provider: function() {
            return provider;
          },
          service: function() {
            return service;
          }
        }
      };
      return _openModal(options);
    };
    this.newService = function(template, provider) {
      return this.manageService(template, provider, {});
    };
    return this;
  }
];


},{}],21:[function(require,module,exports){
angular.module('AppGyver.DataConfigurator').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/appgyver/data-configurator/providers/authentication.html',
    "<div class=\"form-group\">\n" +
    "  <label for=\"ProviderAuthenticationInput\">Authentication:</label>\n" +
    "  <div class=\"form-control-select\" ng-if=\"canChangeType\">\n" +
    "    <select id=\"ProviderBaseUrlInput\" ng-model=\"provider.auth\" ng-options=\"k as s.label for (k, s) in authTypes\"></select>\n" +
    "  </div>\n" +
    "  <div ng-if=\"authTypes[provider.auth].fields && authTypes[provider.auth].fields.length > 0\">\n" +
    "    <br>\n" +
    "    <div class=\"well\">\n" +
    "      <div class=\"form-group\" ng-repeat=\"field in authTypes[provider.auth].fields\">\n" +
    "        <label for=\"ProviderAuthenticationInput_{{field.label}}\">{{field.label}}:</label>\n" +
    "        <input ng-model=\"provider.configurationKeys[field.key]\" type=\"text\" class=\"form-control\" id=\"ProviderAuthenticationInput_{{field.label}}\" placeholder=\"\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/appgyver/data-configurator/providers/data-model.html',
    "<table class=\"table table-striped full-width ag__form\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th ng-if=\"identifierKeyEditable\"><abbr title=\"\" tooltip=\"Set a column to be used as the unique identifier\">ID</abbr></th>\n" +
    "      <th><div style=\"min-width: 120px !important;\">Name</div></th>\n" +
    "      <th><div style=\"width: 120px !important;\">Type</div></th>\n" +
    "      <th>Required?</th>\n" +
    "      <th>Example data</th>\n" +
    "      <th class=\"action-button-container\" ng-if=\"columnsEditable\"></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"column in columns | orderBy:'name'\">\n" +
    "      <td ng-if=\"identifierKeyEditable\"><input type=\"radio\" name=\"identifierKey\" ng-change=\"setIdentifierKey(identifierKey)\" ng-model=\"identifierKey\" ng-value=\"column.name\"></td>\n" +
    "      <td>{{column.name}}</td>\n" +
    "      <td>{{column.type}}</td>\n" +
    "      <td>{{column.required ? 'yes' : 'no'}}</td>\n" +
    "      <td>{{column.example_value}}</td>\n" +
    "      <td class=\"action-button-container\" ng-if=\"columnsEditable\"><button type=\"button\" class=\"btn btn-danger\" ng-click=\"removeByName(column.name)\"><span class=\"glyphicon glyphicon-remove\"></span></button></td>\n" +
    "    </tr>\n" +
    "    <tr ng-if=\"columnsEditable\">\n" +
    "      <td ng-if=\"identifierKeyEditable\"></td>\n" +
    "      <td><input type=\"text\" class=\"form-control\" ng-model=\"temp.name\" placeholder=\"Name...\"></td>\n" +
    "      <td>\n" +
    "        <div class=\"form-control-select\">\n" +
    "          <select ng-model=\"temp.type\" ng-options=\"x for x in availableTypes\"></select>\n" +
    "        </div>\n" +
    "      </td>\n" +
    "      <td><input type=\"checkbox\" class=\"form-control\" ng-model=\"temp.required\"></td>\n" +
    "      <td></td>\n" +
    "      <td class=\"action-button-container\"><button type=\"button\" class=\"btn btn-primary\" ng-click=\"add()\" ng-disabled=\"!canAdd()\"><span class=\"glyphicon glyphicon-ok\"></span></button></td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>"
  );


  $templateCache.put('/appgyver/data-configurator/providers/headers.html',
    "<div class=\"form-group\">\n" +
    "  <label>Headers:</label>\n" +
    "  <small class=\"text-muted\" ng-if=\"forResource\">Note: these headers will replace any headers from the provider with the same name.</small>\n" +
    "\n" +
    "  <table class=\"table table-striped keep-compact full-width\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th>Name</th>\n" +
    "        <th>Value</th>\n" +
    "        <th class=\"action-button-container\"></th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <!-- List headers -->\n" +
    "      <tr ng-repeat=\"(name, value) in headers | orderBy:'name'\">\n" +
    "        <td>{{name}}</td>\n" +
    "        <td>{{value}}</td>\n" +
    "        <td class=\"action-button-container\"><button type=\"button\" class=\"btn btn-danger\" ng-click=\"removeHeader(name)\"><span class=\"glyphicon glyphicon-remove\"></span></button></td>\n" +
    "      </tr>\n" +
    "      <!-- Header adder -->\n" +
    "      <tr>\n" +
    "        <td><input type=\"text\" class=\"form-control\" ng-model=\"temp.name\" placeholder=\"Name...\"></td>\n" +
    "        <td><input type=\"text\" class=\"form-control\" ng-model=\"temp.value\" placeholder=\"Value...\"></td>\n" +
    "        <td class=\"action-button-container\"><button type=\"button\" class=\"btn btn-primary\" ng-click=\"addHeader()\" ng-disabled=\"!canAddHeader()\"><span class=\"glyphicon glyphicon-ok\"></span></button></td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/appgyver/data-configurator/providers/provider-details.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-12\">\n" +
    "\n" +
    "    <!-- Header -->\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-xs-12 clearfix\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary pull-right\" style=\"margin-top: 20px;\" ng-click=\"manageProvider()\" ng-disabled=\"!providerTemplate\">Manage provider</button>\n" +
    "        <h2>{{provider.name}} <small>(provider)</small></h2>\n" +
    "        <hr>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Resources -->\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-xs-12\">\n" +
    "        <br>\n" +
    "        <h3 style=\"margin-bottom: 0px;\">Resources</h3>\n" +
    "        <small class=\"text-muted\">Resources are databases or collections of data in the backend.</small>\n" +
    "        <br><br>\n" +
    "\n" +
    "        <div class=\"alert alert-info\" ng-if=\"resourcesMeta.loading\">\n" +
    "          <ag-ui-spinner size=\"22\" color=\"white\" style=\"vertical-align: top;\"></ag-ui-spinner><span style=\"display: inline-block; margin-left: 10px; vertical-align: top;\">Loading configured resources.</span>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"alert alert-danger\" ng-if=\"!resourcesMeta.loading && resourcesMeta.error\">\n" +
    "          <b>Oops!</b> Couldn't get resources.\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"list-group\" ng-if=\"!resourcesMeta.loading && !resourcesMeta.error\">\n" +
    "          <a class=\"list-group-item\" ng-click=\"navigation.showResource(resource)\" ng-repeat=\"resource in resources | orderBy:'name'\">\n" +
    "            <div class=\"row\">\n" +
    "              <div class=\"col-xs-12\">\n" +
    "                <h3 style=\"margin-top: 0px; margin-bottom: 4px;\">{{resource.name}}</h3>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"newResource()\" ng-disabled=\"!providerTemplate || resourcesMeta.loading || resourcesMeta.error\">Add new resource</button>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Services -->\n" +
    "\n" +
    "    <div class=\"row\" ng-if=\"providerTemplate && providerTemplate.uid==1\">\n" +
    "      <div class=\"col-xs-12\">\n" +
    "        <br><br>\n" +
    "        <h3 style=\"margin-bottom: 0px;\">Services</h3>\n" +
    "        <small class=\"text-muted\">Services are API services that can be invoked in your app, such as sending SMS via an API.</small>\n" +
    "        <br><br>\n" +
    "\n" +
    "        <div class=\"alert alert-info\" ng-if=\"servicesMeta.loading\">\n" +
    "          <ag-ui-spinner size=\"22\" color=\"white\" style=\"vertical-align: top;\"></ag-ui-spinner><span style=\"display: inline-block; margin-left: 10px; vertical-align: top;\">Loading configured services.</span>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"alert alert-danger\" ng-if=\"!servicesMeta.loading && servicesMeta.error\">\n" +
    "          <b>Oops!</b> Couldn't get services.\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"list-group\" ng-if=\"!servicesMeta.loading && !servicesMeta.error\">\n" +
    "          <a class=\"list-group-item\" ng-click=\"navigation.showService(service)\" ng-repeat=\"service in services | orderBy:'name'\">\n" +
    "            <div class=\"row\">\n" +
    "              <div class=\"col-xs-12\">\n" +
    "                <h3 style=\"margin-top: 0px; margin-bottom: 4px;\">{{service.name}}</h3>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"newService()\" ng-disabled=\"!providerTemplate || servicesMeta.loading || servicesMeta.error\">Add new service</button>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/appgyver/data-configurator/providers/provider-modal.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\" ng-if=\"isNew()\">New {{template.human_name}} backend</h3>\n" +
    "  <h3 class=\"modal-title\" ng-if=\"!isNew()\">{{provider.name}}</h3>\n" +
    "  <small><b>Provider ID:</b> {{provider.uid || '&laquo;new&raquo;'}}</small>\n" +
    "  <br>\n" +
    "  <small><b>Provider type:</b> {{template.human_name}}</small>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "  <div ng-if=\"statusMessage\">\n" +
    "    <div class=\"alert\" ng-class=\"{'alert-success': statusMessage.isSuccess, 'alert-danger': statusMessage.isError, 'alert-info': statusMessage.isInfo}\">\n" +
    "      <div>\n" +
    "        <ag-ui-spinner size=\"22\" color=\"white\" style=\"vertical-align: top;\" ng-if=\"statusMessage.isInfo\" style=\"margin-right: 10px;\"></ag-ui-spinner>\n" +
    "        <span style=\"display: inline-block; vertical-align: top;\">{{statusMessage.text}}</span>\n" +
    "      </div>\n" +
    "      <ul ng-if=\"statusMessage.additional\">\n" +
    "        <li ng-repeat=\"additionalInfo in statusMessage.additional\">\n" +
    "          <small>{{additionalInfo}}</small>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <form class=\"ag__form\" ng-if=\"!hasBeenDeleted\">\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"ProviderNameInput\">Name:</label>\n" +
    "      <input ng-model=\"provider.name\" type=\"text\" class=\"form-control\" id=\"ProviderNameInput\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-if=\"template | agCanManage:'provider_base_url'\">\n" +
    "      <label for=\"ProviderBaseUrlInput\">Base URL:</label>\n" +
    "      <input ng-model=\"provider.baseUrl\" type=\"text\" class=\"form-control\" id=\"ProviderBaseUrlInput\" placeholder=\"http://example.com/api\">\n" +
    "    </div>\n" +
    "\n" +
    "    <ag-provider-authentication can-change-type=\"true\" ng-if=\"template | agCanManage:'provider_authentication'\"></ag-provider-authentication>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"{'has-error': providerForm[field.name].$invalid}\" ng-repeat=\"field in template.keys\">\n" +
    "      <label for=\"ProviderCustomInput_{{field.name}}\">{{field.human_name}}</label>\n" +
    "      <input ng-required=\"field.required\" ag-name=\"field.name\" ng-model=\"provider.configurationKeys[field.name]\" type=\"text\" class=\"form-control\" id=\"ProviderCustomInput_{{field.name}}\" placeholder=\"\">\n" +
    "    </div>\n" +
    "\n" +
    "    <ag-headers headers=\"provider.headers\" for-resource=\"{{false}}\" ng-if=\"template | agCanManage:'provider_headers'\"></ag-headers>\n" +
    "\n" +
    "  </form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button ng-disabled=\"isLoading\" class=\"btn btn-danger pull-left\" ng-click=\"remove()\" ng-if=\"!hasBeenDeleted && !isNew()\">Remove provider</button>\n" +
    "  <button ng-disabled=\"isLoading\" class=\"btn btn-primary\" ng-click=\"save()\" ng-if=\"!hasBeenDeleted && isNew()\">Create provider</button>\n" +
    "  <button ng-disabled=\"isLoading\" class=\"btn btn-primary\" ng-click=\"save()\" ng-if=\"!hasBeenDeleted && !isNew()\">Update provider</button>\n" +
    "  <button ng-disabled=\"isLoading\" class=\"btn btn-default\" ng-click=\"cancel()\">Close</button>\n" +
    "</div>"
  );


  $templateCache.put('/appgyver/data-configurator/providers/providers.html',
    "<div class=\"row\">\n" +
    "\n" +
    "  <div class=\"col-xs-12\">\n" +
    "    <h3 style=\"margin-bottom: 0px;\">Configured providers</h3>\n" +
    "    <small class=\"text-muted\">Manage existing app backends by clicking on them below.</small>\n" +
    "    <br><br>\n" +
    "    <div class=\"alert alert-info\" ng-if=\"providersMeta.loading\">\n" +
    "      <ag-ui-spinner size=\"22\" color=\"white\" style=\"vertical-align: top;\"></ag-ui-spinner><span style=\"display: inline-block; margin-left: 10px; vertical-align: top;\">Loading data providers.</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"alert alert-danger\" ng-if=\"!providersMeta.loading && providersMeta.error\">\n" +
    "      <b>Oops!</b> Couldn't get providers.\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-danger\" ng-if=\"!providersMeta.loading && !providersMeta.error && providers.length == 0\">\n" +
    "      <p>You haven't configured any backends yet. <br class=\"hidden-xs hidden-sm\">Choose a provider below to add it to your app.</p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"list-group\" ng-if=\"!providersMeta.loading && !providersMeta.error && providers.length > 0\">\n" +
    "      <a class=\"list-group-item provider-list-item\" ng-click=\"navigation.showProvider(provider)\" ng-repeat=\"provider in providers | orderBy:'name'\">\n" +
    "        <div class=\"row\">\n" +
    "          <div class=\"col-sm-2\">\n" +
    "            <div class=\"provider-logo-container\">\n" +
    "              <img ng-src=\"//s3.amazonaws.com/appgyver.assets/product-assets/ag-data-configurator/images/backend_providers/{{provider.providerTypeId}}.png\" alt=\"\">\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"col-sm-9 provider-details-container\">\n" +
    "            <h3 class=\"provider-list-name\">{{provider.name}}</h3>\n" +
    "          </div>\n" +
    "          <div class=\"col-sm-1 text-right\">\n" +
    "            <span class=\"glyphicon glyphicon-chevron-right provider-chevron\"></span>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-xs-12\">\n" +
    "    <br>\n" +
    "    <h3 style=\"margin-bottom: 0px;\">Available providers</h3>\n" +
    "    <small class=\"text-muted\">Click on the backend providers to configure one for your application.</small>\n" +
    "    <br><br>\n" +
    "    <div class=\"alert alert-info\" ng-if=\"providerTemplatesMeta.loading\">\n" +
    "      <ag-ui-spinner size=\"22\" color=\"white\" style=\"vertical-align: top;\"></ag-ui-spinner><span style=\"display: inline-block; margin-left: 10px; vertical-align: top;\">Loading list of available providers.</span>\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-danger\" ng-if=\"!providerTemplatesMeta.loading && providerTemplatesMeta.error\">\n" +
    "      <b>Oops!</b> Couldn't get provider templates.\n" +
    "    </div>\n" +
    "    <div class=\"list-group\" ng-if=\"!providerTemplatesMeta.loading && !providerTemplatesMeta.error\">\n" +
    "      <a class=\"list-group-item provider-list-item\" ng-click=\"newProvider(providerTemplate)\" ng-repeat=\"providerTemplate in providerTemplates | agNoHiddenTemplates\">\n" +
    "        <div class=\"row\">\n" +
    "          <div class=\"col-sm-2\">\n" +
    "            <div class=\"provider-logo-container\">\n" +
    "              <img ng-src=\"//s3.amazonaws.com/appgyver.assets/product-assets/ag-data-configurator/images/backend_providers/{{providerTemplate.uid}}.png\" alt=\"\">\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"col-sm-9 provider-details-container\">\n" +
    "            <h3 class=\"provider-list-name\">{{providerTemplate.human_name}}</h3>\n" +
    "            <p>{{providerTemplate.description}}</p>\n" +
    "          </div>\n" +
    "          <div class=\"col-sm-1 text-right\">\n" +
    "            <span class=\"glyphicon glyphicon-chevron-right provider-chevron\"></span>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/appgyver/data-configurator/providers/query-parameters.html',
    "<table class=\"table table-striped keep-compact full-width\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th>Name</th>\n" +
    "      <th>Default</th>\n" +
    "      <th style=\"width: 56px;\"><abbr title=\"Required?\">Req?</abbr></th>\n" +
    "      <th class=\"action-button-container\"></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <!-- List headers -->\n" +
    "    <tr ng-repeat=\"queryParameter in queryParameters | orderBy:'name'\">\n" +
    "      <td>{{queryParameter.name}}</td>\n" +
    "      <td>{{queryParameter.default}}</td>\n" +
    "      <td>{{queryParameter.required ? 'yes' : 'no'}}</td>\n" +
    "      <td class=\"action-button-container\"><button type=\"button\" class=\"btn btn-danger\" ng-click=\"removeByName(queryParameter.name)\"><span class=\"glyphicon glyphicon-remove\"></span></button></td>\n" +
    "    </tr>\n" +
    "    <!-- Header adder -->\n" +
    "    <tr>\n" +
    "      <td><input type=\"text\" class=\"form-control\" ng-model=\"temp.name\" placeholder=\"Name...\"></td>\n" +
    "      <td><input type=\"text\" class=\"form-control\" ng-model=\"temp.default\" placeholder=\"Default...\"></td>\n" +
    "      <td><input type=\"checkbox\" class=\"form-control\" ng-model=\"temp.required\"></td>\n" +
    "      <td class=\"action-button-container\"><button type=\"button\" class=\"btn btn-primary\" ng-click=\"add()\" ng-disabled=\"!canAdd()\"><span class=\"glyphicon glyphicon-ok\"></span></button></td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>"
  );


  $templateCache.put('/appgyver/data-configurator/providers/resource-actions-modal.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">{{resource.name}}</h3>\n" +
    "  <small>Managing actions</small>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "  <div ng-if=\"statusMessage\">\n" +
    "    <div class=\"alert\" ng-class=\"{'alert-success': statusMessage.isSuccess, 'alert-danger': statusMessage.isError, 'alert-info': statusMessage.isInfo}\">\n" +
    "      <div>\n" +
    "        <ag-ui-spinner size=\"22\" color=\"white\" style=\"vertical-align: top;\" ng-if=\"statusMessage.isInfo\" style=\"margin-right: 10px;\"></ag-ui-spinner>\n" +
    "        <span style=\"display: inline-block; vertical-align: top;\">{{statusMessage.text}}</span>\n" +
    "      </div>\n" +
    "      <ul ng-if=\"statusMessage.additional\">\n" +
    "        <li ng-repeat=\"additionalInfo in statusMessage.additional\">\n" +
    "          <small>{{additionalInfo}}</small>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <ul class=\"nav nav-pills\">\n" +
    "    <li ng-class=\"{'active': selectedAction == actionName}\" ng-repeat=\"(actionName, actionMeta) in availableActions\">\n" +
    "      <a ng-click=\"selectAction(actionName)\">{{actionMeta.label}}</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "  <br>\n" +
    "\n" +
    "  <div class=\"well\">{{availableActions[selectedAction].description}}</div>\n" +
    "\n" +
    "  <form class=\"ag__form\">\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"ActionPathInput\">URL path:</label>\n" +
    "      <small class=\"text-muted\">{{provider.baseUrl}}{{resource.path}}{{getAction().path}}<br>(the {id} will be replaced with resource's unique identifier)</small>\n" +
    "      <input ng-model=\"getAction().path\" type=\"text\" class=\"form-control\" id=\"ActionPathInput\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label>Root keys:</label>\n" +
    "      <small class=\"text-muted\">If your desired data is nested under a certain property (eg. \"data\", \"results\"), you can set that property as the root key here for requests and responses individually.</small>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-xs-3\">Response:</div>\n" +
    "        <div class=\"col-xs-9\"><input ng-model=\"getAction().rootKeys.response\" type=\"text\" class=\"form-control\" id=\"ActionRootkeyResponseInput\"></div>\n" +
    "      </div>\n" +
    "      <div class=\"row\" style=\"margin-top: 10px;\">\n" +
    "        <div class=\"col-xs-3\">Request:</div>\n" +
    "        <div class=\"col-xs-9\"><input ng-model=\"getAction().rootKeys.request\" type=\"text\" class=\"form-control\" id=\"ActionRootkeyRequestInput\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label>Query parameters:</label>\n" +
    "      <ag-query-parameters query-parameters=\"getAction().queryParameters\"></ag-query-parameters>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label>URL substitutions:</label>\n" +
    "      <small class=\"text-muted\">URL subsitutions can be used in resource path by wrapping the name in curly brackets, like {id}. Note, that {id} is automatically repalced with resource's unique identifier.</small>\n" +
    "      <ag-url-substitutions url-substitutions=\"getAction().urlSubstitutions\"></ag-url-substitutions>\n" +
    "    </div>\n" +
    "\n" +
    "    <ag-headers headers=\"getAction().headers\" for-resource=\"{{true}}\"></ag-headers>\n" +
    "\n" +
    "  </form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button ng-disabled=\"isLoading\" class=\"btn btn-primary\" ng-click=\"save()\">Update resource</button>\n" +
    "  <button ng-disabled=\"isLoading\" class=\"btn btn-default\" ng-click=\"cancel()\">Close</button>\n" +
    "</div>"
  );


  $templateCache.put('/appgyver/data-configurator/providers/resource-details.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-12\">\n" +
    "\n" +
    "    <!-- Header -->\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-xs-12 clearfix\">\n" +
    "        <div class=\"pull-right\" style=\"margin-top: 20px;\">\n" +
    "          <button type=\"button\" ng-if=\"(providerTemplate | agCanManage:'resource_methods')\" class=\"btn btn-default\" ng-click=\"manageResourceActions()\" style=\"margin-right: 10px;\" ng-disabled=\"!providerTemplate\">Customize actions</button>\n" +
    "          <button type=\"button\" class=\"btn btn-primary\" ng-click=\"manageResource()\" ng-disabled=\"!providerTemplate\">Manage resource</button>\n" +
    "        </div>\n" +
    "        <h2>{{resource.name}} <small>(resource)</small></h2>\n" +
    "        <hr>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Columns -->\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-xs-12\">\n" +
    "        <br>\n" +
    "        <div class=\"clearfix\">\n" +
    "          <div class=\"pull-right\" style=\"margin-top: 26px;\">\n" +
    "            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"fetchColumns()\" ng-disabled=\"columnsMeta.loading || columnsSaving\" style=\"margin-right: 10px;\">Reload model from API</button>\n" +
    "            <button type=\"button\" class=\"btn btn-success\" ng-click=\"saveColumns()\" ng-if=\"(providerTemplate | agCanManage:'resource_columns_edit')\" ng-disabled=\"columnsMeta.loading || columnsSaving\">Save changes to data model</button>\n" +
    "          </div>\n" +
    "          <h3 style=\"margin-bottom: 0px;\">Data model</h3>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-8\" ng-if=\"!hadColumnsToBeginWith && (providerTemplate | agCanManage:'resource_methods')\">\n" +
    "        <small class=\"text-muted\">This seems to be a new or partially configured resource. If there is an error or the response isn't quite what you expected, try configuring the resource method details with \"customize actions\" above. There you can configure query parameters, root keys and headers for each individual action.</small>\n" +
    "      </div>\n" +
    "      <div class=\"col-xs-12\">\n" +
    "        <br>\n" +
    "\n" +
    "        <div class=\"alert alert-info\" ng-if=\"columnsMeta.loading\">\n" +
    "          <ag-ui-spinner size=\"22\" color=\"white\" style=\"vertical-align: top;\"></ag-ui-spinner><span style=\"display: inline-block; margin-left: 10px; vertical-align: top;\">Loading resource data model.</span>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"alert alert-danger\" ng-if=\"!columnsMeta.loading && columnsMeta.error\">\n" +
    "          <b>Oops!</b> Unable to load resource's data model.\n" +
    "          <ul>\n" +
    "            <li><small>Is provider's base URL and resource's URL path (Class UID) are correct?</small></li>\n" +
    "            <li><small>Have you added the necessary authentication details to provider?</small></li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "\n" +
    "        <ag-data-model columns=\"columns\" columns-editable=\"{{providerTemplate && (providerTemplate | agCanManage:'resource_columns_edit')}}\" identifier-key=\"resource.identifierKey\" identifier-key-editable=\"{{providerTemplate && (providerTemplate | agCanManage:'resource_identifier_key')}}\" ng-if=\"!columnsMeta.loading && (!columnsMeta.error || (providerTemplate | agCanManage:'resource_columns_edit'))\"></ag-data-model>\n" +
    "\n" +
    "      </div>\n" +
    "      <div class=\"col-xs-12\">\n" +
    "        <div class=\"clearfix\">\n" +
    "          <div class=\"pull-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-success\" ng-click=\"saveColumns()\" ng-if=\"(providerTemplate | agCanManage:'resource_columns_edit')\" ng-disabled=\"columnsMeta.loading || columnsSaving\">Save changes to data model</button>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/appgyver/data-configurator/providers/resource-modal.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\" ng-if=\"isNew()\">New resource for {{provider.name}}</h3>\n" +
    "  <h3 class=\"modal-title\" ng-if=\"!isNew()\">{{resource.name}}</h3>\n" +
    "  <small><b>Resource ID:</b> {{resource.uid || '&laquo;new&raquo;'}}</small>\n" +
    "  <br>\n" +
    "  <small><b>Provider:</b> {{provider.name}} ({{template.human_name}})</small>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "  <div ng-if=\"statusMessage\">\n" +
    "    <div class=\"alert\" ng-class=\"{'alert-success': statusMessage.isSuccess, 'alert-danger': statusMessage.isError, 'alert-info': statusMessage.isInfo}\">\n" +
    "      <div>\n" +
    "        <ag-ui-spinner size=\"22\" color=\"white\" style=\"vertical-align: top;\" ng-if=\"statusMessage.isInfo\" style=\"margin-right: 10px;\"></ag-ui-spinner>\n" +
    "        <span style=\"display: inline-block; vertical-align: top;\">{{statusMessage.text}}</span>\n" +
    "      </div>\n" +
    "      <ul ng-if=\"statusMessage.additional\">\n" +
    "        <li ng-repeat=\"additionalInfo in statusMessage.additional\">\n" +
    "          <small>{{additionalInfo}}</small>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <form class=\"ag__form\" ng-if=\"!hasBeenDeleted\">\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"ResourceNameInput\">Name:</label>\n" +
    "      <input ng-model=\"resource.name\" type=\"text\" class=\"form-control\" id=\"ResourceNameInput\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-if=\"(template | agCanManage:'resource_path') && template.uid==1\">\n" +
    "      <label for=\"ResourcePathInput\">URL path:</label>\n" +
    "      <small class=\"text-muted\">{{provider.baseUrl}}{{resource.path}}</small>\n" +
    "      <input ng-model=\"resource.path\" type=\"text\" class=\"form-control\" id=\"ResourcePathInput\" placeholder=\"car\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-if=\"(template | agCanManage:'resource_path') && template.uid!=1\">\n" +
    "      <label for=\"ResourcePathInput\">Class UID:</label>\n" +
    "      <input ng-model=\"resource.path\" type=\"text\" class=\"form-control\" id=\"ResourcePathInput\" placeholder=\"Car\">\n" +
    "    </div>\n" +
    "\n" +
    "  </form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button ng-disabled=\"isLoading\" class=\"btn btn-danger pull-left\" ng-click=\"remove()\" ng-if=\"!hasBeenDeleted && !isNew()\">Remove resource</button>\n" +
    "  <button ng-disabled=\"isLoading\" class=\"btn btn-primary\" ng-click=\"save()\" ng-if=\"!hasBeenDeleted && isNew()\">Create resource</button>\n" +
    "  <button ng-disabled=\"isLoading\" class=\"btn btn-primary\" ng-click=\"save()\" ng-if=\"!hasBeenDeleted && !isNew()\">Update resource</button>\n" +
    "  <button ng-disabled=\"isLoading\" class=\"btn btn-default\" ng-click=\"cancel()\">Close</button>\n" +
    "</div>"
  );


  $templateCache.put('/appgyver/data-configurator/providers/service-details.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-12\">\n" +
    "\n" +
    "    <!-- Header -->\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-xs-12 clearfix\">\n" +
    "        <div class=\"pull-right\" style=\"margin-top: 20px;\">\n" +
    "          <button type=\"button\" class=\"btn btn-success\" ng-click=\"saveService()\" ng-disabled=\"saving\" style=\"margin-right: 10px;\">Save changes to service</button>\n" +
    "          <button type=\"button\" class=\"btn btn-primary\" ng-click=\"manageService()\" ng-disabled=\"saving || !providerTemplate\">Service settings</button>\n" +
    "        </div>\n" +
    "        <h2>{{service.name}} <small>(service)</small></h2>\n" +
    "        <hr>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Status -->\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-xs-12\">\n" +
    "        <div class=\"alert alert-info\" ng-if=\"saving\">\n" +
    "          <ag-ui-spinner size=\"22\" color=\"white\" style=\"vertical-align: top;\"></ag-ui-spinner><span style=\"display: inline-block; margin-left: 10px; vertical-align: top;\">Saving changes to service..</span>\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-danger\" ng-if=\"!saving && saveError\">\n" +
    "          <b>Oops!</b> Unable to save changes to service.\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Query parameters -->\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-xs-12\">\n" +
    "        <br>\n" +
    "        <div class=\"clearfix\">\n" +
    "          <h3 style=\"margin-bottom: 0px;\">Query parameters</h3>\n" +
    "        </div>\n" +
    "        <br>\n" +
    "        <ag-query-parameters query-parameters=\"getAction().queryParameters\"></ag-query-parameters>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Columns -->\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-xs-12\">\n" +
    "        <br>\n" +
    "        <div class=\"clearfix\">\n" +
    "          <h3 style=\"margin-bottom: 0px;\">Request body</h3>\n" +
    "        </div>\n" +
    "        <br>\n" +
    "        <ag-data-model columns=\"service.columns\" editable=\"{{true}}\"></ag-data-model>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- URL substitutions -->\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-xs-12\">\n" +
    "        <br>\n" +
    "        <div class=\"clearfix\">\n" +
    "          <h3 style=\"margin-bottom: 0px;\">URL substitutions</h3>\n" +
    "        </div>\n" +
    "        <br>\n" +
    "        <ag-url-substitutions url-substitutions=\"getAction().urlSubstitutions\"></ag-url-substitutions>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/appgyver/data-configurator/providers/service-modal.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\" ng-if=\"isNew()\">New service for {{provider.name}}</h3>\n" +
    "  <h3 class=\"modal-title\" ng-if=\"!isNew()\">{{service.name}}</h3>\n" +
    "  <small><b>Service ID:</b> {{service.uid || '&laquo;new&raquo;'}}</small>\n" +
    "  <br>\n" +
    "  <small><b>Provider:</b> {{provider.name}} ({{template.human_name}})</small>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "  <div ng-if=\"statusMessage\">\n" +
    "    <div class=\"alert\" ng-class=\"{'alert-success': statusMessage.isSuccess, 'alert-danger': statusMessage.isError, 'alert-info': statusMessage.isInfo}\">\n" +
    "      <div>\n" +
    "        <ag-ui-spinner size=\"22\" color=\"white\" style=\"vertical-align: top;\" ng-if=\"statusMessage.isInfo\" style=\"margin-right: 10px;\"></ag-ui-spinner>\n" +
    "        <span style=\"display: inline-block; vertical-align: top;\">{{statusMessage.text}}</span>\n" +
    "      </div>\n" +
    "      <ul ng-if=\"statusMessage.additional\">\n" +
    "        <li ng-repeat=\"additionalInfo in statusMessage.additional\">\n" +
    "          <small>{{additionalInfo}}</small>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <form class=\"ag__form\" ng-if=\"!hasBeenDeleted\">\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"ServiceNameInput\">Name:</label>\n" +
    "      <input ng-model=\"service.name\" type=\"text\" class=\"form-control\" id=\"ServiceNameInput\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"ServicePathInput\">URL path:</label>\n" +
    "      <small class=\"text-muted\">{{provider.baseUrl}}{{service.path}}</small>\n" +
    "      <input ng-model=\"service.path\" type=\"text\" class=\"form-control\" id=\"ServicePathInput\" placeholder=\"car\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"ServiceNameInput\">Service method:</label>\n" +
    "      <div class=\"form-control-select\">\n" +
    "        <select ng-change=\"setAction(actionName)\" ng-model=\"actionName\" ng-options=\"action as method for (action, method) in actionToMethod\"></select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <ag-headers headers=\"service.headers\" for-resource=\"{{true}}\"></ag-headers>\n" +
    "\n" +
    "  </form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button ng-disabled=\"isLoading\" class=\"btn btn-danger pull-left\" ng-click=\"remove()\" ng-if=\"!hasBeenDeleted && !isNew()\">Remove service</button>\n" +
    "  <button ng-disabled=\"isLoading\" class=\"btn btn-primary\" ng-click=\"save()\" ng-if=\"!hasBeenDeleted && isNew()\">Create service</button>\n" +
    "  <button ng-disabled=\"isLoading\" class=\"btn btn-primary\" ng-click=\"save()\" ng-if=\"!hasBeenDeleted && !isNew()\">Update service</button>\n" +
    "  <button ng-disabled=\"isLoading\" class=\"btn btn-default\" ng-click=\"cancel()\">Close</button>\n" +
    "</div>"
  );


  $templateCache.put('/appgyver/data-configurator/providers/url-substitutions.html',
    "<table class=\"table table-striped keep-compact full-width\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th>Name</th>\n" +
    "      <th>Default</th>\n" +
    "      <th style=\"width: 61px;\"><abbr title=\"Optional?\">oppt?</abbr></th>\n" +
    "      <th class=\"action-button-container\"></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <!-- List headers -->\n" +
    "    <tr ng-repeat=\"(name, urlSubstitution) in urlSubstitutions | orderBy:'name'\">\n" +
    "      <td>{{name}}</td>\n" +
    "      <td>{{urlSubstitution.default}}</td>\n" +
    "      <td>{{urlSubstitution.optional ? 'yes' : 'no'}}</td>\n" +
    "      <td class=\"action-button-container\"><button type=\"button\" class=\"btn btn-danger\" ng-click=\"remove(name)\"><span class=\"glyphicon glyphicon-remove\"></span></button></td>\n" +
    "    </tr>\n" +
    "    <!-- Header adder -->\n" +
    "    <tr>\n" +
    "      <td><input type=\"text\" class=\"form-control\" ng-model=\"temp.name\" placeholder=\"Name...\"></td>\n" +
    "      <td><input type=\"text\" class=\"form-control\" ng-model=\"temp.default\" placeholder=\"Default...\"></td>\n" +
    "      <td><input type=\"checkbox\" class=\"form-control\" ng-model=\"temp.optional\"></td>\n" +
    "      <td class=\"action-button-container\"><button type=\"button\" class=\"btn btn-primary\" ng-click=\"add()\" ng-disabled=\"!canAdd()\"><span class=\"glyphicon glyphicon-ok\"></span></button></td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>"
  );


  $templateCache.put('/appgyver/data-configurator/ui/layout.html',
    "<div id=\"ag-data-configurator\" class=\"container-fluid\">\n" +
    "  <div class=\"row\">\n" +
    "\n" +
    "    <!-- Configuration flow -->\n" +
    "\n" +
    "    <!-- 1. List of providers -->\n" +
    "\n" +
    "    <div class=\"col-xs-12\" ng-if=\"!provider && !resource && !service\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\">\n" +
    "          <ol class=\"breadcrumb\">\n" +
    "            <li class=\"active\">Providers</li>\n" +
    "          </ol>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div ag-data-configurator-providers></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- 2. Provider details -->\n" +
    "\n" +
    "    <div class=\"col-xs-12\" ng-if=\"provider && !resource && !service\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\">\n" +
    "          <ol class=\"breadcrumb\">\n" +
    "            <li><a ng-click=\"navigation.listProviders()\">Providers</a></li>\n" +
    "            <li class=\"active\">{{provider.name}}</li>\n" +
    "          </ol>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div ag-data-configurator-provider-details></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- 3.1. Resource details -->\n" +
    "\n" +
    "    <div class=\"col-xs-12\" ng-if=\"provider && resource\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\">\n" +
    "          <ol class=\"breadcrumb\">\n" +
    "            <li><a ng-click=\"navigation.listProviders()\">Providers</a></li>\n" +
    "            <li><a ng-click=\"navigation.showProvider()\">{{provider.name}}</a></li>\n" +
    "            <li class=\"active\">{{resource.name}}</li>\n" +
    "          </ol>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div ag-data-configurator-resource-details></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- 3.2. Service details -->\n" +
    "\n" +
    "    <div class=\"col-xs-12\" ng-if=\"provider && service\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\">\n" +
    "          <ol class=\"breadcrumb\">\n" +
    "            <li><a ng-click=\"navigation.listProviders()\">Providers</a></li>\n" +
    "            <li><a ng-click=\"navigation.showProvider()\">{{provider.name}}</a></li>\n" +
    "            <li class=\"active\">{{service.name}}</li>\n" +
    "          </ol>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div ag-data-configurator-service-details></div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>"
  );

}]);

},{}],22:[function(require,module,exports){
"use strict";
module.exports = [
  "$rootScope", "Restangular", "AgDataSettings", function($rootScope, Restangular, AgDataSettings) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/appgyver/data-configurator/ui/layout.html",
      scope: {
        configApiBaseUrl: "@",
        configApiAppId: "@",
        configApiAuthorizationToken: "@"
      },
      link: function($scope, element, attrs) {

        /*
        Settings
         */
        var _configureRestangular;
        AgDataSettings.setApplicationId($scope.configApiAppId);
        _configureRestangular = function() {
          Restangular.setBaseUrl($scope.configApiBaseUrl);
          Restangular.setRequestSuffix(".json");
          Restangular.setDefaultHttpFields({
            withCredentials: true
          });
          Restangular.setRestangularFields({
            id: "uid"
          });
          if ($scope.configApiAuthorizationToken && $scope.configApiAuthorizationToken !== "") {
            return Restangular.setDefaultHeaders({
              Authorization: $scope.configApiAuthorizationToken
            });
          }
        };
        _configureRestangular();

        /*
        Selected provider / resource
         */
        $scope.provider = void 0;
        $scope.resource = void 0;
        $scope.service = void 0;

        /*
        Methods for navigating in the flow
         */
        $scope.navigation = {
          listProviders: function() {
            $scope.provider = void 0;
            $scope.resource = void 0;
            return $scope.service = void 0;
          },
          showProvider: function(provider) {
            if (provider) {
              $scope.provider = provider;
            }
            $scope.resource = void 0;
            return $scope.service = void 0;
          },
          showResource: function(resource) {
            $scope.resource = resource;
            return $scope.service = void 0;
          },
          showService: function(service) {
            $scope.service = service;
            return $scope.resource = void 0;
          }
        };

        /*
        Events
         */
        $rootScope.$on("ag.data-configurator.provider.created", function($event, newProvider) {
          return $scope.navigation.showProvider(newProvider);
        });
        $rootScope.$on("ag.data-configurator.provider.updated", function($event, updatedProvider) {
          if ($scope.provider.uid === updatedProvider.uid) {
            return $scope.provider = updatedProvider;
          }
        });
        $rootScope.$on("ag.data-configurator.provider.destroyed", function($event, destroyedProviderId) {
          if ($scope.provider.uid === destroyedProviderId) {
            return $scope.navigation.listProviders();
          }
        });
        $rootScope.$on("ag.data-configurator.resource.created", function($event, newResource) {
          return $scope.navigation.showResource(newResource);
        });
        $rootScope.$on("ag.data-configurator.resource.updated", function($event, updatedResource) {
          if ($scope.resource.uid === updatedResource.uid) {
            return $scope.resource = updatedResource;
          }
        });
        $rootScope.$on("ag.data-configurator.resource.destroyed", function($event, destroyedResourceId) {
          if ($scope.resource.uid === destroyedResourceId) {
            return $scope.navigation.showProvider();
          }
        });
        $rootScope.$on("ag.data-configurator.service.created", function($event, newService) {
          return $scope.navigation.showService(newService);
        });
        $rootScope.$on("ag.data-configurator.service.updated", function($event, updatedService) {
          if ($scope.service.uid === updatedService.uid) {
            return $scope.service = updatedService;
          }
        });
        return $rootScope.$on("ag.data-configurator.service.destroyed", function($event, destroyedServiceId) {
          if ($scope.service.uid === destroyedServiceId) {
            return $scope.navigation.showProvider();
          }
        });
      }
    };
  }
];


},{}],23:[function(require,module,exports){
"use strict";
module.exports = angular.module("AppGyver.DataConfigurator.UI", []).directive("agDataConfigurator", require("./directives/agDataConfigurator")).service("AgDataSettings", require("./services/AgDataSettings"));


},{"./directives/agDataConfigurator":22,"./services/AgDataSettings":24}],24:[function(require,module,exports){
"use strict";
module.exports = [
  function() {
    var _appId;
    _appId = void 0;
    this.setApplicationId = function(id) {
      _appId = id;
      return this;
    };
    this.getApplicationId = function() {
      return _appId;
    };
    return this;
  }
];


},{}]},{},[1]);