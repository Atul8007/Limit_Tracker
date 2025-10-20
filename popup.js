// Load services from storage and render table
async function loadServices() {
  const { services = [] } = await chrome.storage.local.get('services');
  const tbody = document.querySelector('#usageTable tbody');
  tbody.innerHTML = '';
  services.forEach((service, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${service.name}</td>
      <td>${service.used}</td>
      <td>${service.limit}</td>
      <td>${service.limit - service.used}</td>
      <td><button class="increment" data-index="${index}">+1</button></td>
    `;
    tbody.appendChild(row);
  });
  addIncrementListeners();
}

// Add listeners to +1 buttons
function addIncrementListeners() {
  document.querySelectorAll('.increment').forEach(button => {
    button.addEventListener('click', async () => {
      const index = button.dataset.index;
      const { services } = await chrome.storage.local.get('services');
      services[index].used++;
      await chrome.storage.local.set({ services });
      chrome.runtime.sendMessage({ action: 'checkLimits', services });
      loadServices();
    });
  });
}

// Add/Update service
document.getElementById('addService').addEventListener('click', async () => {
  const name = document.getElementById('serviceName').value.trim();
  const limit = parseInt(document.getElementById('maxLimit').value);
  const urlPattern = document.getElementById('urlPattern').value.trim();
  const resetInterval = parseInt(document.getElementById('resetInterval').value);

  if (!name || isNaN(limit) || !urlPattern || isNaN(resetInterval)) {
    alert('Please fill all fields correctly.');
    return;
  }

  let { services = [] } = await chrome.storage.local.get('services');
  const existingIndex = services.findIndex(s => s.name === name);
  if (existingIndex !== -1) {
    services[existingIndex] = { name, limit, used: services[existingIndex].used, urlPattern, resetInterval, lastReset: Date.now() };
  } else {
    services.push({ name, limit, used: 0, urlPattern, resetInterval, lastReset: Date.now() });
  }
  await chrome.storage.local.set({ services });
  loadServices();
  clearInputs();
});

function clearInputs() {
  document.getElementById('serviceName').value = '';
  document.getElementById('maxLimit').value = '';
  document.getElementById('urlPattern').value = '';
  document.getElementById('resetInterval').value = '';
}

// Reset all counts
document.getElementById('resetAll').addEventListener('click', async () => {
  const { services } = await chrome.storage.local.get('services');
  services.forEach(service => {
    service.used = 0;
    service.lastReset = Date.now();
  });
  await chrome.storage.local.set({ services });
  loadServices();
});

// TTS controls
document.getElementById('readPRD').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'readPRD' });
});

document.getElementById('stopReading').addEventListener('click', () => {
  chrome.tts.stop();
});

// Real-time updates: Listen for changes from background
chrome.storage.onChanged.addListener((changes) => {
  if (changes.services) loadServices();
});

// Initial load
loadServices();