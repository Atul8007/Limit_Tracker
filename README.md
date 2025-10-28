# Universal Limit Tracker Chrome Extension

A Chrome extension to monitor usage limits for APIs and web services (e.g., Grok, Claude, Gemini, DeepSeek) in real-time, with notifications and text-to-speech (TTS) for reading the PRD aloud.

# Perplexity Settings Viewer 🔍

A Chrome extension that fetches and displays **Perplexity AI account settings and usage limits** in a clean, structured table view.  
You can compare key limits (e.g., GPT-4, Alpha/Beta access, uploads, queries, etc.) between Free and Pro accounts side-by-side.

---

## 🚀 Features

- **Live Data Fetching**  
  Retrieves public Perplexity user configuration

- **Visual Limit Dashboard**  
  Displays organized tables for:
  - Account limits (e.g., GPT-4, Alpha, Beta, Uploads, Queries)
  - Storage limits (file counts, file sizes)
  - Connector limits and API restrictions

- **Smart Highlighting**  
  Highlights key limits (like GPT-4 quota and upload limit) for quick comparison.

- **Lightweight & Private**  
  Works entirely in-browser using the `cookies` and `storage` APIs.  
  No external logging or tracking.

---

## 🧩 Installation

1. **Download or Clone**

   ```bash
   git clone https://github.com/Atul8007/Limit_Tracker.git
   cd Limit_Tracker
   ```

2. **Load in Chrome**

   - Open `chrome://extensions/`
   - Enable **Developer Mode**
   - Click **“Load unpacked”**
   - Select the `Limit_Tracker/Limit_Tracker` folder

3. **Launch**

   - Click the extension icon in Chrome’s toolbar  
   - The popup displays your current Perplexity limits and configuration

---

## 🖥️ How It Works

The extension’s popup (`popup.html`) loads a script (`popup.js`) that:

1. Fetches JSON from  
   `https://www.perplexity.ai/rest/user/settings`
2. Parses account capabilities (like `gpt4_limit`, `upload_limit`, etc.)
3. Dynamically builds tables using JavaScript
4. Highlights key quota values and displays sections such as:
   - **Account Limits**
   - **File & Storage**
   - **Connector / Repo Type Limits**

---

## 📁 Project Structure

```
Limit_Tracker/
├── manifest.json       # Chrome extension configuration
├── popup.html          # Popup interface layout
├── popup.js            # Logic to fetch and render settings
├── popup.css           # Styling for popup tables and layout
├── icon.png / icon16.png
└── README.md           # (this file)
```

---

## 🧠 Tech Stack

- **Chrome Manifest v3**
- **Vanilla JavaScript (ES6+)**
- **HTML / CSS (no dependencies)**
- **Chrome Storage + Cookies API**

---

## 🧾 Permissions

```json
{
  "permissions": ["storage", "cookies"],
  "host_permissions": ["https://www.perplexity.ai/rest/user/settings"]
}
```

Used only to fetch public JSON data and cache values locally in your browser.

---

## 🧑‍💻 Developer Notes

- Intended for **personal diagnostic or educational use** to understand how Perplexity account limits are represented.  
- The `/rest/user/settings` endpoint may return different fields for Free vs Pro users.  
- You can extend `popup.js` to add:
  - Comparison between multiple snapshots  
  - CSV export of current settings  
  - Dark mode or compact view  

---

## 🪪 License

MIT License © 2025 [Atul Mundakkal](https://github.com/Atul8007)

---

## 📬 Contact

If you find bugs or want to contribute:
- **GitHub Issues:** [Atul8007/Limit_Tracker](https://github.com/Atul8007/Limit_Tracker/issues)  
- **Author:** [Atul Mundakkal](https://github.com/Atul8007)
