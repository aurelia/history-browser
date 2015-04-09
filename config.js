System.config({
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "aurelia-history-browser/*": "dist/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "aurelia-history": "github:aurelia/history@0.3.0",
    "core-js": "github:zloirock/core-js@0.8.1",
    "github:jspm/nodelibs-process@0.1.0": {
      "process": "npm:process@0.10.0"
    },
    "npm:core-js@0.4.6": {
      "process": "github:jspm/nodelibs-process@0.1.0"
    }
  }
});

