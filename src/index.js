import 'core-js';
import {History} from 'aurelia-history';

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

/**
 * An implementation of the basic history api.
 */
export class BrowserHistory extends History {
  /**
   * Creates an instance of BrowserHistory.
   */
  constructor() {
    super();

    this.active = false;
    this.previousFragment = '';
    this._checkUrlCallback = this.checkUrl.bind(this);

    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  }

  getHash(window?: Window): string {
    let match = (window || this).location.href.match(/#(.*)$/);
    return match ? match[1] : '';
  }

  getFragment(fragment: string, forcePushState?: boolean): string {
    let root;

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

  /**
   * Activates the history object.
   * @param options The set of options to activate history with.
   */
  activate(options?: Object): boolean {
    if (this.active) {
      throw new Error('History has already been activated.');
    }

    let wantsPushState = !!options.pushState;

    this.active = true;
    this.options = Object.assign({}, { root: '/' }, this.options, options);

    // Normalize root to always include a leading and trailing slash.
    this.root = ('/' + this.options.root + '/').replace(rootStripper, '/');

    this._wantsHashChange = this.options.hashChange !== false;
    this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);

    // Depending on whether we're using pushState or hashes, and whether
    // 'onhashchange' is supported, determine how we check the URL state.
    if (this._hasPushState) {
      window.onpopstate = this._checkUrlCallback;
    } else if (this._wantsHashChange) {
      window.addEventListener('hashchange', this._checkUrlCallback);
    }

    // Determine if we need to change the base url, for a pushState link
    // opened by a non-pushState browser.
    if (this._wantsHashChange && wantsPushState) {
      // Transition from hashChange to pushState or vice versa if both are requested.
      let loc = this.location;
      let atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

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

    if (!this.fragment) {
      this.fragment = this.getFragment();
    }

    if (!this.options.silent) {
      return this.loadUrl();
    }
  }

  /**
   * Deactivates the history object.
   */
  deactivate(): void {
    window.onpopstate = null;
    window.removeEventListener('hashchange', this._checkUrlCallback);
    this.active = false;
  }

  checkUrl(): boolean {
    let current = this.getFragment();
    if (current !== this.fragment) {
      this.loadUrl();
    }
  }

  loadUrl(fragmentOverride: string): boolean {
    let fragment = this.fragment = this.getFragment(fragmentOverride);

    return this.options.routeHandler ?
      this.options.routeHandler(fragment) :
      false;
  }

  /**
   * Causes a history navigation to occur.
   * @param fragment The history fragment to navigate to.
   * @param options The set of options that specify how the navigation should occur.
   */
  navigate(fragment?: string, options?: Object): boolean {
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
    } else if (typeof options === 'boolean') {
      options = {
        trigger: options
      };
    }

    fragment = this.getFragment(fragment || '');

    if (this.fragment === fragment) {
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
      this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
    } else if (this._wantsHashChange) {
      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      updateHash(this.location, fragment, options.replace);
    } else {
      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      return this.location.assign(url);
    }

    if (options.trigger) {
      return this.loadUrl(fragment);
    }

    this.previousFragment = fragment;
  }

  /**
   * Causes the history state to navigate back.
   */
  navigateBack(): void {
    this.history.back();
  }
}

/**
 * Configures the plugin by registering BrowserHistory as the implementor of History in the DI container.
 */
export function configure(config: Object): void {
  config.singleton(History, BrowserHistory);
}
