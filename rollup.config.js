import typescript from 'rollup-plugin-typescript2';

const LIB_NAME = require('./package.json').name;

export default [
  {
    input: `src/${LIB_NAME}.ts`,
    output: [
      {
        file: `dist/es2015/${LIB_NAME}.js`,
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      typescript({
        cacheRoot: '.rollupcache',
        tsconfigOverride: {
          compilerOptions: {
            removeComments: true,
          }
        }
      })
    ]
  },
  {
    input: `src/${LIB_NAME}.ts`,
    output: {
      file: `dist/es2017/${LIB_NAME}.js`,
      format: 'esm'
    },
    plugins: [
      typescript({
        cacheRoot: '.rollupcache',
        tsconfigOverride: {
          compilerOptions: {
            target: 'es2017',
            removeComments: true,
          }
        }
      })
    ]
  },
  {
    input: `src/${LIB_NAME}.ts`,
    output: [
      { file: `dist/amd/${LIB_NAME}.js`, format: 'amd', id: 'aurelia-ui-virtualization', sourcemap: true },
      { file: `dist/commonjs/${LIB_NAME}.js`, format: 'cjs', sourcemap: true },
      { file: `dist/system/${LIB_NAME}.js`, format: 'system', sourcemap: true },
      { file: `dist/native-modules/${LIB_NAME}.js`, format: 'esm', sourcemap: true },
    ],
    plugins: [
      typescript({
        cacheRoot: '.rollupcache',
        tsconfigOverride: {
          compilerOptions: {
            target: 'es5',
            removeComments: true,
          }
        }
      })
    ]
  }
].map(config => {
  config.external = [
    'aurelia-binding',
    'aurelia-dependency-injection',
    'aurelia-history',
    'aurelia-pal',
    'aurelia-templating',
    'aurelia-templating-resources'
  ];
  return config;
});
