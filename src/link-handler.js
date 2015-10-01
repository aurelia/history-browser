/**
 * Class responsible for handling interactions that should trigger browser history navigations.
 */
export class LinkHandler {
  /**
   * Activate the instance.
   *
   * @param history The BrowserHistory instance that navigations should be dispatched to.
   */
  activate(history: BrowserHistory) {}

  /**
   * Deactivate the instance. Event handlers and other resources should be cleaned up here.
   */
  deactivate() {}
}

/**
 * The default LinkHandler implementation. Navigations are triggered by click events on
 * anchor elements with relative hrefs when the history instance is using pushstate.
 */
export class DefaultLinkHandler extends LinkHandler {
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

  activate(history: BrowserHistory) {
    if (history._hasPushState) {
      this.history = history;
      document.addEventListener('click', this.handler, true);
    }
  }

  deactivate() {
    document.removeEventListener('click', this.handler);
  }

  /**
   * Gets the href and a "should handle" recommendation, given an Event.
   *
   * @param event The Event to inspect for target anchor and href.
   */
  static getEventInfo(event: Event): Object {
    let info = {
      shouldHandleEvent: false,
      href: null,
      anchor: null
    };

    let target = DefaultLinkHandler.findClosestAnchor(event.target);
    if (!target || !DefaultLinkHandler.targetIsThisWindow(target)) {
      return info;
    }

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return info;
    }

    let href = target.getAttribute('href');
    info.anchor = target;
    info.href = href;

    let hasModifierKey = (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
    let isRelative = href && !(href.charAt(0) === '#' || (/^[a-z]+:/i).test(href));

    info.shouldHandleEvent = !hasModifierKey && isRelative;
    return info;
  }

  /**
   * Finds the closest ancestor that's an anchor element.
   *
   * @param el The element to search upward from.
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
   */
  static targetIsThisWindow(target: Element): boolean {
    let targetWindow = target.getAttribute('target');

    return !targetWindow ||
      targetWindow === window.name ||
      targetWindow === '_self' ||
      (targetWindow === 'top' && window === window.top);
  }
}
