import './setup';
import { BrowserHistory } from '../src/index';
import { LinkHandler } from '../src/link-handler';

class MockWindowHistory {
  length = 2;
  state = {};
  replaceState(state) {
    this.state = state;
  }
}

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

  describe('getHistoryIndex', () => {
    it('should get the current browser history index', () => {
      var bh = new BrowserHistory(new LinkHandler());
      bh.activate({});
      bh.history = new MockWindowHistory();

      expect(bh.getHistoryIndex()).toBe(1);
      expect(bh.getState('HistoryIndex')).toBe(1);
    });
  });
});
