import {BrowserHistory} from '../lib/index';

describe('browser history', () => {
  it('should have some tests', () => {
    var bh = new BrowserHistory();
    expect(bh).toBe(bh);
  });
});