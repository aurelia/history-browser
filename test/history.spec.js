import {BrowserHistory} from '../src/index';

describe('browser history', () => {
  it('should have some tests', () => {
    var bh = new BrowserHistory();
    expect(bh).toBe(bh);
  });
});