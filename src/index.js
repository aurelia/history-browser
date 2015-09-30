import 'core-js';
import {History} from 'aurelia-history';

/**
 * Configures the plugin by registering BrowserHistory as the implementation of History in the DI container.
 */
export function configure(config: Object): void {
  config.singleton(History, BrowserHistory);
}

/**
 * An implementation of the basic history API.
 */
export class BrowserHistory extends History {
  constructor() {
    if (typeof window === 'undefined') {
      throw new Error('BrowserHistory requires a window context.');
    }

    super();

    this._isActive = false;
    this._checkUrlCallback = this._checkUrl.bind(this);

    this.location = window.location;
    this.history = window.history;
  }

  /**
   * Activates the history object.
   * @param options The set of options to activate history with.
   */
  activate(options?: Object): boolean {
    if (this._isActive) {
      throw new Error('History has already been activated.');
    }

    let wantsPushState = !!options.pushState;

    this._isActive = true;
    this.options = Object.assign({}, { root: '/' }, this.options, options);

    // Normalize root to always include a leading and trailing slash.
    this.root = ('/' + this.options.root + '/').replace(rootStripper, '/');

    this._wantsHashChange = this.options.hashChange !== false;
    this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);

    // Determine how we check the URL state.
    let eventName;
    if (this._hasPushState) {
      eventName = 'popstate';
    } else if (this._wantsHashChange) {
      eventName = 'hashchange';
    }

    window.addEventListener(eventName, this._checkUrlCallback);

    // Determine if we need to change the base url, for a pushState link
    // opened by a non-pushState browser.
    if (this._wantsHashChange && wantsPushState) {
      // Transition from hashChange to pushState or vice versa if both are requested.
      let loc = this.location;
      let atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      // If we've started off with a route from a `pushState`-enabled
      // browser, but we're currently in a browser that doesn't support it...
      if (!this._hasPushState && !atRoot) {
        this.fragment = this._getFragment(null, true);
        this.location.replace(this.root + this.location.search + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
      } else if (this._hasPushState && atRoot && loc.hash) {
        this.fragment = this._getHash().replace(routeStripper, '');
        this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
      }
    }

    if (!this.fragment) {
      this.fragment = this._getFragment();
    }

    if (!this.options.silent) {
      return this._loadUrl();
    }
  }

  /**
   * Deactivates the history object.
   */
  deactivate(): void {
    window.removeEventListener('popstate', this._checkUrlCallback);
    window.removeEventListener('hashchange', this._checkUrlCallback);
    this._isActive = false;
  }

  /**
   * Causes a history navigation to occur.
   * @param fragment The history fragment to navigate to.
   * @param options The set of options that specify how the navigation should occur.
   */
  navigate(fragment?: string, {trigger = true, replace = false} = {}): boolean {
    if (fragment && absoluteUrl.test(fragment)) {
      window.location.href = fragment;
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

    // Don't include a trailing slash on the root.
    if (fragment === '' && url !== '/') {
      url = url.slice(0, -1);
    }

    // If pushState is available, we use it to set the fragment as a real URL.
    if (this._hasPushState) {
      url = url.replace('//', '/');
      this.history[replace ? 'replaceState' : 'pushState']({}, document.title, url);
    } else if (this._wantsHashChange) {
      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      updateHash(this.location, fragment, replace);
    } else {
      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      return this.location.assign(url);
    }

    if (trigger) {
      return this._loadUrl(fragment);
    }
  }

  /**
   * Causes the history state to navigate back.
   */
  navigateBack(): void {
    this.history.back();
  }

  _getHash(): string {
    return this.location.hash.substr(1);
  }

  _getFragment(fragment: string, forcePushState?: boolean): string {
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

  _checkUrl(): boolean {
    let current = this._getFragment();
    if (current !== this.fragment) {
      this._loadUrl();
    }
  }

  _loadUrl(fragmentOverride: string): boolean {
    let fragment = this.fragment = this._getFragment(fragmentOverride);

    return this.options.routeHandler ?
      this.options.routeHandler(fragment) :
      false;
  }
}

// Cached regex for stripping a leading hash/slash and trailing space.
const routeStripper = /^#?\/*|\s+$/g;

// Cached regex for stripping leading and trailing slashes.
const rootStripper = /^\/+|\/+$/g;

// Cached regex for removing a trailing slash.
const trailingSlash = /\/$/;

// Cached regex for detecting if a URL is absolute,
// i.e., starts with a scheme or is scheme-relative.
// See http://www.ietf.org/rfc/rfc2396.txt section 3.1 for valid scheme format
const absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

// Update the hash location, either replacing the current entry, or adding
// a new one to the browser history.
function updateHash(location, fragment, replace) {
  if (replace) {
    let href = location.href.replace(/(javascript:|#).*$/, '');
    location.replace(href + '#' + fragment);
  } else {
    // Some browsers require that `hash` contains a leading #.
    location.hash = '#' + fragment;
  }
}
