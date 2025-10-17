Product Requirements Document: Universal Limit Tracker Chrome Extension with Real-Time Tracking and Markdown Text-to-Speech
1. Overview
1.1 Purpose
The Universal Limit Tracker Chrome Extension enables users to monitor usage limits for APIs or web services (e.g., Grok’s API at api.x.ai, Claude API at api.anthropic.com, Gemini API at generativelanguage.googleapis.com, DeepSeek API at api.deepseek.com, and web interfaces like grok.com) in real-time. It provides immediate updates to usage counts, remaining quotas, and notifications when nearing or hitting limits. Additionally, it supports text-to-speech (TTS) functionality to read aloud a specified Markdown file (e.g., Limit_Tracker_PRD.md), enhancing accessibility and usability for users who prefer or require auditory delivery of documentation.
1.2 Background
Services like Grok (~10-15 prompts every 2 hours for free-tier chat, ~10 image generations, ~3 file analyses per day), Claude (RPM/TPM/TPD limits, e.g., 100 daily messages for free tier), Gemini (RPM up to 1000 for some models), and DeepSeek (no strict limits but dynamic delays under load) impose usage restrictions. Users lack real-time dashboards, relying on delayed notifications or manual logging. Additionally, users may need auditory access to documentation (e.g., PRD in Markdown) for accessibility or convenience. This extension automates real-time tracking, displays usage in a popup, supports manual/API-based tracking, and integrates TTS to read Markdown content aloud.
1.3 Goals

Provide a user-friendly, real-time updating UI to view used and remaining limits for multiple services.
Automate real-time tracking of API requests via Chrome’s webRequest API.
Support manual increment for non-API interactions (e.g., chat prompts).
Deliver instant notifications when nearing (e.g., 2 requests left) or hitting limits.
Allow customizable service configurations (name, limit, URL pattern, reset interval).
Enable text-to-speech reading of a Markdown PRD file (Limit_Tracker_PRD.md) with proper parsing of Markdown elements.
Ensure compatibility with Chrome Manifest V3 and secure permission handling.

2. Scope
2.1 In-Scope

Chrome extension with a popup UI showing a table of services, usage counts, limits, and remaining quotas, updated in real-time.
Real-time automatic tracking of HTTP/HTTPS requests to user-defined URLs (e.g., ://api.x.ai/ for Grok, ://api.anthropic.com/ for Claude, ://generativelanguage.googleapis.com/ for Gemini, ://api.deepseek.com/ for DeepSeek).
Manual tracking via popup buttons for non-API interactions.
Real-time notifications for nearing/hitting limits.
Persistent storage of service configurations and usage data with real-time sync.
Real-time reset functionality (manual and auto-reset after intervals, e.g., 2 hours for Grok).
Text-to-speech feature to read Limit_Tracker_PRD.md aloud, parsing Markdown to plain text for natural speech.
Support for dynamic host permissions (optional) for universality.

2.2 Out-of-Scope

Real-time server-side limit validation (relies on user-configured limits).
Blocking requests when limits are reached (Manifest V3 restricts webRequest to read-only for non-enterprise users).
Mobile browser support (Chrome desktop only).
Advanced analytics (e.g., usage graphs) in v1.0.
Integration with specific service dashboards (e.g., xAI Console, Anthropic Console) beyond API request tracking.
TTS support for other file formats (e.g., PDF, HTML) in v1.0.
Custom voice selection for TTS (uses Chrome’s default voices).

3. Functional Requirements
3.1 Popup UI

Real-Time Display Table:
Columns: Service Name, Used, Limit, Remaining.
Example: “Grok | 12 | 15 | 3”; “Claude | 95 | 100 | 5” (daily messages for free tier).
Updates instantly via chrome.runtime.sendMessage from background script on each tracked event.


Configuration Inputs:
Service Name (text, e.g., “Grok”, “Claude”, “Gemini”, “DeepSeek”).
Max Limit (number, e.g., 15 for Grok prompts, 100 for Claude free daily messages, 1000 RPM for Gemini 1.5 Flash, unlimited/soft for DeepSeek).
URL Pattern (text, e.g., “://api.x.ai/”, “://api.anthropic.com/”, “://generativelanguage.googleapis.com/”, “://api.deepseek.com/”).
Reset Interval (number, seconds, e.g., 7200 for 2 hours, 86400 for 24 hours, 60 for 1 minute).
Add/Update button to save new or modified services, triggering immediate storage sync.


Manual Controls:
Reset All Counts button to set all service counts to 0, updating UI instantly.
Per-service increment button for manual tracking (e.g., Grok chat prompts), updating in real-time.
Read PRD Aloud button to trigger TTS reading of Limit_Tracker_PRD.md.


Styling:
Clean, minimal design using Arial font, bordered table, 300px-wide popup.
Responsive buttons and inputs for usability.



3.2 Background Tracking

Real-Time Automatic Tracking:
Use chrome.webRequest.onCompleted to detect HTTP/HTTPS requests matching user-defined URL patterns.
Increment count in chrome.storage.local and broadcast update to popup via chrome.runtime.sendMessage.


Storage:
Use chrome.storage.local to store service data: { [serviceName]: { limit, count, pattern, resetInterval, lastReset } } and PRD content.
Sync updates in real-time across popup and background.


Real-Time Reset Logic:
Auto-reset counts based on resetInterval (e.g., 2 hours for Grok, 24 hours for Claude/DeepSeek, 1 minute for Gemini RPM).
Store lastReset timestamp per service; check on each request to reset if interval elapsed.
Manual reset via popup button, triggering immediate storage update and UI refresh.


Real-Time Notifications:
Trigger chrome.notifications when remaining quota ≤ 2 or hits 0, sent instantly on count increment.
Example: “Grok Limit Alert: Used 13/15. Remaining: 2.”; “Claude Limit Alert: Used 98/100. Remaining: 2.”



3.3 Text-to-Speech for Markdown

Markdown Parsing:
Include Limit_Tracker_PRD.md in the extension folder.
Parse Markdown to plain text, stripping headers (e.g., #, ##), lists (e.g., -), and formatting (e.g., bold, italic) for natural speech.
Use a lightweight Markdown parser (e.g., marked.js or custom regex) to convert to readable text.


TTS Integration:
Use chrome.tts.speak to read parsed text aloud.
Support play/pause/stop controls via popup buttons.
Default to Chrome’s built-in voice (e.g., system default or Google US English).
Queue text in chunks (e.g., per paragraph) to avoid TTS buffer overflow.


Accessibility:
Ensure TTS starts/stops cleanly when popup is opened/closed.
Provide visual feedback (e.g., “Reading…” status) during TTS playback.



3.4 Permissions

Required:
storage: For persisting and syncing service configs/counts and PRD content in real-time.
notifications: For instant limit alerts.
webRequest: For monitoring API requests.
tts: For reading Markdown aloud.
host_permissions: For specific URLs (e.g., ://api.x.ai/, ://api.anthropic.com/, ://generativelanguage.googleapis.com/, ://api.deepseek.com/, ://grok.com/).
runtime: For messaging between background and popup.


Optional (Future):
optional_host_permissions: ["<all_urls>"] for dynamic URL additions via chrome.permissions.request.



4. Non-Functional Requirements
4.1 Performance

Lightweight: Minimize CPU/memory usage (Manifest V3 service worker).
Fast popup load: <500ms to display usage table.
Real-time updates: <100ms latency for count increments to reflect in UI.
TTS performance: Start reading within 1s of button click; handle large Markdown files (<500KB) efficiently.
Efficient storage: Use chrome.storage.local (4MB limit sufficient).

4.2 Security

Sanitize user inputs (service name, URL pattern) to prevent XSS.
Restrict host_permissions to user-defined URLs unless <all_urls> approved.
No external network calls beyond monitored APIs.
Ensure Markdown parsing does not execute scripts or unsafe content.

4.3 Compatibility

Target: Chrome (latest stable, v130+ as of Oct 2025).
Manifest V3 compliance (no persistent background scripts).
Tested with Grok (://api.x.ai/, ://grok.com/), Claude (://api.anthropic.com/), Gemini (://generativelanguage.googleapis.com/), DeepSeek (://api.deepseek.com/).
TTS tested with Chrome’s built-in voices on Windows, macOS, and Linux.

4.4 Usability

Intuitive UI: Real-time table updates, clear inputs, responsive buttons, TTS controls.
Error handling: Alert on invalid inputs (e.g., non-numeric limit) or missing PRD file.
Accessibility: TTS supports users with visual impairments; clear button labels.
Documentation: README for setup, usage, real-time features, and TTS instructions.

5. Technical Specifications
5.1 Architecture

Manifest: V3, defining permissions, popup, and service worker.
Popup: HTML (popup.html), CSS (inline), JavaScript (popup.js) for UI logic, real-time updates, and TTS controls.
Background: Service worker (background.js) for request monitoring, storage updates, notifications, and TTS initiation.
Storage: chrome.storage.local for configs/counts and PRD content, with onChanged listener for real-time sync.
TTS: chrome.tts for reading parsed Markdown; lightweight parser (e.g., regex or marked.js) for Markdown-to-text conversion.
APIs Used:
chrome.webRequest: Track completed requests.
chrome.storage: Persist and sync data in real-time.
chrome.notifications: Send instant alerts.
chrome.runtime: Message passing for real-time UI updates.
chrome.tts: Text-to-speech for Markdown.
(Future) chrome.permissions: Dynamic host permissions.



5.2 File Structure
limit-tracker-extension/
├── manifest.json        # Extension configuration
├── popup.html           # Popup UI
├── popup.js            # Popup logic with real-time updates and TTS
├── background.js       # Real-time request tracking, notifications, and TTS
├── Limit_Tracker_PRD.md # Markdown file for TTS
├── icon.png            # 128x128 toolbar icon
├── marked.min.js       # Optional: Markdown parser (if not using regex)

5.3 Implementation Details

Real-Time Tracking:
Match URLs using RegExp from patterns (e.g., *://api.x.ai/* → .*:\/\/api\.x\.ai\/.*).
On webRequest.onCompleted, increment count, update storage, and send chrome.runtime.sendMessage to popup.
Example message: { service: "Grok", count: 13, limit: 15 }.


Storage Schema:{
  "services": {
    "Grok": { "limit": 15, "count": 12, "pattern": "*://api.x.ai/*", "resetInterval": 7200000, "lastReset": 1729175820000 },
    "Claude": { "limit": 100, "count": 95, "pattern": "*://api.anthropic.com/*", "resetInterval": 86400000, "lastReset": 1729117800000 },
    "Gemini": { "limit": 1000, "count": 500, "pattern": "*://generativelanguage.googleapis.com/*", "resetInterval": 60000, "lastReset": 1729175940000 },
    "DeepSeek": { "limit": 999999, "count": 1000, "pattern": "*://api.deepseek.com/*", "resetInterval": 86400000, "lastReset": 1729117800000 }
  },
  "prdContent": "Markdown content of Limit_Tracker_PRD.md"
}


resetInterval: ms (e.g., 7200000 = 2 hours; 86400000 = 24 hours; 60000 = 1 minute).
lastReset: Timestamp (ms) for auto-reset checks.
prdContent: Stored Markdown text for faster TTS access.


Real-Time Notifications:
Trigger on count increment if remaining ≤ 2 or 0.
Include service name, used, remaining.


Real-Time Reset:
Manual: Button updates storage, broadcasts to popup.
Auto: Check lastReset vs. current time on each request; reset if resetInterval elapsed.


Real-Time UI Updates:
Popup listens for chrome.runtime.onMessage to refresh table.
Use chrome.storage.onChanged to sync config changes.


Markdown TTS:
Load Limit_Tracker_PRD.md at extension startup, store in chrome.storage.local.
Parse Markdown to plain text (e.g., strip #, -, **, using regex or marked.js).
Example regex: text.replace(/#{1,6}\s/g, '').replace(/[-*]\s/g, '').replace(/(\*\*|__)(.*?)\1/g, '$2').
Use chrome.tts.speak(parsedText, { rate: 1.0, pitch: 1.0, volume: 1.0 }).
Add pause (chrome.tts.pause) and stop (chrome.tts.stop) controls.



5.4 Sample Code Snippets

background.js (Real-time tracking and TTS initiation):
chrome.webRequest.onCompleted.addListener(async (details) => {
  const { services = {} } = await chrome.storage.local.get('services');
  for (const [name, data] of Object.entries(services)) {
    if (details.url.match(new RegExp(data.pattern.replace(/\*/g, '.*')))) {
      data.count = (data.count || 0) + 1;
      if (Date.now() - data.lastReset >= data.resetInterval) {
        data.count = 0;
        data.lastReset = Date.now();
      }
      await chrome.storage.local.set({ services });
      chrome.runtime.sendMessage({ service: name, count: data.count, limit: data.limit });
      const remaining = data.limit - data.count;
      if (remaining <= 2) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: `${name} Limit Alert`,
          message: `Used: ${data.count}/${data.limit}. Remaining: ${remaining}.`
        });
      }
    }
  }
}, { urls: ["<all_urls>"] });

// Load PRD at startup
chrome.runtime.onInstalled.addListener(async () => {
  const response = await fetch(chrome.runtime.getURL('Limit_Tracker_PRD.md'));
  const prdContent = await response.text();
  await chrome.storage.local.set({ prdContent });
});

// Handle TTS requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'readPRD') {
    chrome.storage.local.get('prdContent', ({ prdContent }) => {
      const plainText = prdContent
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/[-*]\s/g, '')   // Remove list markers
        .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
        .replace(/(\*|_)(.*?)\1/g, '$2');   // Remove italic
      chrome.tts.speak(plainText, { rate: 1.0, pitch: 1.0, volume: 1.0 });
    });
  } else if (message.action === 'stopTTS') {
    chrome.tts.stop();
  }
});


popup.js (Real-time UI and TTS controls):
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.service) {
    loadUsage(); // Refresh table on update
  }
});

async function loadUsage() {
  const { services = {} } = await chrome.storage.local.get('services');
  const table = document.getElementById('usageTable');
  table.innerHTML = '<tr><th>Service</th><th>Used</th><th>Limit</th><th>Remaining</th></tr>';
  for (const [name, data] of Object.entries(services)) {
    const used = data.count || 0;
    const limit = data.limit || 0;
    const remaining = limit - used;
    table.innerHTML += `<tr><td>${name}</td><td>${used}</td><td>${limit}</td><td>${remaining}</td><td><button class="increment" data-service="${name}">+1</button></td></tr>`;
  }
  // Add increment listeners
  document.querySelectorAll('.increment').forEach(button => {
    button.addEventListener('click', async () => {
      const service = button.dataset.service;
      const { services = {} } = await chrome.storage.local.get('services');
      services[service].count = (services[service].count || 0) + 1;
      await chrome.storage.local.set({ services });
      chrome.runtime.sendMessage({ service, count: services[service].count, limit: services[service].limit });
    });
  });
}

// Add service
document.getElementById('addService').addEventListener('click', async () => {
  const name = document.getElementById('serviceName').value;
  const limit = parseInt(document.getElementById('maxLimit').value);
  const pattern = document.getElementById('urlPattern').value;
  const resetInterval = parseInt(document.getElementById('resetInterval').value) * 1000;
  if (name && limit && pattern) {
    const { services = {} } = await chrome.storage.local.get('services');
    services[name] = { limit, count: services[name]?.count || 0, pattern, resetInterval, lastReset: Date.now() };
    await chrome.storage.local.set({ services });
    loadUsage();
  }
});

// Read PRD
document.getElementById('readPRD').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'readPRD' });
});

// Stop TTS
document.getElementById('stopTTS').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stopTTS' });
});

// Initial load
loadUsage();


popup.html (Updated with TTS controls):
<!DOCTYPE html>
<html>
<head>
  <title>Limit Tracker</title>
  <style>
    body { font-family: Arial; width: 300px; padding: 10px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    button { margin: 5px; }
  </style>
</head>
<body>
  <h2>Usage Limits</h2>
  <table id="usageTable">
    <tr><th>Service</th><th>Used</th><th>Limit</th><th>Remaining</th><th>Manual</th></tr>
  </table>
  <h3>Add/Configure Service</h3>
  <input id="serviceName" placeholder="Service Name (e.g., Grok)">
  <input id="maxLimit" type="number" placeholder="Max Limit (e.g., 15)">
  <input id="urlPattern" placeholder="URL Pattern (e.g., *://api.x.ai/*)">
  <input id="resetInterval" type="number" placeholder="Reset Interval (seconds)">
  <button id="addService">Add/Update</button>
  <button id="resetAll">Reset All Counts</button>
  <h3>Read PRD</h3>
  <button id="readPRD">Read PRD Aloud</button>
  <button id="stopTTS">Stop Reading</button>
  <script src="popup.js"></script>
</body>
</html>



6. User Stories

As a user, I want to hear the PRD (Limit_Tracker_PRD.md) read aloud via TTS so I can access documentation auditorily.
As a user, I want to see a table of my service usage (used/limit/remaining) updating in real-time to plan my workflow.
As a user, I want to configure services with names, limits, URL patterns, and reset intervals to track APIs like Grok, Claude, Gemini, and DeepSeek.
As a user, I want instant notifications when I’m near or at my limit to avoid disruptions.
As a user, I want manual increment buttons for non-API tracking (e.g., Grok chat prompts) with real-time updates.
As a user, I want manual and auto-resets to reflect immediately in the UI to align with service policies (e.g., Grok’s 2-hour window, Claude’s daily limits, Gemini’s per-minute RPM, DeepSeek’s dynamic no-limit policy).

7. Success Metrics

Adoption: 100+ users load the extension within 3 months of release.
Usability: 90% of users configure at least one service and use TTS without errors.
Reliability: Tracks 95%+ of API requests correctly (excluding cached requests); TTS reads 100% of PRD content accurately.
Real-Time Performance: 90% of usage updates reflect in UI within 100ms; TTS starts within 1s.
Engagement: Users open the popup 5+ times daily; 50% use TTS feature at least once.

8. Risks and Mitigations

Risk: Real-time updates overload service worker or UI.
Mitigation: Optimize message passing; batch storage updates for high-frequency requests.


Risk: TTS misreads Markdown due to poor parsing.
Mitigation: Use robust parser (e.g., marked.js or regex); test with complex Markdown.


Risk: Users enter invalid URL patterns.
Mitigation: Validate patterns in popup.js (e.g., check for :// format).


Risk: Cached requests not detected by webRequest.
Mitigation: Include manual increment buttons in v1.0.


Risk: Variable limits (e.g., DeepSeek’s dynamic no-limits) lead to inaccurate tracking.
Mitigation: Allow high/infinite limits and note in docs to monitor for delays.


Risk: High-frequency resets (e.g., Gemini’s 1-minute RPM) strain storage.
Mitigation: Use in-memory counters for short intervals, sync periodically.



9. Timeline

Week 1: Set up manifest, popup UI, real-time storage sync, and TTS integration.
Week 2: Implement webRequest tracking, real-time messaging, notifications, and Markdown parsing.
Week 3: Add real-time reset logic (manual/auto), TTS controls, and test with Grok, Claude, Gemini, DeepSeek APIs.
Week 4: Polish UI, optimize performance, test TTS with PRD, and prepare for Chrome Web Store.
Release: Publish by Nov 14, 2025.

10. Future Enhancements

Usage charts (e.g., real-time prompts over time) using canvas in popup.
Dynamic permissions for any URL via chrome.permissions.request.
Export/import service configs as JSON.
Support for token-based limits (e.g., Grok/Claude/Gemini TPM) via optional token parsing.
Background polling for services with no API requests (e.g., chat interfaces).
TTS voice selection and speed/pitch controls.

11. References

Chrome Extensions: https://developer.chrome.com/docs/extensions
Chrome TTS API: https://developer.chrome.com/docs/extensions/reference/api/tts
xAI API Limits: https://docs.x.ai/docs/consumption-and-rate-limits
Anthropic Claude Rate Limits: https://docs.anthropic.com/en/api/rate-limits
Google Gemini Rate Limits: https://ai.google.dev/gemini-api/docs/rate-limits
DeepSeek API Rate Limits: https://api-docs.deepseek.com/quick_start/rate_limit
Grok Plans: https://x.ai/grok
X Premium: https://help.x.com/en/using-x/x-premium

Last Updated: October 17, 2025, 05:38 PM IST
