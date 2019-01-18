import {DOM,PLATFORM} from 'aurelia-pal';
import {History} from 'aurelia-history';

/**
 * Class responsible for handling interactions that should trigger browser history navigations.
 */
export class LinkHandler {
  /**
   * Activate the instance.
   *
   * @param history The BrowserHistory instance that navigations should be dispatched to.
   */
  activate(history: BrowserHistory): void {}

  /**
   * Deactivate the instance. Event handlers and other resources should be cleaned up here.
   */
  deactivate(): void {}
}

/**
 * Provides information about how to handle an anchor event.
 */
interface AnchorEventInfo {
  /**
   * Indicates whether the event should be handled or not.
   */
  shouldHandleEvent: boolean;
  /**
   * The href of the link or null if not-applicable.
   */
  href: string;
  /**
   * The anchor element or null if not-applicable.
   */
  anchor: Element;
}

/**
 * The default LinkHandler implementation. Navigations are triggered by click events on
 * anchor elements with relative hrefs when the history instance is using pushstate.
 */
export class DefaultLinkHandler extends LinkHandler {
  /**
   * Creates an instance of DefaultLinkHandler.
   */
  constructor() {
    super();

    this.handler = (e) => {
      let {shouldHandleEvent, href} = DefaultLinkHandler.getEventInfo(e);

      if (shouldHandleEvent) {
        e.preventDefault();
        this.history.navigate(href);
      }
    };
  }

  /**
   * Activate the instance.
   *
   * @param history The BrowserHistory instance that navigations should be dispatched to.
   */
  activate(history: BrowserHistory): void {
    if (history._hasPushState) {
      this.history = history;
      DOM.addEventListener('click', this.handler, true);
    }
  }

  /**
   * Deactivate the instance. Event handlers and other resources should be cleaned up here.
   */
  deactivate(): void {
    DOM.removeEventListener('click', this.handler);
  }

  /**
   * Gets the href and a "should handle" recommendation, given an Event.
   *
   * @param event The Event to inspect for target anchor and href.
   */
  static getEventInfo(event: Event): AnchorEventInfo {
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
    let isRelative = href && !(href.charAt(0) === '#' || (/^[a-z]+:/i).test(href));

    info.shouldHandleEvent = leftButtonClicked && isRelative;
    return info;
  }

  /**
   * Finds the closest ancestor that's an anchor element.
   *
   * @param el The element to search upward from.
   * @returns The link element that is the closest ancestor.
   */
  static findClosestAnchor(el: Element): Element {
    while (el) {
      if (el.tagName === 'A') {
        return el;
      }

      el = el.parentNode;
    }
  }

  /**
   * Gets a value indicating whether or not an anchor targets the current window.
   *
   * @param target The anchor element whose target should be inspected.
   * @returns True if the target of the link element is this window; false otherwise.
   */
  static targetIsThisWindow(target: Element): boolean {
    let targetWindow = target.getAttribute('target');
    let win = PLATFORM.global;

    return !targetWindow ||
      targetWindow === win.name ||
      targetWindow === '_self';
  }
}

/**
 * Configures the plugin by registering BrowserHistory as the implementation of History in the DI container.
 * @param config The FrameworkConfiguration object provided by Aurelia.
 */
export function configure(config: Object): void {
  config.singleton(History, BrowserHistory);
  config.transient(LinkHandler, DefaultLinkHandler);
}

/**
 * An implementation of the basic history API.
 */
export class BrowserHistory extends History {
  static inject = [LinkHandler];

  /**
   * Creates an instance of BrowserHistory
   * @param linkHandler An instance of LinkHandler.
   */
  constructor(linkHandler: LinkHandler) {
    super();

    this._isActive = false;
    this._checkUrlCallback = this._checkUrl.bind(this);

    this.location = PLATFORM.location;
    this.history = PLATFORM.history;
    this.linkHandler = linkHandler;
  }

  /**
   * Activates the history object.
   * @param options The set of options to activate history with.
   * @returns Whether or not activation occurred.
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

    PLATFORM.addEventListener(eventName, this._checkUrlCallback);

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

  /**
   * Deactivates the history object.
   */
  deactivate(): void {
    PLATFORM.removeEventListener('popstate', this._checkUrlCallback);
    PLATFORM.removeEventListener('hashchange', this._checkUrlCallback);
    this._isActive = false;
    this.linkHandler.deactivate();
  }

  /**
   * Returns the fully-qualified root of the current history object.
   * @returns The absolute root of the application.
   */
  getAbsoluteRoot(): string {
    let origin = createOrigin(this.location.protocol, this.location.hostname, this.location.port);
    return `${origin}${this.root}`;
  }

  /**
   * Causes a history navigation to occur.
   *
   * @param fragment The history fragment to navigate to.
   * @param options The set of options that specify how the navigation should occur.
   * @return Promise if triggering navigation, otherwise true/false indicating if navigation occurred.
   */
  navigate(fragment?: string, {trigger = true, replace = false} = {}): boolean {
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

    // Don't include a trailing slash on the root.
    if (fragment === '' && url !== '/') {
      url = url.slice(0, -1);
    }

    // If pushState is available, we use it to set the fragment as a real URL.
    if (this._hasPushState) {
      url = url.replace('//', '/');
      this.history[replace ? 'replaceState' : 'pushState']({}, DOM.title, url);
    } else if (this._wantsHashChange) {
      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      updateHash(this.location, fragment, replace);
    } else {
      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      this.location.assign(url);
    }

    if (trigger) {
      return this._loadUrl(fragment);
    }

    return true;
  }

  /**
   * Causes the history state to navigate back.
   */
  navigateBack(): void {
    this.history.back();
  }

  /**
   * Sets the document title.
   */
  setTitle(title: string): void {
    DOM.title = title;
  }

  /**
   * Sets a key in the history page state.
   * @param key The key for the value.
   * @param value The value to set.
   */
  setState(key: string, value: any): void {
    let state = Object.assign({}, this.history.state);
    let { pathname, search, hash } = this.location;
    state[key] = value;
    this.history.replaceState(state, null, `${pathname}${search}${hash}`);
  }

  /**
   * Gets a key in the history page state.
   * @param key The key for the value.
   * @return The value for the key.
   */
  getState(key: string): any {
    let state = Object.assign({}, this.history.state);
    return state[key];
  }

  /**
   * Returns the current index in the navigation history.
   * @returns The current index.
   */
  getHistoryIndex(): number {
    let historyIndex = this.getState('HistoryIndex');
    if (historyIndex === undefined) {
      historyIndex = this.history.length - 1;
      this.setState('HistoryIndex', historyIndex);
    }
    return historyIndex;
  }

  /**
   * Move to a specific position in the navigation history.
   * @param movement The amount of steps, positive or negative, to move.
   */
  go(movement: number): void {
    this.history.go(movement);
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

function createOrigin(protocol: string, hostname: string, port: string) {
  return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}
