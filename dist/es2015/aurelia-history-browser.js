var _class, _temp;

import { DOM, PLATFORM } from 'aurelia-pal';
import { History } from 'aurelia-history';

export let LinkHandler = class LinkHandler {
  activate(history) {}

  deactivate() {}
};

export let DefaultLinkHandler = class DefaultLinkHandler extends LinkHandler {
  constructor() {
    super();

    this.handler = e => {
      let { shouldHandleEvent, href } = DefaultLinkHandler.getEventInfo(e);

      if (shouldHandleEvent) {
        e.preventDefault();
        this.history.navigate(href);
      }
    };
  }

  activate(history) {
    if (history._hasPushState) {
      this.history = history;
      DOM.addEventListener('click', this.handler, true);
    }
  }

  deactivate() {
    DOM.removeEventListener('click', this.handler);
  }

  static getEventInfo(event) {
    let info = {
      shouldHandleEvent: false,
      href: null,
      anchor: null
    };

    let target = DefaultLinkHandler.findClosestAnchor(event.target);
    if (!target || !DefaultLinkHandler.targetIsThisWindow(target)) {
      return info;
    }

    if (target.hasAttribute('download') || target.hasAttribute('router-ignore') || target.hasAttribute('data-router-ignore')) {
      return info;
    }

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return info;
    }

    let href = target.getAttribute('href');
    info.anchor = target;
    info.href = href;

    let leftButtonClicked = event.which === 1;
    let isRelative = href && !(href.charAt(0) === '#' || /^[a-z]+:/i.test(href));

    info.shouldHandleEvent = leftButtonClicked && isRelative;
    return info;
  }

  static findClosestAnchor(el) {
    while (el) {
      if (el.tagName === 'A') {
        return el;
      }

      el = el.parentNode;
    }
  }

  static targetIsThisWindow(target) {
    let targetWindow = target.getAttribute('target');
    let win = PLATFORM.global;

    return !targetWindow || targetWindow === win.name || targetWindow === '_self';
  }
};

export function configure(config) {
  config.singleton(History, BrowserHistory);
  config.transient(LinkHandler, DefaultLinkHandler);
}

export let BrowserHistory = (_temp = _class = class BrowserHistory extends History {
  constructor(linkHandler) {
    super();

    this._isActive = false;
    this._checkUrlCallback = this._checkUrl.bind(this);

    this.location = PLATFORM.location;
    this.history = PLATFORM.history;
    this.linkHandler = linkHandler;
  }

  activate(options) {
    if (this._isActive) {
      throw new Error('History has already been activated.');
    }

    let wantsPushState = !!options.pushState;

    this._isActive = true;
    this.options = Object.assign({}, { root: '/' }, this.options, options);

    this.root = ('/' + this.options.root + '/').replace(rootStripper, '/');

    this._wantsHashChange = this.options.hashChange !== false;
    this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);

    let eventName;
    if (this._hasPushState) {
      eventName = 'popstate';
    } else if (this._wantsHashChange) {
      eventName = 'hashchange';
    }

    PLATFORM.addEventListener(eventName, this._checkUrlCallback);

    if (this._wantsHashChange && wantsPushState) {
      let loc = this.location;
      let atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      if (!this._hasPushState && !atRoot) {
        this.fragment = this._getFragment(null, true);
        this.location.replace(this.root + this.location.search + '#' + this.fragment);

        return true;
      } else if (this._hasPushState && atRoot && loc.hash) {
        this.fragment = this._getHash().replace(routeStripper, '');
        this.history.replaceState({}, DOM.title, this.root + this.fragment + loc.search);
      }
    }

    if (!this.fragment) {
      this.fragment = this._getFragment();
    }

    this.linkHandler.activate(this);

    if (!this.options.silent) {
      return this._loadUrl();
    }
  }

  deactivate() {
    PLATFORM.removeEventListener('popstate', this._checkUrlCallback);
    PLATFORM.removeEventListener('hashchange', this._checkUrlCallback);
    this._isActive = false;
    this.linkHandler.deactivate();
  }

  getAbsoluteRoot() {
    let origin = createOrigin(this.location.protocol, this.location.hostname, this.location.port);
    return `${origin}${this.root}`;
  }

  navigate(fragment, { trigger = true, replace = false } = {}) {
    if (fragment && absoluteUrl.test(fragment)) {
      this.location.href = fragment;
      return true;
    }

    if (!this._isActive) {
      return false;
    }

    fragment = this._getFragment(fragment || '');

    if (this.fragment === fragment && !replace) {
      return false;
    }

    this.fragment = fragment;

    let url = this.root + fragment;

    if (fragment === '' && url !== '/') {
      url = url.slice(0, -1);
    }

    if (this._hasPushState) {
      url = url.replace('//', '/');
      this.history[replace ? 'replaceState' : 'pushState']({}, DOM.title, url);
    } else if (this._wantsHashChange) {
      updateHash(this.location, fragment, replace);
    } else {
      this.location.assign(url);
    }

    if (trigger) {
      return this._loadUrl(fragment);
    }

    return true;
  }

  navigateBack() {
    this.history.back();
  }

  setTitle(title) {
    DOM.title = title;
  }

  setState(key, value) {
    let state = Object.assign({}, this.history.state);
    let { pathname, search, hash } = this.location;
    state[key] = value;
    this.history.replaceState(state, null, `${pathname}${search}${hash}`);
  }

  getState(key) {
    let state = Object.assign({}, this.history.state);
    return state[key];
  }

  getHistoryIndex() {
    let historyIndex = this.getState('HistoryIndex');
    if (historyIndex === undefined) {
      historyIndex = this.history.length - 1;
      this.setState('HistoryIndex', historyIndex);
    }
    return historyIndex;
  }

  go(movement) {
    this.history.go(movement);
  }

  _getHash() {
    return this.location.hash.substr(1);
  }

  _getFragment(fragment, forcePushState) {
    let root;

    if (!fragment) {
      if (this._hasPushState || !this._wantsHashChange || forcePushState) {
        fragment = this.location.pathname + this.location.search;
        root = this.root.replace(trailingSlash, '');
        if (!fragment.indexOf(root)) {
          fragment = fragment.substr(root.length);
        }
      } else {
        fragment = this._getHash();
      }
    }

    return '/' + fragment.replace(routeStripper, '');
  }

  _checkUrl() {
    let current = this._getFragment();
    if (current !== this.fragment) {
      this._loadUrl();
    }
  }

  _loadUrl(fragmentOverride) {
    let fragment = this.fragment = this._getFragment(fragmentOverride);

    return this.options.routeHandler ? this.options.routeHandler(fragment) : false;
  }
}, _class.inject = [LinkHandler], _temp);

const routeStripper = /^#?\/*|\s+$/g;

const rootStripper = /^\/+|\/+$/g;

const trailingSlash = /\/$/;

const absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

function updateHash(location, fragment, replace) {
  if (replace) {
    let href = location.href.replace(/(javascript:|#).*$/, '');
    location.replace(href + '#' + fragment);
  } else {
    location.hash = '#' + fragment;
  }
}

function createOrigin(protocol, hostname, port) {
  return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}