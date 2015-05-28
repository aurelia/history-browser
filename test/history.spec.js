import {BrowserHistory} from '../src/index';

describe('browser history', () => {
  it('should have some tests', () => {
    var bh = new BrowserHistory();
    expect(bh).toBe(bh);
  });

  describe('getFragment()', () => {

    it('should normalize fragment', () => {
      var expected = 'admin/user/123';
      var bh = new BrowserHistory();

      expect(bh.getFragment('admin/user/123')).toBe(expected);
      expect(bh.getFragment('admin/user/123  ')).toBe(expected);
      expect(bh.getFragment('/admin/user/123')).toBe(expected);
      expect(bh.getFragment('/admin/user/123   ')).toBe(expected);
      expect(bh.getFragment('///admin/user/123')).toBe(expected);

      expect(bh.getFragment('#admin/user/123')).toBe(expected);
      expect(bh.getFragment('#admin/user/123  ')).toBe(expected);
      expect(bh.getFragment('#/admin/user/123')).toBe(expected);
      expect(bh.getFragment('#/admin/user/123   ')).toBe(expected);
      expect(bh.getFragment('#///admin/user/123')).toBe(expected);
    })
  })
});
