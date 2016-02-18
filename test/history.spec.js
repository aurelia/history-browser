import './setup';
import {BrowserHistory} from '../src/index';
import {LinkHandler} from '../src/link-handler';

describe('browser history', () => {
  it('should have some tests', () => {
    var bh = new BrowserHistory();
    expect(bh).toBe(bh);
  });

  describe('_getFragment()', () => {

    it('should normalize fragment', () => {
      var expected = '/admin/user/123';
      var bh = new BrowserHistory();

      expect(bh._getFragment('admin/user/123')).toBe(expected);
      expect(bh._getFragment('admin/user/123  ')).toBe(expected);
      expect(bh._getFragment('/admin/user/123')).toBe(expected);
      expect(bh._getFragment('/admin/user/123   ')).toBe(expected);
      expect(bh._getFragment('///admin/user/123')).toBe(expected);

      expect(bh._getFragment('#admin/user/123')).toBe(expected);
      expect(bh._getFragment('#admin/user/123  ')).toBe(expected);
      expect(bh._getFragment('#/admin/user/123')).toBe(expected);
      expect(bh._getFragment('#/admin/user/123   ')).toBe(expected);
      expect(bh._getFragment('#///admin/user/123')).toBe(expected);
    });
  });

  describe('getAbsoluteRoot', () => {
    it('should return a valid URL with a trailing slash', () => {
      var bh = new BrowserHistory(new LinkHandler());
      bh.activate({});
      bh.location = {
        protocol: 'http:',
        hostname: 'localhost',
        port: ''
      };

      expect(bh.getAbsoluteRoot()).toBe('http://localhost/');
    });

    it('should return a valid URL with a port', () => {
      var options = {};
      var bh = new BrowserHistory(new LinkHandler());
      bh.activate(options);
      bh.location = {
        protocol: 'https:',
        hostname: 'www.aurelia.io',
        port: '8080'
      };

      expect(bh.getAbsoluteRoot()).toBe('https://www.aurelia.io:8080/');
    });

    it('should return a valid URL with a trailing fragment if root is set', () => {
      var options = { root: '/application/'}
      var bh = new BrowserHistory(new LinkHandler());
      bh.activate(options);
      bh.location = {
        protocol: 'https:',
        hostname: 'www.aurelia.io',
        port: '8080'
      };

      expect(bh.getAbsoluteRoot()).toBe('https://www.aurelia.io:8080/application/');
    });
  });
});
