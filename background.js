let services = []; // In-memory cache

// Load services on startup
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get('services');
  services = data.services || [];
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'checkLimits') {
    services = message.services;
    checkLimits();
  } else if (message.action === 'readPRD') {
    readPRD();
  }
});

// Track API requests using webRequest
chrome.webRequest.onCompleted.addListener(
  async (details) => {
    const { services: storedServices } = await chrome.storage.local.get('services');
    services = storedServices || [];
    for (let service of services) {
      if (details.url.match(new RegExp(service.urlPattern.replace(/\*/g, '.*')))) {
        service.used++;
        await chrome.storage.local.set({ services });
        checkLimits();
        break;
      }
    }
  },
  { urls: ["<all_urls>"] } // Filtered by host_permissions in manifest
);

// Auto-reset interval checker (runs every minute)
setInterval(async () => {
  const { services: storedServices } = await chrome.storage.local.get('services');
  services = storedServices || [];
  const now = Date.now();
  services.forEach(service => {
    if (now - service.lastReset >= service.resetInterval * 1000) {
      service.used = 0;
      service.lastReset = now;
    }
  });
  await chrome.storage.local.set({ services });
}, 60000); // Check every minute

// Check limits and notify
function checkLimits() {
  services.forEach(service => {
    const remaining = service.limit - service.used;
    if (remaining <= 2 && remaining > 0) {
      chrome.notifications.create({
        title: 'Limit Approaching',
        message: `${service.name}: ${remaining} requests remaining!`,
        type: 'basic',
        iconUrl: 'icon.png'
      });
    } else if (remaining <= 0) {
      chrome.notifications.create({
        title: 'Limit Reached',
        message: `${service.name}: Limit hit! Wait for reset.`,
        type: 'basic',
        iconUrl: 'icon.png'
      });
    }
  });
}

// Read PRD via TTS
async function readPRD() {
  // Fetch the PRD content (since background can't access file system directly, assume it's stored or hardcode for simplicity; in production, use fetch if bundled)
  // For this example, we'll simulate fetching the text. In reality, bundle it or use chrome.runtime.getURL.
  const prdUrl = chrome.runtime.getURL('Limit_Tracker_PRD.md');
  fetch(prdUrl)
    .then(response => response.text())
    .then(text => {
      chrome.tts.speak(text, { rate: 1.0, pitch: 1.0, volume: 1.0 });
    })
    .catch(error => console.error('TTS Error:', error));
}

// Listen for storage changes to update cache
chrome.storage.onChanged.addListener((changes) => {
  if (changes.services) services = changes.services.newValue;
});