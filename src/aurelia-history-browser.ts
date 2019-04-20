import {History} from 'aurelia-history';
import {LinkHandler, DefaultLinkHandler} from './link-handler';
import { BrowserHistory } from './browser-history';

/**
 * Configures the plugin by registering BrowserHistory as the implementation of History in the DI container.
 * @param config The FrameworkConfiguration object provided by Aurelia.
 */
export function configure(config: Object): void {
  // work around for converting to TS without breaking compat
  const $config = config as any;
  $config.singleton(History, BrowserHistory);
  $config.transient(LinkHandler, DefaultLinkHandler);
}

export {
  LinkHandler,
  DefaultLinkHandler,
  BrowserHistory
}
