import { NavigationResult } from 'aurelia-history';

/**
 * Provides information about how to handle an anchor event.
 */
export interface AnchorEventInfo {
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
 * Available options for History activation.
 */
export interface HistoryOptions {
  root: string;
  pushState: boolean;
  hashChange: boolean;
  silent: boolean;
  routeHandler: Promise<NavigationResult>;
}
