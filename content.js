// content.js - Injected on Perplexity pages to fetch settings without CORS
console.log('Content script loaded on Perplexity page');

async function fetchSettings() {
  try {
    const response = await fetch('https://www.perplexity.ai/rest/user/settings', {
      method: 'GET',
      credentials: 'include'  // Include cookies for auth
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    // Store in chrome.storage for popup access
    await chrome.storage.local.set({ perplexitySettings: data });
    console.log('Settings fetched and stored:', data);
  } catch (error) {
    console.error('Error fetching settings in content script:', error);
    // Store error for popup
    await chrome.storage.local.set({ perplexityError: error.message });
  }
}

// Fetch on load (and optionally on a message from popup for refresh)
fetchSettings();

// Listen for refresh requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'refreshSettings') {
    fetchSettings();
    sendResponse({ status: 'refreshed' });
  }
});