<a name="1.3.0"></a>
# [1.3.0](https://github.com/aurelia/history-browser/compare/1.2.0...1.3.0) (2019-01-18)

### Features

* add support of data-router-ignore attribute ([0d8f7a0](https://github.com/aurelia/history-browser/commit/0d8f7a0))
* Add go method
* Add history index getter

<a name="1.2.0"></a>
# [1.2.0](https://github.com/aurelia/history-browser/compare/1.1.1...1.2.0) (2018-06-13)


### Bug Fixes

* **history-browser:** Ensure all navigate() paths return a value ([47beb9b](https://github.com/aurelia/history-browser/commit/47beb9b))
* **index:** revert return types ([0481af4](https://github.com/aurelia/history-browser/commit/0481af4))
* **typing:** update return types ([e1a574a](https://github.com/aurelia/history-browser/commit/e1a574a))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/aurelia/history-browser/compare/1.1.0...v1.1.1) (2018-02-24)


### Bug Fixes

* **history-browser:** Add location.href to replaceState() call ([424c252](https://github.com/aurelia/history-browser/commit/424c252))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/aurelia/history-browser/compare/1.0.0...v1.1.0) (2017-09-29)

#### Features

* **history-browser:** add getState and setState

<a name="1.0.0"></a>
# [1.0.0](https://github.com/aurelia/history-browser/compare/1.0.0-rc.1.0.0...v1.0.0) (2016-07-27)



<a name="1.0.0-rc.1.0.0"></a>
# [1.0.0-rc.1.0.0](https://github.com/aurelia/history-browser/compare/1.0.0-beta.2.0.1...v1.0.0-rc.1.0.0) (2016-06-22)



### 1.0.0-beta.1.2.1 (2016-05-10)


#### Features

* **history-browser:** add getAbsoluteRoot method ([c5bb6811](http://github.com/aurelia/history-browser/commit/c5bb68117e7b663b1e09d83e31812193c137ba7a))


### 1.0.0-beta.1.2.0 (2016-03-22)

* Update to Babel 6

### 1.0.0-beta.1.1.4 (2016-03-01)


#### Bug Fixes

* **all:** remove core-js dependency ([209629f8](http://github.com/aurelia/history-browser/commit/209629f8b611449bcdf950faf50f2e1856c2174b))


### 1.0.0-beta.1.1.3 (2016-03-01)


#### Bug Fixes

* **all:** remove core-js dependency ([209629f8](http://github.com/aurelia/history-browser/commit/209629f8b611449bcdf950faf50f2e1856c2174b))


### 1.0.0-beta.1.1.2 (2016-02-08)


### 1.0.0-beta.1.1.0 (2016-01-28)


## 1.0.0-beta.1.0.1 (2015-12-03)


#### Bug Fixes

* **history-browser:** open link in new tab when it clicked with middle button ([8acf18fe](http://github.com/aurelia/history-browser/commit/8acf18fe820bed72e6957ed2f7686d37430b178b))


### 1.0.0-beta.1 (2015-11-16)


## 0.10.0 (2015-11-09)


#### Bug Fixes

* **index:** update to latest container api ([4690d655](http://github.com/aurelia/history-browser/commit/4690d65522004040ce9118ffbaf646d6b8babd4f))


#### Features

* **history:** implement method for setting document title ([dc17f75c](http://github.com/aurelia/history-browser/commit/dc17f75cb68a6d83bf780495666beb88c9eaeaa3))


## 0.9.0 (2015-10-13)


#### Bug Fixes

* **all:**
  * update to latest plugin api ([85418be2](http://github.com/aurelia/history-browser/commit/85418be278701aa3dd9c4947c2ed92d7ce1a54ef))
  * update compiler ([6be59964](http://github.com/aurelia/history-browser/commit/6be5996499d6a4668bfe58ba316462d612b61766))
* **bower:** correct semver ranges ([9c7f33f5](http://github.com/aurelia/history-browser/commit/9c7f33f59c82075dcd505afbc8936e613685ab30))
* **build:**
  * update linting, testing and tools ([9ad076d6](http://github.com/aurelia/history-browser/commit/9ad076d6ded8b0ca607b742f69a00c76f3d3946e))
  * add missing bower bump ([5b4cc6f3](http://github.com/aurelia/history-browser/commit/5b4cc6f3ee303221f27efa2e4470c2f9acd9bb0e))
* **history:**
  * Improved previous pushState security fix by only fixing up double slashes in fra ([9d7565a1](http://github.com/aurelia/history-browser/commit/9d7565a16fe1765eff7d677c22321643c91b3890))
  * fixed regression issue which added double slashes to the pushState fragment ([57983341](http://github.com/aurelia/history-browser/commit/579833415f55372def76ccbf5fbbd1ebd939ae7b))
  * normalize fragments with a leading slash ([66998d87](http://github.com/aurelia/history-browser/commit/66998d873140c32fc2f78ce21b19356f96d8eba2))
  * fix incorrect falsey check in getFragment ([34cb8224](http://github.com/aurelia/history-browser/commit/34cb8224e24cb1761042668bb96d6c5d42e0c7cf))
* **history-browser:**
  * verify that window is defined in ctor ([78449060](http://github.com/aurelia/history-browser/commit/7844906099178c73faa65e4ee8db122cd7df3d4f))
  * Use correct import for core-js We were previously using `import core from core-j ([45d51c8c](http://github.com/aurelia/history-browser/commit/45d51c8cb525b410731300d1b70945b0f3ad4146))
  * support scheme-relative URLs in BrowserHistory.navigate() ([16fcfdd7](http://github.com/aurelia/history-browser/commit/16fcfdd71656e0ed72d98ca6bd4e2cb6a6654517))
* **index:** update to latest configuration api ([a3681cfb](http://github.com/aurelia/history-browser/commit/a3681cfb52f58b9a8dffa37911c1eed5b15f81cc))
* **normalize-fragment:** fix getFragment() to return normalized values ([5cb9bf30](http://github.com/aurelia/history-browser/commit/5cb9bf30689558d12a9ffb05088e2206fac4777f))
* **package:**
  * update aurelia tools and dts generator ([ee59abbc](http://github.com/aurelia/history-browser/commit/ee59abbc9465107644fef1ea6f3748c9f9e32859))
  * change jspm directories ([2b161b23](http://github.com/aurelia/history-browser/commit/2b161b23a0a1cac8b1a9e6eb5d69ee54fe148675))
  * update dependencies ([d56c60df](http://github.com/aurelia/history-browser/commit/d56c60dfa51cf129575cc0f31d9d78e06642029e))
  * update dependencies ([0f9bc51a](http://github.com/aurelia/history-browser/commit/0f9bc51aa77e2441b6ad6c2454bdb79601e35c14))
  * update Aurelia dependencies ([770590c2](http://github.com/aurelia/history-browser/commit/770590c23eb7c391e914bc40653f883de34cc8df))
  * add es6-shim dependency for Object.assign ([517b7e8e](http://github.com/aurelia/history-browser/commit/517b7e8ee94ba18ce662af21a7fdd594d9ed8adb))
  * update dependencies to latest ([cdd1c232](http://github.com/aurelia/history-browser/commit/cdd1c23295b821aa7f68b94f5d5d3a95a1b7e129))


#### Features

* **all:** leverage the PAL ([01cd524c](http://github.com/aurelia/history-browser/commit/01cd524c09016e18a46e41a572bbb0ff902bc502))
* **build:** update compiler and switch to register module format ([ff2a572b](http://github.com/aurelia/history-browser/commit/ff2a572b4858ce16eea17b66ded4912b89919d85))
* **docs:** generate api.json from .d.ts file ([80fd2e30](http://github.com/aurelia/history-browser/commit/80fd2e30a68c9bf4200be831887c49de766a6939))
* **history:** enable usage as plugin ([f73c967b](http://github.com/aurelia/history-browser/commit/f73c967b64d75da43d31ad8b7305c495ebdf08a8))
* **history-browser:**
  * move link handler from router and allow custom implementations ([f0129d89](http://github.com/aurelia/history-browser/commit/f0129d8959219cae16e729b15d4da52aac504bff))
  * adjust default navigate options ([0f17175d](http://github.com/aurelia/history-browser/commit/0f17175d0591559e102ea8ecabf51b0f61c8506e))
  * allow replace option to trigger a navigation to the same fragment ([1eab2945](http://github.com/aurelia/history-browser/commit/1eab2945bcdcc74eb366ea57acce160a8e0b4553), closes [#201](http://github.com/aurelia/history-browser/issues/201))


#### Breaking Changes

* trigger now defaults to true when other options are specified, and options must be passed as an object; a boolean is no longer supported as a shortcut for trigger.

 ([0f17175d](http://github.com/aurelia/history-browser/commit/0f17175d0591559e102ea8ecabf51b0f61c8506e))


## 0.8.0 (2015-09-04)


#### Bug Fixes

* **build:** update linting, testing and tools ([9ad076d6](http://github.com/aurelia/history-browser/commit/9ad076d6ded8b0ca607b742f69a00c76f3d3946e))


#### Features

* **docs:** generate api.json from .d.ts file ([80fd2e30](http://github.com/aurelia/history-browser/commit/80fd2e30a68c9bf4200be831887c49de766a6939))


## 0.7.0 (2015-08-14)


#### Bug Fixes

* **history-browser:** Use correct import for core-js We were previously using `import core from core-j ([45d51c8c](http://github.com/aurelia/history-browser/commit/45d51c8cb525b410731300d1b70945b0f3ad4146))
* **index:** update to latest configuration api ([a3681cfb](http://github.com/aurelia/history-browser/commit/a3681cfb52f58b9a8dffa37911c1eed5b15f81cc))


### 0.6.2 (2015-07-29)

* improve output file name

### 0.6.1 (2015-07-07)


#### Bug Fixes

* **history:**
  * Improved previous pushState security fix by only fixing up double slashes in fra ([9d7565a1](http://github.com/aurelia/history-browser/commit/9d7565a16fe1765eff7d677c22321643c91b3890))
  * fixed regression issue which added double slashes to the pushState fragment ([57983341](http://github.com/aurelia/history-browser/commit/579833415f55372def76ccbf5fbbd1ebd939ae7b))


## 0.6.0 (2015-07-01)


#### Bug Fixes

* **history:** normalize fragments with a leading slash ([66998d87](http://github.com/aurelia/history-browser/commit/66998d873140c32fc2f78ce21b19356f96d8eba2))
* **package:** update aurelia tools and dts generator ([ee59abbc](http://github.com/aurelia/history-browser/commit/ee59abbc9465107644fef1ea6f3748c9f9e32859))


## 0.5.0 (2015-06-08)


#### Bug Fixes

* **history-browser:** support scheme-relative URLs in BrowserHistory.navigate() ([16fcfdd7](http://github.com/aurelia/history-browser/commit/16fcfdd71656e0ed72d98ca6bd4e2cb6a6654517))
* **normalize-fragment:** fix getFragment() to return normalized values ([5cb9bf30](http://github.com/aurelia/history-browser/commit/5cb9bf30689558d12a9ffb05088e2206fac4777f))


## 0.4.0 (2015-04-30)


#### Bug Fixes

* **all:** update to latest plugin api ([85418be2](http://github.com/aurelia/history-browser/commit/85418be278701aa3dd9c4947c2ed92d7ce1a54ef))


## 0.3.0 (2015-04-09)


#### Bug Fixes

* **all:** update compiler ([6be59964](http://github.com/aurelia/history-browser/commit/6be5996499d6a4668bfe58ba316462d612b61766))


### 0.2.5 (2015-02-28)


#### Bug Fixes

* **package:** change jspm directories ([2b161b23](http://github.com/aurelia/history-browser/commit/2b161b23a0a1cac8b1a9e6eb5d69ee54fe148675))


### 0.2.4 (2015-02-27)


#### Bug Fixes

* **build:** add missing bower bump ([5b4cc6f3](http://github.com/aurelia/history-browser/commit/5b4cc6f3ee303221f27efa2e4470c2f9acd9bb0e))
* **package:** update dependencies ([d56c60df](http://github.com/aurelia/history-browser/commit/d56c60dfa51cf129575cc0f31d9d78e06642029e))


### 0.2.3 (2015-01-24)


#### Bug Fixes

* **bower:** correct semver ranges ([9c7f33f5](http://github.com/aurelia/history-browser/commit/9c7f33f59c82075dcd505afbc8936e613685ab30))


### 0.2.2 (2015-01-22)


#### Bug Fixes

* **package:** update dependencies ([0f9bc51a](http://github.com/aurelia/history-browser/commit/0f9bc51aa77e2441b6ad6c2454bdb79601e35c14))


### 0.2.1 (2015-01-12)


#### Bug Fixes

* **package:** update Aurelia dependencies ([770590c2](http://github.com/aurelia/history-browser/commit/770590c23eb7c391e914bc40653f883de34cc8df))


## 0.2.0 (2015-01-06)


#### Bug Fixes

* **package:** add es6-shim dependency for Object.assign ([517b7e8e](http://github.com/aurelia/history-browser/commit/517b7e8ee94ba18ce662af21a7fdd594d9ed8adb))


#### Features

* **build:** update compiler and switch to register module format ([ff2a572b](http://github.com/aurelia/history-browser/commit/ff2a572b4858ce16eea17b66ded4912b89919d85))
* **history:** enable usage as plugin ([f73c967b](http://github.com/aurelia/history-browser/commit/f73c967b64d75da43d31ad8b7305c495ebdf08a8))


### 0.1.1 (2014-12-17)


#### Bug Fixes

* **package:** update dependencies to latest ([cdd1c232](http://github.com/aurelia/history-browser/commit/cdd1c23295b821aa7f68b94f5d5d3a95a1b7e129))


## 0.1.0 (2014-12-11)


#### Bug Fixes

* **history:** fix incorrect falsey check in getFragment ([34cb8224](http://github.com/aurelia/history-browser/commit/34cb8224e24cb1761042668bb96d6c5d42e0c7cf))
