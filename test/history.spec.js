import './setup';
import { BrowserHistory } from '../src/index';
import { LinkHandler } from '../src/link-handler';

describe('browser history', () => {
  it('should have some tests', () => {
    var bh = new BrowserHistory();
    expect(bh).toBe(bh);
  });

  describe('_getFragment()', () => {

    it('should normalize fragment from URL', () => {
      var expected = '/admin/user/123';
      var bh = new BrowserHistory(new LinkHandler());
      bh.activate({});

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

    it('should normalize fragment when a root is configured', () => {
      const expected = '/admin/user/123';
      const bh = new BrowserHistory(new LinkHandler());
      bh.activate({root: '/root'});

      bh._hasPushState = true;
      expect(bh._getFragment('admin/user/123')).toBe(expected);
      expect(bh._getFragment('admin/user/123  ')).toBe(expected);
      expect(bh._getFragment('/admin/user/123')).toBe(expected);
      expect(bh._getFragment('/admin/user/123   ')).toBe(expected);
      expect(bh._getFragment('///admin/user/123')).toBe(expected);
      expect(bh._getFragment('/root/admin/user/123')).toBe(expected);
      expect(bh._getFragment('/root///admin/user/123')).toBe(expected);

      bh._hasPushState = false;
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
      var options = { root: '/application/' }
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

  describe('setState', () => {
    it('should set browser page state', () => {
      var state = { 'number': 123 };
      var bh = new BrowserHistory(new LinkHandler());
      bh.activate({});
      bh.location = {
        protocol: 'http:',
        hostname: 'localhost',
        port: ''
      };
      bh.setState('TestState', state);
      // expect(bh.getState('TestState')['number']).toBe(123);
    });
  });

  describe('getState', () => {
    it('should get browser page state', () => {
      var bh = new BrowserHistory(new LinkHandler());
      bh.activate({});
      bh.location = {
        protocol: 'http:',
        hostname: 'localhost',
        port: ''
      };
      expect(bh.getState('TestState')['number']).toBe(123);
    });
  });
});
