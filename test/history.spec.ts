import './setup';
import { BrowserHistory } from '../src/aurelia-history-browser';
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
    let bh = new BrowserHistory(null);
    expect(bh).toBe(bh);
  });

  describe('_getFragment()', () => {

    it('should normalize fragment', () => {
      let expected = '/admin/user/123';
      let bh = new BrowserHistory(null);

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

    const testCases = [
      [encodeURIComponent('admin user 123'), '/admin user 123'],
      [encodeURIComponent('ad"min user'), '/ad"min user'],
      [encodeURIComponent('ad{min  '), '/ad{min  '],
      ...['@', '!', '$', '%', '&', '^', '*', '(', ')', '[', ']', '\\', '|', '{', '}', ':', ';', '\'', ' ', '  ', '   ', '"', '<', '>', '~', '`',
        ...[
          '( ͡° ͜ʖ ͡°)',
          'ʕ•ᴥ•ʔ',
          '༼ つ ◕_◕ ༽つ',
          '(ಥ﹏ಥ)',
          'ლ(ಠ益ಠლ)',
          '◉_◉',
          'ಠ⌣ಠ',
          'ಠ~ಠ'
        ]
      ]
        .map(specialChar => {
          return [encodeURIComponent(`ad${specialChar}min/ad${specialChar}min`), `/ad${specialChar}min/ad${specialChar}min`];
        })
    ];

    testCases.forEach(([input, output]) => {
      it(`should decode fragment "${input}" correctly`, async () => {
        let bh = new BrowserHistory(null);
        expect(bh._getFragment(input)).toBe(output);
      });
    });
  });

  describe('getAbsoluteRoot', () => {
    it('should return a valid URL with a trailing slash', () => {
      let bh = new BrowserHistory(new LinkHandler());
      bh.activate({});
      bh.location = {
        protocol: 'http:',
        hostname: 'localhost',
        port: ''
      } as Location;

      expect(bh.getAbsoluteRoot()).toBe('http://localhost/');
    });

    it('should return a valid URL with a port', () => {
      let options = {};
      let bh = new BrowserHistory(new LinkHandler());
      bh.activate(options);
      bh.location = {
        protocol: 'https:',
        hostname: 'www.aurelia.io',
        port: '8080'
      } as Location;

      expect(bh.getAbsoluteRoot()).toBe('https://www.aurelia.io:8080/');
    });

    it('should return a valid URL with a trailing fragment if root is set', () => {
      let options = { root: '/application/' };
      let bh = new BrowserHistory(new LinkHandler());
      bh.activate(options);
      bh.location = {
        protocol: 'https:',
        hostname: 'www.aurelia.io',
        port: '8080'
      } as Location;

      expect(bh.getAbsoluteRoot()).toBe('https://www.aurelia.io:8080/application/');
    });
  });

  describe('setState', () => {
    it('should set browser page state', () => {
      let state = { 'number': 123 };
      let bh = new BrowserHistory(new LinkHandler());
      bh.activate({});
      bh.location = {
        protocol: 'http:',
        hostname: 'localhost',
        port: ''
      } as Location;
      bh.setState('TestState', state);
      expect(bh.getState('TestState')['number']).toBe(123);
    });
  });

  describe('getState', () => {
    it('should get browser page state', () => {
      let bh = new BrowserHistory(new LinkHandler());
      bh.activate({});
      bh.location = {
        protocol: 'http:',
        hostname: 'localhost',
        port: ''
      } as Location;
      let state = { 'number': 123 };
      bh.setState('TestState', state);
      expect(bh.getState('TestState')['number']).toBe(123);
    });
  });

  describe('getHistoryIndex', () => {
    it('should get the current browser history index', () => {
      let bh = new BrowserHistory(new LinkHandler());
      bh.activate({});
      bh.history = new MockWindowHistory() as any;

      expect(bh.getHistoryIndex()).toBe(1);
      expect(bh.getState('HistoryIndex')).toBe(1);
    });
  });
});
