import { History } from 'aurelia-history';
import { DOM, PLATFORM } from 'aurelia-pal';

class LinkHandler {
    activate(history) { }
    deactivate() { }
}
class DefaultLinkHandler extends LinkHandler {
    constructor() {
        super();
        this.handler = (e) => {
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
        DOM.removeEventListener('click', this.handler, true);
    }
    static getEventInfo(event) {
        let $event = event;
        let info = {
            shouldHandleEvent: false,
            href: null,
            anchor: null
        };
        let target = DefaultLinkHandler.findClosestAnchor($event.target);
        if (!target || !DefaultLinkHandler.targetIsThisWindow(target)) {
            return info;
        }
        if (hasAttribute(target, 'download')
            || hasAttribute(target, 'router-ignore')
            || hasAttribute(target, 'data-router-ignore')) {
            return info;
        }
        if ($event.altKey || $event.ctrlKey || $event.metaKey || $event.shiftKey) {
            return info;
        }
        let href = target.getAttribute('href');
        info.anchor = target;
        info.href = href;
        let leftButtonClicked = $event.which === 1;
        let isRelative = href && !(href.charAt(0) === '#' || (/^[a-z]+:/i).test(href));
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
        return !targetWindow ||
            targetWindow === win.name ||
            targetWindow === '_self';
    }
}
const hasAttribute = (el, attr) => el.hasAttribute(attr);

class BrowserHistory extends History {
    constructor(linkHandler) {
        super();
        this._isActive = false;
        this._checkUrl = this._checkUrl.bind(this);
        this.location = PLATFORM.location;
        this.history = PLATFORM.history;
        this.linkHandler = linkHandler;
    }
    activate(options) {
        if (this._isActive) {
            throw new Error('History has already been activated.');
        }
        let $history = this.history;
        let wantsPushState = !!options.pushState;
        this._isActive = true;
        let normalizedOptions = this.options = Object.assign({}, { root: '/' }, this.options, options);
        let rootUrl = this.root = ('/' + normalizedOptions.root + '/').replace(rootStripper, '/');
        let wantsHashChange = this._wantsHashChange = normalizedOptions.hashChange !== false;
        let hasPushState = this._hasPushState = !!(normalizedOptions.pushState && $history && $history.pushState);
        let eventName;
        if (hasPushState) {
            eventName = 'popstate';
        }
        else if (wantsHashChange) {
            eventName = 'hashchange';
        }
        PLATFORM.addEventListener(eventName, this._checkUrl);
        if (wantsHashChange && wantsPushState) {
            let $location = this.location;
            let atRoot = $location.pathname.replace(/[^\/]$/, '$&/') === rootUrl;
            if (!hasPushState && !atRoot) {
                let fragment = this.fragment = this._getFragment(null, true);
                $location.replace(rootUrl + $location.search + '#' + fragment);
                return true;
            }
            else if (hasPushState && atRoot && $location.hash) {
                let fragment = this.fragment = this._getHash().replace(routeStripper, '');
                $history.replaceState({}, DOM.title, rootUrl + fragment + $location.search);
            }
        }
        if (!this.fragment) {
            this.fragment = this._getFragment('');
        }
        this.linkHandler.activate(this);
        if (!normalizedOptions.silent) {
            return this._loadUrl('');
        }
    }
    deactivate() {
        const handler = this._checkUrl;
        PLATFORM.removeEventListener('popstate', handler);
        PLATFORM.removeEventListener('hashchange', handler);
        this._isActive = false;
        this.linkHandler.deactivate();
    }
    getAbsoluteRoot() {
        let $location = this.location;
        let origin = createOrigin($location.protocol, $location.hostname, $location.port);
        return `${origin}${this.root}`;
    }
    navigate(fragment, { trigger = true, replace = false } = {}) {
        let location = this.location;
        if (fragment && absoluteUrl.test(fragment)) {
            location.href = fragment;
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
        }
        else if (this._wantsHashChange) {
            updateHash(location, fragment, replace);
        }
        else {
            location.assign(url);
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
        let $history = this.history;
        let state = Object.assign({}, $history.state);
        let { pathname, search, hash } = this.location;
        state[key] = value;
        $history.replaceState(state, null, `${pathname}${search}${hash}`);
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
        let rootUrl;
        if (!fragment) {
            if (this._hasPushState || !this._wantsHashChange || forcePushState) {
                let location = this.location;
                fragment = location.pathname + location.search;
                rootUrl = this.root.replace(trailingSlash, '');
                if (!fragment.indexOf(rootUrl)) {
                    fragment = fragment.substr(rootUrl.length);
                }
            }
            else {
                fragment = this._getHash();
            }
        }
        return decodeURIComponent('/' + fragment.replace(routeStripper, ''));
    }
    _checkUrl() {
        let current = this._getFragment('');
        if (current !== this.fragment) {
            this._loadUrl('');
        }
    }
    _loadUrl(fragmentOverride) {
        let fragment = this.fragment = this._getFragment(fragmentOverride);
        return this.options.routeHandler ?
            this.options.routeHandler(fragment) :
            false;
    }
}
BrowserHistory.inject = [LinkHandler];
const routeStripper = /^#?\/*|\s+$/g;
const rootStripper = /^\/+|\/+$/g;
const trailingSlash = /\/$/;
const absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
function updateHash($location, fragment, replace) {
    if (replace) {
        let href = $location.href.replace(/(javascript:|#).*$/, '');
        $location.replace(href + '#' + fragment);
    }
    else {
        $location.hash = '#' + fragment;
    }
}
function createOrigin(protocol, hostname, port) {
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}

function configure(config) {
    const $config = config;
    $config.singleton(History, BrowserHistory);
    $config.transient(LinkHandler, DefaultLinkHandler);
}

export { BrowserHistory, DefaultLinkHandler, LinkHandler, configure };
