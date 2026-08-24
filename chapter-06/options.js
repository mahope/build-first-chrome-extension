let rules = [];

async function loadRules() {
  const data = await chrome.storage.local.get('customRules');
  rules = data.customRules || [];
  renderRules();
}

function renderRules() {
  const container = document.getElementById('rules');
  container.innerHTML = '';
  rules.forEach((rule, i) => {
    const div = document.createElement('div');
    div.className = 'rule';
    div.innerHTML = `
      <input class="pattern" value="${escHtml(rule.pattern || '')}" placeholder="Find (regex)">
      <input class="replacement" value="${escHtml(rule.replacement || '')}" placeholder="Replace">
      <button data-index="${i}" class="remove">×</button>
    `;
    container.appendChild(div);
  });
  
  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.index);
      rules.splice(i, 1);
      renderRules();
    });
  });
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

document.getElementById('add-rule').addEventListener('click', () => {
  rules.push({ pattern: '', replacement: '' });
  renderRules();
});

document.getElementById('save').addEventListener('click', async () => {
  const inputs = document.querySelectorAll('.rule');
  const newRules = [];
  inputs.forEach(div => {
    const pattern = div.querySelector('.pattern').value.trim();
    const replacement = div.querySelector('.replacement').value;
    if (pattern) newRules.push({ pattern, replacement });
  });
  await chrome.storage.local.set({ customRules: newRules });
  document.getElementById('status').textContent = 'Saved! Rules will apply on next copy.';
  setTimeout(() => { document.getElementById('status').textContent = ''; }, 2000);
});

loadRules();
