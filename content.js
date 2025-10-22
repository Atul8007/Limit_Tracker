console.log("Content script loaded.");

// Variable to store fetched data
let userSettingsData = null;
let fetchError = null;

// Register listener immediately
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getUserSettings") {
    if (userSettingsData) {
      sendResponse({ success: true, data: userSettingsData });
    } else if (fetchError) {
      sendResponse({ success: false, error: fetchError });
    } else {
      sendResponse({ success: false, error: "Data not loaded yet" });
    }
    return true; // keep the channel open (optional here)
  }
});

// Fetch data as soon as script loads
async function fetchUserSettings() {
  try {
    const response = await fetch("https://www.perplexity.ai/rest/user/settings", {
      credentials: "include"
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    userSettingsData = await response.json();
    console.log("✅ User settings fetched", userSettingsData);

  } catch (err) {
    console.error("❌ Error fetching user settings:", err);
    fetchError = err.message;
  }
}

fetchUserSettings();
