'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var RS = _interopDefault(require('ramdasauce'));

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

// apisauce uses axios, so let's deconstruct that format
var convertResponse = function convertResponse(source) {
  var url = RS.dotPath('config.url', source);
  var method = RS.dotPath('config.method', source);
  var requestData = RS.dotPath('config.data', source);
  var requestHeaders = RS.dotPath('config.headers', source);
  var requestParams = RS.dotPath('config.params', source);
  var duration = RS.dotPath('duration', source);
  var status = RS.dotPath('status', source);
  var body = RS.dotPath('data', source);
  var responseHeaders = RS.dotPath('headers', source);
  var request = {
    url: url, method: method, data: requestData, headers: requestHeaders, params: requestParams
  };
  var response = { body: body, status: status, headers: responseHeaders };

  return [request, response, duration];
};

/**
 * Sends an apisauce response to the server.
 */
var index = (function () {
  return function (reactotron) {
    return {
      features: {
        apisauce: function apisauce(source) {
          return reactotron.apiResponse.apply(reactotron, toConsumableArray(convertResponse(source)));
        }
      }
    };
  };
});

module.exports = index;
