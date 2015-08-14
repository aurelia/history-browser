import * as core from 'core-js';
import {History} from 'aurelia-history';

// Cached regex for stripping a leading hash/slash and trailing space.
var routeStripper = /^#?\/*|\s+$/g;

// Cached regex for stripping leading and trailing slashes.
var rootStripper = /^\/+|\/+$/g;

// Cached regex for detecting MSIE.
var isExplorer = /msie [\w.]+/;

// Cached regex for removing a trailing slash.
var trailingSlash = /\/$/;

// Cached regex for detecting if a URL is absolute,
// i.e., starts with a scheme or is scheme-relative.
// See http://www.ietf.org/rfc/rfc2396.txt section 3.1 for valid scheme format
const absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

// Update the hash location, either replacing the current entry, or adding
// a new one to the browser history.
function updateHash(location, fragment, replace) {
  if (replace) {
    var href = location.href.replace(/(javascript:|#).*$/, '');
    location.replace(href + '#' + fragment);
  } else {
    // Some browsers require that `hash` contains a leading #.
    location.hash = '#' + fragment;
  }
}

export class BrowserHistory extends History {
  constructor(){
    super();

    this.interval = 50;
    this.active = false;
    this.previousFragment = '';
    this._checkUrlCallback = this.checkUrl.bind(this);

    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  }

  getHash(window? : Window) : string {
    var match = (window || this).location.href.match(/#(.*)$/);
    return match ? match[1] : '';
  }

  getFragment(fragment : string, forcePushState? : boolean) : string {
    var root;

    if (!fragment) {
      if (this._hasPushState || !this._wantsHashChange || forcePushState) {
        fragment = this.location.pathname + this.location.search;
        root = this.root.replace(trailingSlash, '');
        if (!fragment.indexOf(root)) {
          fragment = fragment.substr(root.length);
        }
      } else {
        fragment = this.getHash();
      }
    }

    return '/' + fragment.replace(routeStripper, '');
  }

  activate(options? : Object) : boolean {
    if (this.active) {
      throw new Error("History has already been activated.");
    }

    this.active = true;

    // Figure out the initial configuration. Do we need an iframe?
    // Is pushState desired ... is it available?
    this.options = Object.assign({}, { root: '/' }, this.options, options);
    this.root = this.options.root;
    this._wantsHashChange = this.options.hashChange !== false;
    this._wantsPushState = !!this.options.pushState;
    this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);

    var fragment = this.getFragment();

    // Normalize root to always include a leading and trailing slash.
    this.root = ('/' + this.root + '/').replace(rootStripper, '/');

    // Depending on whether we're using pushState or hashes, and whether
    // 'onhashchange' is supported, determine how we check the URL state.
    if (this._hasPushState) {
      window.onpopstate = this._checkUrlCallback;
    } else if (this._wantsHashChange && ('onhashchange' in window)) {
      window.addEventListener('hashchange', this._checkUrlCallback);
    } else if (this._wantsHashChange) {
      this._checkUrlTimer = setTimeout(this._checkUrlCallback, this.interval);
    }

    // Determine if we need to change the base url, for a pushState link
    // opened by a non-pushState browser.
    this.fragment = fragment;

    var loc = this.location;
    var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

    // Transition from hashChange to pushState or vice versa if both are requested.
    if (this._wantsHashChange && this._wantsPushState) {
      // If we've started off with a route from a `pushState`-enabled
      // browser, but we're currently in a browser that doesn't support it...
      if (!this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        this.location.replace(this.root + this.location.search + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
      } else if (this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
      }
    }

    if (!this.options.silent) {
      return this.loadUrl();
    }
  }

  deactivate() : void {
    window.onpopstate = null;
    window.removeEventListener('hashchange', this._checkUrlCallback);
    clearTimeout(this._checkUrlTimer);
    this.active = false;
  }

  checkUrl() : boolean {
    var current = this.getFragment();

    if (this._checkUrlTimer) {
        clearTimeout(this._checkUrlTimer);
        this._checkUrlTimer = setTimeout(this._checkUrlCallback, this.interval);
    }

    if (current === this.fragment && this.iframe) {
      current = this.getFragment(this.getHash(this.iframe));
    }

    if (current === this.fragment) {
      return false;
    }

    if (this.iframe) {
      this.navigate(current, false);
    }

    this.loadUrl();
  }

  loadUrl(fragmentOverride : string) : boolean {
    var fragment = this.fragment = this.getFragment(fragmentOverride);

    return this.options.routeHandler ?
      this.options.routeHandler(fragment) :
      false;
  }

  navigate(fragment? : string, options? : Object) : boolean {
    if (fragment && absoluteUrl.test(fragment)) {
      window.location.href = fragment;
      return true;
    }

    if (!this.active) {
      return false;
    }

    if (options === undefined) {
      options = {
        trigger: true
      };
    } else if (typeof options === "boolean") {
      options = {
        trigger: options
      };
    }

    fragment = this.getFragment(fragment || '');

    //removed. router.reset not routing to new url
    //if (this.fragment === fragment) {
    //  return;
    //}

    this.fragment = fragment;

    var url = this.root + fragment;

    // Don't include a trailing slash on the root.
    if (fragment === '' && url !== '/') {
      url = url.slice(0, -1);
    }

    // If pushState is available, we use it to set the fragment as a real URL.
    if (this._hasPushState) {
      url = url.replace('//', '/');
      this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
    } else if (this._wantsHashChange) {
      updateHash(this.location, fragment, options.replace);

      if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
        // Opening and closing the iframe tricks IE7 and earlier to push a
        // history entry on hash-tag change.  When replace is true, we don't
        // want history.
        if (!options.replace) {
            this.iframe.document.open().close();
        }

        updateHash(this.iframe.location, fragment, options.replace);
      }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
    } else {
      return this.location.assign(url);
    }

    if (options.trigger) {
      return this.loadUrl(fragment);
    } else {
      this.previousFragment = fragment;
    }
  }

  navigateBack() : void {
    this.history.back();
  }
}

export function configure(config : Object) : void {
  config.singleton(History, BrowserHistory);
}
