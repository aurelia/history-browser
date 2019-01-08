import {DOM, PLATFORM} from 'aurelia-pal';

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
