// Handle messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'convert-to-markdown') {
    const markdown = htmlToMarkdown(request.html);
    sendResponse({ markdown });
    return true;  // Keep the channel open for async response
  }
  if (request.type === 'copy-from-storage') {
    // Already handled by offscreen.html — but send a response to avoid warnings
    sendResponse({ ok: true });
  }
});
