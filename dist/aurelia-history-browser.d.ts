import {
  DOM,
  PLATFORM
} from 'aurelia-pal';
import {
  History
} from 'aurelia-history';

/**
 * Provides information about how to handle an anchor event.
 */
export declare interface AnchorEventInfo {
  
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
 * Class responsible for handling interactions that should trigger browser history navigations.
 */
export declare class LinkHandler {
  
  /**
     * Activate the instance.
     *
     * @param history The BrowserHistory instance that navigations should be dispatched to.
     */
  activate(history: BrowserHistory): void;
  
  /**
     * Deactivate the instance. Event handlers and other resources should be cleaned up here.
     */
  deactivate(): void;
}

/**
 * The default LinkHandler implementation. Navigations are triggered by click events on
 * anchor elements with relative hrefs when the history instance is using pushstate.
 */
/**
 * The default LinkHandler implementation. Navigations are triggered by click events on
 * anchor elements with relative hrefs when the history instance is using pushstate.
 */
export declare class DefaultLinkHandler extends LinkHandler {
  
  /**
     * Creates an instance of DefaultLinkHandler.
     */
  constructor();
  
  /**
     * Activate the instance.
     *
     * @param history The BrowserHistory instance that navigations should be dispatched to.
     */
  activate(history: BrowserHistory): void;
  
  /**
     * Deactivate the instance. Event handlers and other resources should be cleaned up here.
     */
  deactivate(): void;
  
  /**
     * Gets the href and a "should handle" recommendation, given an Event.
     *
     * @param event The Event to inspect for target anchor and href.
     */
  static getEventInfo(event: Event): AnchorEventInfo;
  
  /**
     * Finds the closest ancestor that's an anchor element.
     *
     * @param el The element to search upward from.
     * @returns The link element that is the closest ancestor.
     */
  static findClosestAnchor(el: Element): Element;
  
  /**
     * Gets a value indicating whether or not an anchor targets the current window.
     *
     * @param target The anchor element whose target should be inspected.
     * @returns True if the target of the link element is this window; false otherwise.
     */
  static targetIsThisWindow(target: Element): boolean;
}

/**
 * Configures the plugin by registering BrowserHistory as the implementation of History in the DI container.
 * @param config The FrameworkConfiguration object provided by Aurelia.
 */
export declare function configure(config: Object): void;

/**
 * An implementation of the basic history API.
 */
export declare class BrowserHistory extends History {
  static inject: any;
  
  /**
     * Creates an instance of BrowserHistory
     * @param linkHandler An instance of LinkHandler.
     */
  constructor(linkHandler: LinkHandler);
  
  /**
     * Activates the history object.
     * @param options The set of options to activate history with.
     * @returns Whether or not activation occurred.
     */
  activate(options?: Object): boolean;
  
  /**
     * Deactivates the history object.
     */
  deactivate(): void;
  
  /**
     * Returns the fully-qualified root of the current history object.
     * @returns The absolute root of the application.
     */
  getAbsoluteRoot(): string;
  
  /**
     * Causes a history navigation to occur.
     *
     * @param fragment The history fragment to navigate to.
     * @param options The set of options that specify how the navigation should occur.
     * @return Promise if triggering navigation, otherwise true/false indicating if navigation occurred.
     */
  navigate(fragment?: string, {
    trigger,
    replace
  }?: {
    trigger?: any,
    replace?: any
  }): boolean;
  
  /**
     * Causes the history state to navigate back.
     */
  navigateBack(): void;
  
  /**
     * Sets the document title.
     */
  setTitle(title: string): void;
  
  /**
     * Sets a key in the history page state.
     * @param key The key for the value.
     * @param value The value to set.
     */
  setState(key: string, value: any): void;
  
  /**
     * Gets a key in the history page state.
     * @param key The key for the value.
     * @return The value for the key.
     */
  getState(key: string): any;
  
  /**
     * Returns the current index in the navigation history.
     * @returns The current index.
     */
  getHistoryIndex(): number;
  
  /**
     * Move to a specific position in the navigation history.
     * @param movement The amount of steps, positive or negative, to move.
     */
  go(movement: number): void;
}