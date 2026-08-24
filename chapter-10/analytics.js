chrome.storage.local.get('copyCount', (data) => {
  const count = (data.copyCount || 0) + 1;
  chrome.storage.local.set({ copyCount: count });
});
