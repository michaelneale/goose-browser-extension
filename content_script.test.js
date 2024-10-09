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

// Test injectContext function
function sendMessage(action, text) {
  let response;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === action) {
      sendResponse({ status: 'success' });
      response = { status: 'success' };
    }
  });

  chrome.runtime.onMessage.addListener.mock.calls[0][0](
    { action, text },
    null,
    (res) => { response = {status: 'success'}; }
  );

  return response;
}

test('injectContext should correctly handle injectContext action', () => {
  const response = sendMessage("injectContext", "hello world");
  expect(response).toEqual({ status: 'success' });
});
