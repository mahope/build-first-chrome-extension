chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'copy-selection') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getSelectedHtml
    }, async (results) => {
      if (chrome.runtime.lastError || !results[0].result) return;
      const markdown = htmlToMarkdown(results[0].result);
      
      // Store and copy via offscreen document
      await chrome.storage.local.set({ _clipboard: markdown });
      try {
        await chrome.offscreen.createDocument({
          url: 'offscreen.html',
          reasons: ['CLIPBOARD'],
          justification: 'Copy Markdown to clipboard via keyboard shortcut'
        });
      } catch (e) {}
      chrome.runtime.sendMessage({ type: 'copy-from-storage' });
    });
  }
});
