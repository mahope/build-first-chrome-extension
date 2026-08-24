// Clean Copy Lite — Background Service Worker
// Runs in the background, handles context menu clicks and events.

// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copy-as-markdown",
    title: "Copy as Markdown",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy-as-markdown") {
    // Execute a script in the current tab to get the selected HTML
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getSelectedHtml
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }
      const html = results[0].result;
      if (!html) return;
      
      const markdown = htmlToMarkdown(html);
      copyToClipboard(markdown, tab.id);
    });
  }
});

// This function runs IN the page context (injected by executeScript)
function getSelectedHtml() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return '';
  
  const range = selection.getRangeAt(0);
  const container = document.createElement('div');
  container.appendChild(range.cloneContents());
  return container.innerHTML;
}

// Copy text using an offscreen document (MV3 does not allow
// navigator.clipboard from service workers)
async function copyToClipboard(text, tabId) {
  // Store the text temporarily in chrome.storage
  await chrome.storage.local.set({ _clipboard: text });
  
  // Create or reuse an offscreen document that has clipboard access
  try {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['CLIPBOARD'],
      justification: 'Copy formatted Markdown text to clipboard'
    });
  } catch (e) {
    // Document may already exist — ignore
  }
  
  // Tell the offscreen document to copy
  chrome.runtime.sendMessage({ type: 'copy-from-storage' });
}
