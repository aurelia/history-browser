const path = require('path');
const { AureliaPlugin } = require('aurelia-webpack-plugin');

module.exports = function(config) {
  const browsers = config.browsers;
  config.set({

    basePath: '',
    frameworks: ["jasmine"],
    files: ["test/**/*.spec.ts", "test/**/*.spec.tsx"],
    preprocessors: {
      "test/**/*.spec.ts": ["webpack", "sourcemap"],
      "test/**/*.spec.tsx": ["webpack", "sourcemap"]
    },
    webpack: {
      mode: "development",
      resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: ["src", 'test', "node_modules"],
        alias: {
          src: path.resolve(__dirname, "src"),
          test: path.resolve(__dirname, 'test')
        }
      },
      devtool: browsers.indexOf('ChromeDebugging') > -1 ? 'eval-source-map' : 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
            options: {
              compilerOptions: {
                sourceMap: true
              }
            }
          }
        ]
      }
    },
    mime: {
      "text/x-typescript": ["ts"]
    },
    reporters: ["mocha"],
    webpackServer: { noInfo: config.noInfo },
    browsers: browsers && browsers.length > 0 ? browsers : ['ChromeHeadless'],
    customLaunchers: {
      ChromeDebugging: {
        base: "Chrome",
        flags: [...commonChromeFlags, "--remote-debugging-port=9333"],
        debug: true
      }
    },
    singleRun: false,
    mochaReporter: {
      ignoreSkipped: true
    },
    webpackMiddleware: {
      logLevel: 'silent'
    },
  });
};
