async function loadServices() {
  const { services = [] } = await chrome.storage.local.get('services');
  const tbody = document.querySelector('#usageTable tbody');
  tbody.innerHTML = '';

  // Calculate total usage percentage for loading screen
  const totalUsed = services.reduce((sum, s) => sum + s.used, 0);
  const totalLimit = services.reduce((sum, s) => sum + s.limit, 0);
  const totalPercentage = totalLimit > 0 ? (totalUsed / totalLimit * 100).toFixed(2) : 0;

  // Update loading bar
  const loadingBar = document.getElementById('loadingBar');
  loadingBar.style.setProperty('--progress-width', `${totalPercentage}%`);
  loadingBar.dataset.progress = totalPercentage;
  loadingBar.classList.add('animate');
  document.getElementById('loadingPercentage').textContent = `${totalPercentage}%`;

  // Populate table
  services.forEach((service, index) => {
    const percentage = (service.used / service.limit * 100).toFixed(2);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="p-2">${service.name}</td>
      <td class="p-2">${service.used}</td>
      <td class="p-2">${service.limit}</td>
      <td class="p-2">
        ${service.limit - service.used}
        <div class="progress-container mt-1">
          <div class="progress-bar animate" style="--progress-width: ${percentage}%;" data-progress="${percentage}"></div>
        </div>
      </td>
      <td class="p-2">
        <button class="increment-btn btn-neon py-1 px-2 rounded text-sm" data-index="${index}">+1</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Hide loading screen
  document.getElementById('loadingScreen').classList.add('hidden');

  addIncrementListeners();
}

// Add listeners to +1 buttons
function addIncrementListeners() {
  document.querySelectorAll('.increment-btn').forEach(button => {
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