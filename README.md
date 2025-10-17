Universal Limit Tracker Chrome Extension
A Chrome extension to monitor usage limits for APIs and web services (e.g., Grok, Claude, Gemini, DeepSeek) in real-time, with notifications and text-to-speech (TTS) for reading the PRD aloud.
Features

Real-Time Tracking: Monitors API requests (e.g., ://api.x.ai/, ://api.anthropic.com/) and manual inputs with instant UI updates.
Usage Dashboard: Displays service name, used, limit, and remaining in a popup table.
Notifications: Alerts when nearing (≤2 remaining) or hitting limits.
Manual Tracking: Increment buttons for non-API interactions (e.g., Grok chat prompts).
Auto/Manual Reset: Resets counts based on service intervals (e.g., 2 hours for Grok, 24 hours for Claude/DeepSeek, 1 minute for Gemini RPM) or manually.
Text-to-Speech: Reads Limit_Tracker_PRD.md aloud using Chrome’s TTS, with play/stop controls.

Installation

Download:
Clone or download the extension folder: limit-tracker-extension/.


Load in Chrome:
Open Chrome and navigate to chrome://extensions/.
Enable Developer mode (top right).
Click Load unpacked and select the limit-tracker-extension/ folder.


Verify:
The extension icon appears in the toolbar.
Click the icon to open the popup.



Usage

Configure Services:
In the popup, enter:
Service Name: e.g., “Grok”, “Claude”, “Gemini”, “DeepSeek”.
Max Limit: e.g., 15 (Grok prompts), 100 (Claude daily messages), 1000 (Gemini RPM).
URL Pattern: e.g., *://api.x.ai/*, *://api.anthropic.com/*.
Reset Interval: Seconds, e.g., 7200 (2 hours for Grok), 86400 (24 hours for Claude).


Click Add/Update to save.


Track Usage:
API requests auto-increment counts for matching URLs.
Click +1 button for manual increments (e.g., chat prompts).
View real-time usage in the table (Service | Used | Limit | Remaining).


Reset Counts:
Click Reset All Counts for manual reset.
Auto-resets occur based on intervals (e.g., every 2 hours for Grok).


Read PRD:
Click Read PRD Aloud to hear Limit_Tracker_PRD.md via TTS.
Click Stop Reading to halt playback.


Notifications:
Alerts appear when 2 or fewer requests remain or limits are hit.



File Structure
limit-tracker-extension/
├── manifest.json        # Extension configuration
├── popup.html           # Popup UI
├── popup.js            # Popup logic with real-time updates and TTS
├── background.js       # Real-time tracking, notifications, and TTS
├── Limit_Tracker_PRD.md # Markdown file for TTS
├── icon.png            # 128x128 toolbar icon

Requirements

Browser: Chrome (v130+ as of Oct 2025).
Permissions:
storage: Save configs and counts.
notifications: Limit alerts.
webRequest: Track API requests.
tts: Read PRD aloud.
runtime: Real-time messaging.
host_permissions: *://api.x.ai/*, *://api.anthropic.com/*, *://generativelanguage.googleapis.com/*, *://api.deepseek.com/*, *://grok.com/*.



Limitations

Tracks only completed HTTP/HTTPS requests; cached requests may be missed.
DeepSeek’s dynamic no-limits may require manual delay monitoring.
TTS uses Chrome’s default voice; no custom voice selection in v1.0.
No request blocking (Manifest V3 limitation).

Troubleshooting

No Tracking: Ensure URL patterns match (e.g., *://api.x.ai/*). Check chrome://extensions/ for errors.
No TTS: Verify Limit_Tracker_PRD.md exists in the folder. Check Chrome’s TTS settings.
Permissions: Add new URLs manually in manifest.json or (future) via dynamic permissions.

References

Chrome Extensions
xAI API Limits
Claude Rate Limits
Gemini Rate Limits
DeepSeek Rate Limits

Last Updated: October 17, 2025, 05:42 PM IST
