// ---------------- Tabs ----------------
document.querySelectorAll('.tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// --------------- Popup Logic ----------------
const usageTableBody = document.querySelector('#usageTable tbody');
const loadingScreen = document.getElementById('loadingScreen');
const loadingBar = document.getElementById('loadingBar');
const loadingPercent = document.getElementById('loadingPercentage');

// Default services
const defaultServices = [
  { service: 'Grok', used:0, limit:10 },
  { service: 'Claude', used:0, limit:10 },
  { service: 'Gemini', used:0, limit:10 },
  { service: 'DeepSeek', used:0, limit:10 }
];

// Initialize storage
chrome.storage.local.get(['usageData'], (res)=>{
  if(!res.usageData) chrome.storage.local.set({usageData: defaultServices}, ()=>renderTable(defaultServices));
  else renderTable(res.usageData);
});

function renderTable(data){
  let progress=0;
  usageTableBody.innerHTML='';
  data.forEach((s,index)=>{
    const tr = document.createElement('tr');
    const remaining = s.limit - s.used;
    tr.innerHTML = `
      <td>${s.service}</td>
      <td>${s.used}</td>
      <td>${s.limit}</td>
      <td>
        ${remaining}
        <div class="progress-container">
          <div class="progress-bar" style="width:${(s.used/s.limit)*100}%;"></div>
        </div>
      </td>
      <td><button class="increment-btn btn-neon" data-service="${s.service}">+1</button></td>
    `;
    usageTableBody.appendChild(tr);
    progress = Math.round(((index+1)/data.length)*100);
    loadingPercent.textContent = progress + '%';
    loadingBar.style.width = progress + '%';
  });

  // Hide loading
  loadingScreen.style.display='none';

  // Increment buttons
  document.querySelectorAll('.increment-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const serviceName = btn.dataset.service;
      chrome.storage.local.get(['usageData'], res=>{
        let usageData = res.usageData || [];
        let s = usageData.find(x=>x.service===serviceName);
        if(s && s.used < s.limit) s.used++;
        chrome.storage.local.set({usageData}, ()=>renderTable(usageData));
      });
    });
  });
}

// Add/Update Service
document.getElementById('addService').addEventListener('click',()=>{
  const name = document.getElementById('serviceName').value.trim();
  const limit = parseInt(document.getElementById('maxLimit').value);
  if(!name || !limit) return alert('Enter valid name and limit');
  chrome.storage.local.get(['usageData'], res=>{
    let usageData = res.usageData || [];
    const existing = usageData.find(x=>x.service===name);
    if(existing){ existing.limit=limit; existing.used=0; }
    else usageData.push({service:name, used:0, limit:limit});
    chrome.storage.local.set({usageData}, ()=>renderTable(usageData));
  });
});

// Reset All
document.getElementById('resetAll').addEventListener('click',()=>{
  chrome.storage.local.get(['usageData'], res=>{
    let usageData = (res.usageData||[]).map(s=>({...s, used:0}));
    chrome.storage.local.set({usageData}, ()=>renderTable(usageData));
  });
});

// TTS Placeholder
let synth = window.speechSynthesis;
document.getElementById('readPRD').addEventListener('click', ()=>{
  const utter = new SpeechSynthesisUtterance("Product Requirements Document reading placeholder.");
  synth.speak(utter);
});
document.getElementById('stopReading').addEventListener('click', ()=>{ synth.cancel(); });
