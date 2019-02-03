'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaHistoryBrowser = require('./aurelia-history-browser');

Object.keys(_aureliaHistoryBrowser).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaHistoryBrowser[key];
    }
  });
});