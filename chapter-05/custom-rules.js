// Load custom rules on startup and whenever storage changes
let customRules = [];

async function loadCustomRules() {
  const data = await chrome.storage.local.get('customRules');
  customRules = (data.customRules || []).filter(r => r.pattern && r.replacement);
}

// Apply custom rules to text
function applyCustomRules(text) {
  for (const rule of customRules) {
    try {
      const regex = new RegExp(rule.pattern, 'g');
      text = text.replace(regex, rule.replacement);
    } catch (e) {
      // Skip invalid regex — never break copying
      console.warn('Invalid rule skipped:', rule.pattern);
    }
  }
  return text;
}

// Load rules initially
loadCustomRules();

// Reload rules when they change
chrome.storage.onChanged.addListener((changes) => {
  if (changes.customRules) {
    customRules = (changes.customRules.newValue || []).filter(r => r.pattern && r.replacement);
  }
});
