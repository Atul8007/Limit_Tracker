const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function createTable(headers, rows) {
  const table = document.createElement('table');
  table.className = 'table';

  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  rows.forEach(([key, value, cls]) => {
    const row = document.createElement('tr');
    const tdKey = document.createElement('td');
    tdKey.textContent = key;
    const tdVal = document.createElement('td');
    tdVal.textContent = value;
    tdVal.className = 'value';
    if (cls) tdVal.classList.add(cls);
    row.appendChild(tdKey);
    row.appendChild(tdVal);
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  return table;
}

function renderSettings(data) {
  const content = $('#content');
  content.innerHTML = '';

  // --- Account Limits ---
  const accountRows = [
    ['gpt4_limit', data.gpt4_limit, 'highlight'],
    ['pplx_alpha_limit', data.pplx_alpha_limit, 'highlight'],
    ['pplx_beta_limit', data.pplx_beta_limit],
    ['pages_limit', data.pages_limit],
    ['upload_limit', data.upload_limit, 'highlight'],
    ['query_count', data.query_count?.toLocaleString() || '0'],
    ['default_model', data.default_model]
  ];
  const accountSection = document.createElement('div');
  accountSection.className = 'section';
  accountSection.innerHTML = '<h2>Account Limits</h2>';
  accountSection.appendChild(createTable(['Setting', 'Value'], accountRows));
  content.appendChild(accountSection);

  // --- File & Storage ---
  const storage = data.connector_limits || {};
  const storageRows = [
    ['max_files_per_user', storage.global_file_count || 0],
    ['max_file_size_mb', storage.max_file_size_mb],
    ['daily_attachment_limit', storage.daily_attachment_limit]
  ];
  const storageSection = document.createElement('div');
  storageSection.className = 'section';
  storageSection.innerHTML = '<h2>File & Storage</h2>';
  storageSection.appendChild(createTable(['Limit', 'Value'], storageRows));
  content.appendChild(storageSection);

  // --- Premium Sources ---
  const sources = (data.sources?.source_to_limit) || {};
  const premiumSources = Object.entries(sources)
    .filter(([k]) => k.includes('_mcp_cashmere'))
    .map(([k, v]) => {
      const name = k.replace('_mcp_cashmere', '').replace(/_/g, ' ');
      const used = v.monthly_limit - (v.remaining || 0);
      return [`${name}`, `${used} / ${v.monthly_limit} remaining`, 'premium'];
    });

  if (premiumSources.length > 0) {
    const premiumSection = document.createElement('div');
    premiumSection.className = 'section';
    premiumSection.innerHTML = '<h2>Premium Sources (Pro Only)</h2>';
    premiumSection.appendChild(createTable(['Source', 'Usage'], premiumSources));
    content.appendChild(premiumSection);
  }

  // --- Connectors ---
  const connectors = data.connectors?.connectors || [];
  const connRows = connectors.map(c => [
    `${c.name} (${c.auth_type})`,
    c.connected ? 'Connected' : 'Not connected'
  ]);

  if (connRows.length > 0) {
    const connSection = document.createElement('div');
    connSection.className = 'section';
    connSection.innerHTML = '<h2>Connectors</h2>';
    connSection.appendChild(createTable(['Connector', 'Status'], connRows));
    content.appendChild(connSection);
  }

  // --- Subscription ---
  const subRows = [
    ['Subscription', data.subscription_status || 'none'],
    ['Tier', data.subscription_tier || 'Free'],
    ['Time Zone', data.time_zone || '—'],
    ['Notifications', `${data.notif_status || '—'} / ${data.email_status || '—'}`]
  ];
  const subSection = document.createElement('div');
  subSection.className = 'section';
  subSection.innerHTML = '<h2>Subscription & Preferences</h2>';
  subSection.appendChild(createTable(['Field', 'Value'], subRows));
  content.appendChild(subSection);
}

/* ---------- Main ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  const loading = $('#loading');
  const content = $('#content');
  const status = $('#status');

  let data = null;

  try {
    const resp = await fetch('https://www.perplexity.ai/rest/user/settings', {
      credentials: 'include'
    });
    if (resp.ok) {
      data = await resp.json();
      await chrome.storage.local.set({ lastSettings: data });
      status.textContent = '(Live)';
    }
  } catch (e) {
    console.warn('Fetch failed:', e);
  }

  if (!data) {
    const cached = await chrome.storage.local.get('lastSettings');
    if (cached.lastSettings) {
      data = cached.lastSettings;
      status.textContent = '(Cached)';
      loading.textContent = 'Using cached settings…';
    }
  }

  if (!data) {
    loading.textContent = 'Error: Could not load settings. Are you logged in?';
    return;
  }

  renderSettings(data);
  loading.classList.add('hidden');
  content.classList.remove('hidden');
});