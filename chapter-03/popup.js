// Clean Copy Lite — Popup Logic
document.getElementById('convert').addEventListener('click', async () => {
  const input = document.getElementById('input').value;
  if (!input.trim()) {
    document.getElementById('status').textContent = 'Paste some text first.';
    return;
  }
  
  // Send to background for conversion
  chrome.runtime.sendMessage(
    { type: 'convert-to-markdown', html: input },
    (response) => {
      if (chrome.runtime.lastError) {
        document.getElementById('status').textContent = 'Error: ' + chrome.runtime.lastError.message;
        return;
      }
      document.getElementById('output').textContent = response.markdown;
      document.getElementById('copy').style.display = 'inline-block';
      document.getElementById('status').textContent = 'Converted!';
    }
  );
});

document.getElementById('copy').addEventListener('click', async () => {
  const text = document.getElementById('output').textContent;
  
  // Store and trigger offscreen copy
  await chrome.storage.local.set({ _clipboard: text });
  try {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['CLIPBOARD'],
      justification: 'Copy Markdown text to clipboard'
    });
  } catch (e) {}
  chrome.runtime.sendMessage({ type: 'copy-from-storage' });
  document.getElementById('status').textContent = 'Copied!';
});
