// Perplexity Data
const perplexityData = {
  gpt4_total: 3, 
  pplx_alpha_limit: 3, 
  pages_limit: 10, 
  upload_limit: 3,
  article_image_upload_limit: 20, 
  max_files_per_user: 500,
  connector_limits: { 
    repo_type_limits: { COLLECTION: { max_files: 5, max_folders: 5 } },
    global_file_count: 500, 
    max_file_size_mb: 50, 
    daily_attachment_limit: 3 
  },
  source_limits: {
    source_to_limit: {
      "wiley_mcp_cashmere": {monthly_limit: 3, remaining: 3},
      "cbinsights_mcp_cashmere": {monthly_limit: 3, remaining: 3},
      "pitchbook_mcp_cashmere": {monthly_limit: 3, remaining: 3},
      "statista_mcp_cashmere": {monthly_limit: 3, remaining: 3}
    }
  },
  query_count: 2264, 
  query_count_copilot: 71
};

// Initialize Tabs
function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });
}

// Render Usage Table
function renderUsageTable() {
  const tbody = document.querySelector('#usageTable tbody');
  tbody.innerHTML = `
    <tr>
      <td><strong>Grok</strong></td>
      <td>0</td>
      <td>15</td>
      <td><span class="status-available">15</span></td>
      <td>-</td>
    </tr>
    <tr>
      <td><strong>ChatGPT</strong></td>
      <td>5</td>
      <td>40</td>
      <td><span class="status-available">35</span></td>
      <td>-</td>
    </tr>
  `;
}

// Render Perplexity Table
function renderPerplexityTable() {
  const tbody = document.getElementById('perplexityTableBody');
  tbody.innerHTML = '';

  // Main limits
  const mainLimits = [
    {name: 'GPT-4', used: perplexityData.gpt4_total, limit: 'Unlimited'},
    {name: 'PPLX Alpha', used: 0, limit: perplexityData.pplx_alpha_limit},
    {name: 'Pages', used: 0, limit: perplexityData.pages_limit},
    {name: 'Uploads', used: 0, limit: perplexityData.upload_limit},
    {name: 'Daily Queries', used: perplexityData.query_count, limit: 'Unlimited'}
  ];

  mainLimits.forEach(item => {
    const row = tbody.insertRow();
    const status = item.limit === 'Unlimited' ? 'status-unlimited' : 'status-available';
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.used}</td>
      <td>${item.limit}</td>
      <td>${item.limit}</td>
      <td class="${status}">${item.limit === 'Unlimited' ? 'Unlimited' : 'Available'}</td>
    `;
  });

  // Sources
  Object.entries(perplexityData.source_limits.source_to_limit).forEach(([source, limits]) => {
    if (limits.monthly_limit > 0) {
      const row = tbody.insertRow();
      const used = limits.monthly_limit - limits.remaining;
      row.innerHTML = `
        <td>→ ${source.replace('_mcp_cashmere', '')}</td>
        <td>${used}</td>
        <td>${limits.monthly_limit}</td>
        <td>${limits.remaining}</td>
        <td class="status-available">Available</td>
      `;
    }
  });
}

// Button Events
function initButtons() {
  document.getElementById('addService').onclick = () => alert('Service added!');
  document.getElementById('resetAll').onclick = () => alert('Reset all counts!');
  document.getElementById('exportData').onclick = () => alert('Data exported!');
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  renderUsageTable();
  renderPerplexityTable();
  initButtons();
});