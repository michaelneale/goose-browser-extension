// Mock the chrome API
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn()
    },
  },
};

// Content script listener test
require('./content_script');
test('contentScript should add a listener to chrome.runtime.onMessage', () => {
  expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();
});

// Test scrapePageContent function
const mockURL = 'http://example.com';
const mockTitle = 'Example Page';
document.body.innerHTML = '<p>Visible text on the page</p>';
document.title = mockTitle;
Object.defineProperty(window, 'location', {
  value: {
    href: mockURL
  },
  writable: true
});

const contentScript = require('./content_script');

test('scrapePageContent should return page URL, title, and visible text', () => {
  const result = contentScript.scrapePageContent();
  expect(result).toEqual({
    url: mockURL,
    title: mockTitle,
    visible_text: ['Visible text on the page']
  });
});
