# Universal Limit Tracker – How to Use

A Chrome extension to **track usage limits** for AI services like Grok, Claude, Gemini, and DeepSeek.

---

## Step 1: Open the Extension

- Click the **Limit Tracker icon** in your Chrome toolbar.  
- The popup will show the **Usage Dashboard** with services and usage stats.

---

## Step 2: Navigate Tabs

- **Usage Tab**: View all services, current usage, remaining quota, and increment usage.  
- **Settings Tab**: Add or update services and manage overall controls.

---

## Step 3: Add or Update a Service

1. Go to the **Settings Tab**.  
2. Fill in the fields:
   - **Service Name**: e.g., Grok  
   - **Max Limit**: Total allowed usage (e.g., 15)  
   - **URL Pattern**: Optional, pattern for requests (e.g., `*://api.x.ai/*`)  
   - **Reset Interval**: Optional, time in seconds to automatically reset usage  
3. Click **Add/Update**.  

> New services appear immediately in the **Usage Dashboard**. Existing services get updated.

---

## Step 4: Increment Usage

- In the **Usage Tab**, click the **+1** button next to a service to manually increment usage.  
- Progress bars update automatically.

---

## Step 5: Reset or Read PRD

- **Reset All Counts**: Sets usage for all services to 0.  
- **Read PRD Aloud**: Reads placeholder text using browser TTS.  
- **Stop Reading**: Stops TTS immediately.

---

## Tips

- Progress bars are animated differently for each service:  
  - **Grok**: Shimmer gradient  
  - **Claude**: Scanning gradient  
  - **ChatGPT**: Diagonal stripes  
- Usage data is **stored locally** in your browser and persists between sessions.  
- Use **+1 buttons** to track requests in real-time.

---

## Troubleshooting

- **Loading Screen Stuck**: Wait a few seconds; default usage data initializes automatically.  
- **Increment Not Working**: Ensure the extension is loaded correctly.  
- **TTS Not Working**: Make sure your browser supports speech synthesis.
