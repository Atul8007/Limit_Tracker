# Usage Guide – Perplexity Settings Viewer

This guide explains how to use the **Perplexity Settings Viewer** Chrome extension to fetch and analyze your Perplexity AI account settings and limits.

---

## 🧩 Overview

The extension fetches live JSON data from the public Perplexity endpoint:

```
https://www.perplexity.ai/rest/user/settings
```

It then displays your account’s feature limits, upload capacities, and configuration values in a structured popup interface.

---

## 🚀 Steps to Use

### 1. Install the Extension

1. Clone or download the project from GitHub:

   ```bash
   git clone https://github.com/Atul8007/Limit_Tracker.git
   cd Limit_Tracker
   ```

2. Open Chrome and go to:

   ```
   chrome://extensions/
   ```

3. Enable **Developer Mode** (top-right corner).  
4. Click **Load unpacked** and select the `Limit_Tracker/Limit_Tracker` folder.

---

### 2. Open the Extension

- Once loaded, the extension icon appears in Chrome’s toolbar.  
- Click the icon to open the popup window.  

The popup interface will automatically fetch and display your Perplexity configuration data.

---

### 3. Understand the Display

The popup includes three major sections:

#### 🧠 **Account Limits**
Displays your key usage settings such as:
- `gpt4_limit`
- `pplx_alpha_limit`
- `pplx_beta_limit`
- `upload_limit`
- `pages_limit`
- `query_count`
- `default_model`

#### 💾 **File & Storage**
Shows storage-related limits from the `connector_limits` object:
- `max_files_per_user`
- `max_file_size_mb`
- `daily_attachment_limit`

#### 🔗 **Connector / Repo Type Limits**
If available, shows additional repo or API-based constraints such as:
- `repo_type_limits.COLLECTION.max_files`
- `repo_type_limits.COLLECTION.max_folders`

---

### 4. Highlighted Limits

Some important values (like `gpt4_limit`, `upload_limit`, and `pplx_alpha_limit`) are visually highlighted for quick comparison between Free and Pro accounts.

---

### 5. Troubleshooting

| Issue | Possible Cause | Solution |
|-------|----------------|-----------|
| No data appears | Endpoint unavailable or cookies restricted | Reload popup or check Chrome privacy settings |
| Some fields missing | Perplexity API response differs per account type | Compare with a different account |
| Styling looks off | CSS not loaded | Reload the extension or clear cache |

---

## ⚙️ Developer Tips

- The core logic resides in `popup.js` — it dynamically builds tables using DOM manipulation.  
- You can customize the headers or add new data fields easily by modifying the `createTable()` or `renderSettings()` functions.  
- To add comparison between multiple accounts, you can extend the script to store fetched data in `chrome.storage` and display snapshots.

---

## 🧾 Example JSON Response (from Perplexity)

```json
{
  "gpt4_limit": 600,
  "pplx_alpha_limit": 20,
  "pplx_beta_limit": 50,
  "pages_limit": 100,
  "upload_limit": 500,
  "create_limit": 99,
  "connector_limits": {
    "global_file_count": 500,
    "max_file_size_mb": 50,
    "repo_type_limits": {
      "COLLECTION": {
        "max_files": 50,
        "max_folders": 50
      }
    }
  }
}
```

---

## 📚 Learn More

- [Perplexity AI](https://www.perplexity.ai)
- [Chrome Extensions Developer Guide](https://developer.chrome.com/docs/extensions/mv3/)

---

**Author:** [Atul Mundakkal](https://github.com/Atul8007)  
**License:** [MIT License](./LICENSE)

