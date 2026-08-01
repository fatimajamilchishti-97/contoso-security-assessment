// app.js — Contoso Security Assessment dashboard (vanilla JS SPA, calls the real Express API)

// ---- Auth guard ----
const token = localStorage.getItem('contoso_token');
const userRaw = localStorage.getItem('contoso_user');
if (!token || !userRaw) window.location.href = 'index.html';
const currentUser = userRaw ? JSON.parse(userRaw) : { username: 'admin', role: 'Security Administrator' };
document.getElementById('userName').textContent = currentUser.username;
document.getElementById('userAvatar').textContent = currentUser.username.charAt(0).toUpperCase();
document.getElementById('logoutBtn').addEventListener('click', async () => { await Api.logout(); window.location.href = 'index.html'; });

// ---- Minimal original icon set (plain SVG, no external dependency) ----
const ICONS = {
  dashboard: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/>',
  building: '<rect x="4" y="3" width="16" height="18" rx="1"/><line x1="8" y1="7" x2="8" y2="7.01"/><line x1="12" y1="7" x2="12" y2="7.01"/><line x1="16" y1="7" x2="16" y2="7.01"/><line x1="8" y1="11" x2="8" y2="11.01"/><line x1="12" y1="11" x2="12" y2="11.01"/><line x1="16" y1="11" x2="16" y2="11.01"/><line x1="9" y1="21" x2="9" y2="17" /><line x1="15" y1="21" x2="15" y2="17"/>',
  network: '<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><line x1="7" y1="7" x2="10.5" y2="16"/><line x1="17" y1="7" x2="13.5" y2="16"/>',
  play: '<circle cx="12" cy="12" r="9.3"/><polygon points="10,8 16,12 10,16"/>',
  shield: '<path d="M12 3l7 3v6c0 5-3.2 8-7 9-3.8-1-7-4-7-9V6z"/>',
  bulb: '<circle cx="12" cy="10" r="6"/><line x1="9.5" y1="19" x2="14.5" y2="19"/><line x1="10" y1="16" x2="14" y2="16"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><polyline points="3,6 12,13 21,6"/>',
  chat: '<path d="M4 5h16v11H8l-4 4z"/>',
  cloud: '<path d="M7 18a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 17.2 8.03 4 4 0 0 1 17 18H7z"/>',
  fingerprint: '<path d="M12 3a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V8a5 5 0 0 0-5-5z"/><path d="M4 13v1a8 8 0 0 0 16 0v-1"/>',
  drive: '<rect x="3" y="9" width="18" height="10" rx="1.5"/><line x1="6" y1="14" x2="6" y2="14.01"/><line x1="10" y1="14" x2="10" y2="14.01"/><path d="M8 3l4 6h5"/>',
  server: '<rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><line x1="7" y1="7" x2="7" y2="7.01"/><line x1="7" y1="17" x2="7" y2="17.01"/>',
  wifi: '<path d="M2 8.5a15 15 0 0 1 20 0"/><path d="M5.5 12a10 10 0 0 1 13 0"/><path d="M9 15.5a5 5 0 0 1 6 0"/><line x1="12" y1="19" x2="12" y2="19.01"/>',
  smartphone: '<rect x="7" y="2" width="10" height="20" rx="1.5"/><line x1="11" y1="18" x2="13" y2="18"/>',
  bug: '<circle cx="12" cy="13" r="6"/><line x1="12" y1="7" x2="12" y2="4"/><line x1="8" y1="9" x2="5" y2="6"/><line x1="16" y1="9" x2="19" y2="6"/><line x1="6" y1="13" x2="2" y2="13"/><line x1="22" y1="13" x2="18" y2="13"/><line x1="8" y1="17" x2="5" y2="20"/><line x1="16" y1="17" x2="19" y2="20"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  cursor: '<path d="M4 3l14 6-6 2-2 6z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><line x1="3" y1="12" x2="21" y2="12"/>',
  key: '<circle cx="8" cy="14" r="4"/><line x1="11" y1="11" x2="19" y2="3"/><line x1="15" y1="7" x2="18" y2="10"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><polyline points="7,9 10,12 7,15"/><line x1="12" y1="15" x2="16" y2="15"/>',
  timer: '<circle cx="12" cy="13" r="8"/><line x1="12" y1="13" x2="12" y2="9"/><line x1="12" y1="13" x2="15" y2="14.5"/><line x1="9" y1="2" x2="15" y2="2"/>',
  check: '<circle cx="12" cy="12" r="9.3"/><polyline points="7.5,12.5 10.5,15.5 16.5,9"/>',
  alert: '<path d="M12 3l10 18H2z"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="12" y1="17" x2="12" y2="17.01"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="1.5"/><rect x="9" y="2" width="6" height="4" rx="1"/>',
  chevronLeft: '<polyline points="14,4 8,12 14,20"/>',
  chevronRight: '<polyline points="10,4 16,12 10,20"/>',
  rotate: '<path d="M4 12a8 8 0 1 1 2.5 5.8"/><polyline points="4,17 4,12 9,12"/>',
  logout: '<path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4"/><polyline points="14,7 19,12 14,17"/><line x1="19" y1="12" x2="8" y2="12"/>',
  pause: '<circle cx="12" cy="12" r="9.3"/><line x1="10" y1="8.5" x2="10" y2="15.5"/><line x1="14" y1="8.5" x2="14" y2="15.5"/>',
  party: '<circle cx="12" cy="12" r="9.3"/><path d="M8 12l2.5 2.5L16 9"/>',
  shieldOff: '<path d="M4.5 4.5l15 15"/><path d="M12 3l7 3v6c0 5-3.2 8-7 9-3.8-1-7-4-7-9V6z"/>',
};
function icon(name, size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
}

// ---- Badge / status helpers ----
function sevBadge(level) {
  const map = { Critical: 'badge-critical', High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };
  return `<span class="badge ${map[level] || 'badge-neutral'}">${level}</span>`;
}
function statusBadge(status, onclick) {
  const map = { Open: 'badge-open', 'In Progress': 'badge-progress', Active: 'badge-active' };
  const attr = onclick ? `style="cursor:pointer" onclick="${onclick}"` : '';
  return `<span class="badge ${map[status] || 'badge-neutral'}" ${attr}>${status}${onclick ? ' &#8635;' : ''}</span>`;
}
const sevHex = { Critical: 'var(--critical)', High: 'var(--high)', Medium: 'var(--medium)', Low: 'var(--low)' };

function pageHeader(eyebrow, title, desc, iconName) {
  return `<div class="page-header">
    <div class="eyebrow">${iconName ? icon(iconName, 16) : ''} ${eyebrow}</div>
    <h1>${title}</h1>
    <p>${desc}</p>
  </div>`;
}
function groupBy(arr, key) { return arr.reduce((acc, item) => { (acc[item[key]] = acc[item[key]] || []).push(item); return acc; }, {}); }
function countBy(arr, key) { const map = {}; arr.forEach(r => { map[r[key]] = (map[r[key]] || 0) + 1; }); return Object.entries(map).map(([k, v]) => ({ [key]: k, count: v })); }

// ---- Sidebar (trimmed to 6 destinations) ----
const NAV = [
  { section: null, items: [{ key: 'overview', label: 'Dashboard', icon: 'dashboard' }] },
  { section: 'Security Center', items: [
    { key: 'profile', label: 'Company Profile', icon: 'building' },
    { key: 'network', label: 'Network Architecture', icon: 'network' },
    { key: 'attack', label: 'Attack Simulation', icon: 'play' },
    { key: 'posture', label: 'Security Posture', icon: 'shield' },
  ] },
  { section: 'Insights', items: [{ key: 'recommendations', label: 'Recommendations', icon: 'bulb' }, { key: 'incident', label: 'Incident Response Plan', icon: 'shield' }, { key: 'privacy', label: 'Data Protection & Privacy', icon: 'lock' }] },
];

function buildSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = NAV.map(sec => `
    ${sec.section ? `<div class="section-label">${sec.section}</div>` : ''}
    ${sec.items.map(item => `<div class="nav-item" data-route="${item.key}">${icon(item.icon, 20)}<span>${item.label}</span></div>`).join('')}
  `).join('');
  sidebar.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => { location.hash = el.dataset.route; });
  });
}
buildSidebar();

const routes = { overview: renderOverview, profile: renderProfile, network: renderNetwork, attack: renderAttack, posture: renderPosture, recommendations: renderRecommendations, incident: renderIncident, privacy: renderPrivacy };
const content = document.getElementById('content');

async function navigate() {
  const route = (location.hash || '#overview').replace('#', '');
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.route === route));
  content.innerHTML = '<div class="loading">Loading…</div>';
  const renderFn = routes[route] || renderOverview;
  try {
    await renderFn();
    content.insertAdjacentHTML('beforeend', footerHtml());
  } catch (err) {
    content.innerHTML = `<div class="login-error" style="max-width:560px;">Could not load data from the API.
      Make sure the backend is running: <code>cd backend && npm install && npm start</code>.<br><br>${err.message}</div>`;
  }
}
function footerHtml() {
  const cols = [
    { title: 'Company', links: ['About This Assessment', 'Contact Security Team', 'Privacy Policy'] },
    { title: 'Security Center', links: ['Threat Intelligence', 'Attack Simulation', 'Recommendations'] },
    { title: 'Resources', links: ['Report an Incident', 'Compliance Documentation'] },
  ];
  return `<div class="site-footer">
    <div class="footer-cols">
      ${cols.map(col => `<div>
        <div class="footer-col-title">${col.title}</div>
        ${col.links.map(l => `<div class="footer-link">${l}</div>`).join('')}
      </div>`).join('')}
    </div>
    <div class="footer-bottom">© 2026 Contoso Corporation · Security Operations · Internal use only</div>
  </div>`;
}
window.addEventListener('hashchange', navigate);
navigate();

// =====================================================================
// OVERVIEW
// =====================================================================
async function renderOverview() {
  const [summary, org, activity] = await Promise.all([
    Api.get('/dashboard/summary'), Api.get('/organization'), Api.get('/activity-log'),
  ]);
  const t = summary.totals;
  content.innerHTML = `
    ${pageHeader('Security Operations Center', 'Dashboard Overview', `Live posture summary for <strong>${org.name}</strong> — ${org.industry}, ${org.employees} employees, ${org.headquarters}.`, 'dashboard')}
    <div class="grid grid-4 section">
      <div class="card accent-blue stat-card"><div><h3>Active Threats Tracked</h3><div class="stat">${t.threats}</div></div><div class="icon-badge" style="background:var(--ms-blue)">${icon('network', 26)}</div></div>
      <div class="card accent-critical stat-card"><div><h3>Critical-Severity Threats</h3><div class="stat critical">${t.criticalThreats}</div></div><div class="icon-badge" style="background:var(--critical)">${icon('alert', 26)}</div></div>
      <div class="card accent-high stat-card"><div><h3>Open Vulnerabilities</h3><div class="stat high">${t.openVulnerabilities}</div></div><div class="icon-badge" style="background:var(--high)">${icon('bug', 26)}</div></div>
      <div class="card accent-low stat-card"><div><h3>Recommendations</h3><div class="stat">${t.recommendations}</div></div><div class="icon-badge" style="background:var(--low)">${icon('bulb', 26)}</div></div>
    </div>
    <div class="grid grid-2 section">
      <div class="card"><div class="card-title-row"><h2>${icon('network', 22)} Threats by Severity</h2></div>${donut(summary.threatsBySeverity, 'severity')}</div>
      <div class="card"><div class="card-title-row"><h2>${icon('bug', 22)} Vulnerabilities by Risk</h2></div>${bars(summary.vulnsByRisk, 'risk')}</div>
    </div>
    <div class="card section">
      <div class="card-title-row"><h2>${icon('clipboard', 22)} Recent Security Activity <span class="live-tag">live</span></h2></div>
      ${activity.map(a => `<div class="activity-item"><div class="activity-time">${a.time}</div><div>${sevBadge(a.severity)} &nbsp; ${a.event}</div></div>`).join('')}
    </div>
  `;
}
function bars(rows, key) {
  const max = Math.max(...rows.map(r => r.count), 1);
  return rows.map(r => `<div class="bar-row"><div class="bar-label">${r[key]}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.round((r.count / max) * 100)}%;background:${sevHex[r[key]] || 'var(--ms-blue)'}"></div></div><div class="bar-value">${r.count}</div></div>`).join('');
}
function donut(rows, key) {
  const total = rows.reduce((s, r) => s + r.count, 0) || 1;
  let acc = 0;
  const stops = rows.map(r => { const start = acc / total * 360; acc += r.count; const end = acc / total * 360; return `${sevHex[r[key]] || 'var(--ms-blue)'} ${start}deg ${end}deg`; }).join(', ');
  return `<div class="donut-row">
    <div class="donut" style="background:conic-gradient(${stops})"><div class="donut-hole"><div class="donut-total">${total}</div><div class="donut-label">total</div></div></div>
    <div>${rows.map(r => `<div class="donut-legend-item"><span class="dot" style="background:${sevHex[r[key]] || 'var(--ms-blue)'}"></span><strong>${r[key]}</strong><span class="muted">(${r.count})</span></div>`).join('')}</div>
  </div>`;
}

// =====================================================================
// COMPANY PROFILE (Microsoft intro + org + services + infra + mobile risk)
// =====================================================================
async function renderProfile() {
  const [msft, org, infra, services, mobile] = await Promise.all([
    Api.get('/microsoft-intro'), Api.get('/organization'), Api.get('/infrastructure'), Api.get('/digital-services'), Api.get('/mobile-risks'),
  ]);
  const byCategory = groupBy(infra, 'category');
  content.innerHTML = `
    ${pageHeader('Company Profile', 'Microsoft & the Contoso Case Study', "A brief introduction to Microsoft's ecosystem, the organization we use to demonstrate real-world Microsoft 365 security, and the mobile/device risks that come with it.", 'building')}
    <div class="card section accent-blue">
      <div class="card-title-row"><h2>${icon('building', 22)} About Microsoft</h2></div>
      <div class="grid grid-4" style="margin-bottom:14px;">
        <div><h3>Founded</h3><div class="value">${msft.founded}</div></div>
        <div><h3>Founders</h3><div class="value">${msft.founders}</div></div>
        <div><h3>Headquarters</h3><div class="value">${msft.headquarters}</div></div>
        <div><h3>Core Products</h3><div class="value">${msft.products}</div></div>
      </div>
      <p class="subtext">${msft.description}</p>
    </div>
    <div class="card section accent-teal">
      <div class="card-title-row"><h2>${icon('shield', 22)} Case Study Organization</h2></div>
      <div class="grid grid-4" style="margin-bottom:14px;">
        <div><h3>Industry</h3><div class="value">${org.industry}</div></div>
        <div><h3>Founded</h3><div class="value">${org.founded}</div></div>
        <div><h3>Headquarters</h3><div class="value">${org.headquarters}</div></div>
        <div><h3>Employees</h3><div class="value">${org.employees}</div></div>
      </div>
      <p class="subtext">${org.description}</p>
    </div>
    <div class="card section">
      <div class="card-title-row"><h2>${icon('cloud', 22)} Digital Services in Use</h2></div>
      <div class="grid grid-3">
        ${services.map(s => `<div class="service-tile"><div class="icon-badge" style="background:${s.color}">${icon(s.icon === 'mail' ? 'mail' : s.icon === 'message-square' ? 'chat' : s.icon === 'cloud' ? 'cloud' : s.icon === 'shield' ? 'fingerprint' : 'drive', 20)}</div><div><div class="service-name">${s.name}</div><div class="service-purpose">${s.purpose}</div></div></div>`).join('')}
      </div>
    </div>
    ${Object.keys(byCategory).map(cat => `
      <div class="card section"><div class="card-title-row"><h2>${icon('server', 22)} ${cat}</h2></div>
        <table><thead><tr><th>Item</th><th>Description</th></tr></thead>
        <tbody>${byCategory[cat].map(i => `<tr><td><strong>${i.item}</strong></td><td>${i.description}</td></tr>`).join('')}</tbody></table>
      </div>`).join('')}
    <div class="card section">
      <div class="card-title-row"><h2>${icon('smartphone', 22)} Mobile & Device Risk</h2></div>
      <table><thead><tr><th>Risk</th><th>Description</th><th>Mitigation</th><th>Severity</th></tr></thead>
      <tbody>${mobile.map(r => `<tr><td><strong>${r.risk}</strong></td><td>${r.description}</td><td>${r.mitigation}</td><td>${sevBadge(r.severity)}</td></tr>`).join('')}</tbody></table>
    </div>
  `;
}

// =====================================================================
// NETWORK ARCHITECTURE
// =====================================================================
async function renderNetwork() {
  const [topo, protocols, devices, cloud] = await Promise.all([
    Api.get('/network/topology'), Api.get('/network/protocols'), Api.get('/network/devices'), Api.get('/network/cloud'),
  ]);
  content.innerHTML = `
    ${pageHeader('Infrastructure', 'Network Architecture', "Network topology, communication protocols, network devices, and cloud infrastructure underpinning Contoso's environment.", 'network')}
    <div class="card section"><div class="card-title-row"><h2>${icon('network', 22)} Network Topology</h2></div>
      <table><thead><tr><th>Site / Segment</th><th>Topology</th><th>Description</th></tr></thead>
      <tbody>${topo.map(t => `<tr><td><strong>${t.site}</strong></td><td><span class="badge badge-neutral">${t.topology_type}</span></td><td>${t.description}</td></tr>`).join('')}</tbody></table>
    </div>
    <div class="grid grid-2 section">
      <div class="card"><div class="card-title-row"><h2>${icon('wifi', 22)} Communication Protocols</h2></div>
        <table><thead><tr><th>Protocol</th><th>Layer</th><th>Purpose</th></tr></thead>
        <tbody>${protocols.map(p => `<tr><td><strong>${p.name}</strong></td><td>${p.layer}</td><td>${p.purpose}</td></tr>`).join('')}</tbody></table>
      </div>
      <div class="card"><div class="card-title-row"><h2>${icon('server', 22)} Network Devices</h2></div>
        <table><thead><tr><th>Type</th><th>Model</th><th>Role</th></tr></thead>
        <tbody>${devices.map(d => `<tr><td><strong>${d.type}</strong></td><td>${d.model}</td><td>${d.role}</td></tr>`).join('')}</tbody></table>
      </div>
    </div>
    <div class="card section"><div class="card-title-row"><h2>${icon('cloud', 22)} Cloud Infrastructure</h2></div>
      <table><thead><tr><th>Service</th><th>Purpose</th></tr></thead>
      <tbody>${cloud.map(c => `<tr><td><strong>${c.service}</strong></td><td>${c.purpose}</td></tr>`).join('')}</tbody></table>
    </div>
  `;
}

// =====================================================================
// ATTACK SIMULATION (interactive players, backed by the real API)
// =====================================================================
let attackIndex = 0, attackPlaying = false, attackTimer = null;
let resIndex = 0, resPlaying = false, resTimer = null, resNotified = false;
let ATTACK_STEPS = [], RESOLUTION_STEPS = [], THREATS_FOR_SIM = [];

async function renderAttack() {
  const [sim, threats] = await Promise.all([Api.get('/attack-simulation'), Api.get('/threats')]);
  ATTACK_STEPS = sim.attackSteps; RESOLUTION_STEPS = sim.resolutionSteps; THREATS_FOR_SIM = threats;
  attackIndex = 0; attackPlaying = false; resIndex = 0; resPlaying = false; resNotified = false;
  content.innerHTML = `
    ${pageHeader('Live Demonstration', 'Attack Simulation & Response', "Press play to walk through exactly how a Microsoft 365 credential-harvesting attack unfolds — then watch how Contoso's security team detects, contains, and recovers from it, minute by minute.", 'play')}
    <div class="card section"><div class="card-title-row"><h2>${icon('network', 22)} Threats This Simulation Is Based On</h2></div>
      <table><thead><tr><th>Threat</th><th>Severity</th><th>Likelihood</th><th>Target</th></tr></thead>
      <tbody>${THREATS_FOR_SIM.map(t => `<tr><td><strong>${t.name}</strong><br><span class="subtext" style="margin:2px 0 0;">${t.description}</span></td><td>${sevBadge(t.severity)}</td><td>${t.likelihood}</td><td>${t.target}</td></tr>`).join('')}</tbody></table>
    </div>
    <div class="card section accent-critical">
      <div class="card-title-row"><h2 style="color:var(--critical)">${icon('alert', 22)} Part 1 — How the Attack Unfolds</h2></div>
      <div id="attackPlayerRoot"></div>
    </div>
    <div class="card section accent-low">
      <div class="card-title-row"><h2 style="color:var(--low)">${icon('shield', 22)} Part 2 — How Contoso Resolved It, Step by Step</h2></div>
      <div id="resolutionPlayerRoot"></div>
    </div>
  `;
  renderAttackPlayer();
  renderResolutionPlayer();
}

function attackVisual(step) {
  if (step.step_order === 1) return `<div class="mock-email"><div class="mock-email-head"><strong>Microsoft 365 Security</strong> &lt;security@0ffice365-verify.com&gt; <span class="spoof-tag">spoofed sender</span></div><div class="mock-email-subject">Action required: update your Microsoft 365 password</div></div>`;
  if (step.step_order === 2) return `<div class="mock-button">View messages →</div>`;
  if (step.step_order === 3) return `<div class="mock-urlbar">${icon('shieldOff', 15)} login-microsoft-secure-update.net</div><div class="muted" style="font-size:11.5px;margin-top:4px;">Real Microsoft login is always <code>login.microsoftonline.com</code></div>`;
  return `<div class="mock-alert">${icon('key', 18)} Credentials captured: jsmith@contoso.com / ••••••••</div>`;
}

function renderAttackPlayer() {
  const root = document.getElementById('attackPlayerRoot');
  const step = ATTACK_STEPS[attackIndex];
  const pct = Math.round(((attackIndex + 1) / ATTACK_STEPS.length) * 100);
  root.innerHTML = `
    <div class="player-controls">
      <button class="btn-primary sm" onclick="toggleAttackPlay()">${icon(attackPlaying ? 'pause' : 'play', 15)} ${attackPlaying ? 'Pause' : (attackIndex >= ATTACK_STEPS.length - 1 ? 'Replay' : 'Play attack')}</button>
      <button class="btn-icon" onclick="jumpAttack(${attackIndex - 1})" ${attackIndex === 0 ? 'disabled' : ''}>${icon('chevronLeft', 16)}</button>
      <button class="btn-icon" onclick="jumpAttack(${attackIndex + 1})" ${attackIndex === ATTACK_STEPS.length - 1 ? 'disabled' : ''}>${icon('chevronRight', 16)}</button>
      <button class="btn-ghost" onclick="resetAttack()">${icon('rotate', 14)} Reset</button>
      <div class="spacer-flex"></div>
      <div class="step-counter">Step ${attackIndex + 1} of ${ATTACK_STEPS.length}</div>
    </div>
    <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
    <div class="step-nodes">
      ${ATTACK_STEPS.map((s, i) => `
        <div class="step-node ${i === attackIndex ? 'active' : i < attackIndex ? 'past' : ''}" onclick="jumpAttack(${i})" style="--sc:${s.color}">
          <div class="step-circle">${icon(['mail', 'cursor', 'globe', 'key'][i] || 'mail', i === attackIndex ? 24 : 18)}</div>
          <div class="step-title">${s.title}</div>
        </div>
        ${i < ATTACK_STEPS.length - 1 ? `<div class="step-connector ${i < attackIndex ? 'done' : ''}"></div>` : ''}
      `).join('')}
    </div>
    <div class="detail-log-grid">
      <div class="detail-panel" style="border-left-color:${step.color}">
        <div class="detail-head">
          <div class="icon-badge" style="background:${step.color}">${icon(['mail', 'cursor', 'globe', 'key'][attackIndex] || 'mail', 20)}</div>
          <div><div class="detail-eyebrow" style="color:${step.color}">Attack Step ${attackIndex + 1}</div><div class="detail-title">${step.title}</div></div>
        </div>
        <p class="detail-desc">${step.description}</p>
        ${attackVisual(step)}
      </div>
      <div class="log-panel">
        <div class="log-head">${icon('terminal', 14)} Live Security Log</div>
        ${ATTACK_STEPS.slice(0, attackIndex + 1).map((s, i) => `<div class="log-line" style="opacity:${i === attackIndex ? 1 : 0.55}">${s.log_line}</div>`).join('')}
      </div>
    </div>
  `;
}
function jumpAttack(i) { if (i < 0 || i >= ATTACK_STEPS.length) return; attackPlaying = false; clearTimeout(attackTimer); attackIndex = i; renderAttackPlayer(); }
function resetAttack() { attackPlaying = false; clearTimeout(attackTimer); attackIndex = 0; renderAttackPlayer(); }
function toggleAttackPlay() {
  if (attackPlaying) { attackPlaying = false; clearTimeout(attackTimer); renderAttackPlayer(); return; }
  if (attackIndex >= ATTACK_STEPS.length - 1) attackIndex = 0;
  attackPlaying = true; renderAttackPlayer(); tickAttack();
}
function tickAttack() {
  if (!attackPlaying) return;
  if (attackIndex >= ATTACK_STEPS.length - 1) { attackPlaying = false; renderAttackPlayer(); return; }
  attackTimer = setTimeout(() => { attackIndex++; renderAttackPlayer(); tickAttack(); }, 2400);
}

function renderResolutionPlayer() {
  const root = document.getElementById('resolutionPlayerRoot');
  const resolved = resIndex === RESOLUTION_STEPS.length - 1;
  root.innerHTML = `
    <div class="player-controls">
      <button class="btn-primary sm green" onclick="toggleResPlay()">${icon(resPlaying ? 'pause' : 'play', 15)} ${resPlaying ? 'Pause' : (resolved ? 'Replay' : 'Play resolution')}</button>
      <button class="btn-ghost" onclick="resetRes()">${icon('rotate', 14)} Reset</button>
      <div class="spacer-flex"></div>
      <div class="step-counter">Step ${resIndex + 1} of ${RESOLUTION_STEPS.length}</div>
    </div>
    <div class="res-timeline">
      ${RESOLUTION_STEPS.map((s, i) => {
        const active = i === resIndex, done = i < resIndex;
        return `<div class="res-step ${active || done ? '' : 'dim'}" onclick="jumpRes(${i})">
          <div class="res-node-col">
            <div class="res-node ${done ? 'done' : active ? 'active' : ''}">${done ? icon('check', 15) : `<span>${i + 1}</span>`}</div>
            ${i < RESOLUTION_STEPS.length - 1 ? `<div class="res-line ${done ? 'done' : ''}"></div>` : ''}
          </div>
          <div class="res-body">
            <div class="res-tags"><span class="phase-tag">${s.phase}</span><span class="owner-tag">${s.owner}</span><span class="elapsed-tag">${icon('timer', 12)} ${s.elapsed}</span></div>
            <div class="res-desc ${active ? 'active' : ''}">${s.description}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
    ${resolved ? `<div class="success-banner">${icon('party', 22)}<div><div class="success-title">Incident Resolved</div><div class="success-sub">Total time from detection to full account lockdown: <strong>18 minutes</strong>. Full recovery: <strong>40 minutes</strong>.</div></div></div>` : ''}
  `;
}
function jumpRes(i) { if (i < 0 || i >= RESOLUTION_STEPS.length) return; resPlaying = false; clearTimeout(resTimer); resIndex = i; renderResolutionPlayer(); }
function resetRes() { resPlaying = false; clearTimeout(resTimer); resIndex = 0; resNotified = false; renderResolutionPlayer(); }
function toggleResPlay() {
  if (resPlaying) { resPlaying = false; clearTimeout(resTimer); renderResolutionPlayer(); return; }
  if (resIndex >= RESOLUTION_STEPS.length - 1) { resIndex = 0; resNotified = false; }
  resPlaying = true; renderResolutionPlayer(); tickRes();
}
function tickRes() {
  if (!resPlaying) return;
  if (resIndex >= RESOLUTION_STEPS.length - 1) {
    resPlaying = false;
    if (!resNotified) {
      resNotified = true;
      Api.post('/activity-log', { event: 'Attack simulation replayed — incident contained and resolved by the security team', severity: 'Critical' }).catch(() => {});
    }
    renderResolutionPlayer();
    return;
  }
  resTimer = setTimeout(() => { resIndex++; renderResolutionPlayer(); tickRes(); }, 2000);
}

// =====================================================================
// SECURITY POSTURE (tabs: vulnerabilities [live-editable] / app security / compliance)
// =====================================================================
let postureTab = 'vulns';
async function renderPosture() {
  const [vulns, secureApp, compliance] = await Promise.all([Api.get('/vulnerabilities'), Api.get('/secure-app'), Api.get('/compliance')]);
  window.__vulns = vulns; window.__secureApp = secureApp; window.__compliance = compliance;
  content.innerHTML = `
    ${pageHeader('Security Posture', 'Vulnerabilities, App Security & Compliance', 'Everything Contoso is actively managing to reduce risk — click any vulnerability status to cycle it and watch the change persist to the database in real time.', 'shield')}
    <div class="tab-row" id="postureTabs">
      <div class="tab-item" data-tab="vulns">${icon('bug', 16)} Vulnerabilities</div>
      <div class="tab-item" data-tab="app">${icon('lock', 16)} Application Security</div>
      <div class="tab-item" data-tab="compliance">${icon('shield', 16)} Compliance</div>
    </div>
    <div id="postureContent"></div>
  `;
  document.querySelectorAll('#postureTabs .tab-item').forEach(el => {
    el.addEventListener('click', () => { postureTab = el.dataset.tab; renderPostureContent(); });
  });
  renderPostureContent();
}
function renderPostureContent() {
  document.querySelectorAll('#postureTabs .tab-item').forEach(el => el.classList.toggle('active', el.dataset.tab === postureTab));
  const root = document.getElementById('postureContent');
  if (postureTab === 'vulns') {
    root.innerHTML = `<div class="card">
      <table><thead><tr><th>Vulnerability</th><th>Category</th><th>Risk</th><th>Affected System</th><th>Status (click to update)</th></tr></thead>
      <tbody>${window.__vulns.map(v => `<tr><td><strong>${v.name}</strong><br><span class="subtext" style="margin:2px 0 0;">${v.description}</span></td><td><span class="badge badge-neutral">${v.category}</span></td><td>${sevBadge(v.risk)}</td><td>${v.system}</td><td>${statusBadge(v.status, `cycleVuln(${v.id})`)}</td></tr>`).join('')}</tbody></table>
    </div>`;
  } else if (postureTab === 'app') {
    root.innerHTML = `<div class="card"><ul class="feature-list">${window.__secureApp.map(f => `<li><div class="check">${icon('check', 12)}</div><div><strong>${f.feature} <span class="standard-tag">${f.standard}</span></strong><span class="desc">${f.description}</span></div></li>`).join('')}</ul></div>`;
  } else {
    root.innerHTML = `<div class="card"><table><thead><tr><th>Policy</th><th>Regulation</th><th>Description</th><th>Status</th></tr></thead>
      <tbody>${window.__compliance.map(p => `<tr><td><strong>${p.policy}</strong></td><td><span class="badge badge-neutral">${p.regulation}</span></td><td>${p.description}</td><td>${statusBadge(p.status)}</td></tr>`).join('')}</tbody></table></div>`;
  }
}
async function cycleVuln(id) {
  try {
    const updated = await Api.post('/vulnerabilities', { id });
    const idx = window.__vulns.findIndex(v => v.id === id);
    if (idx > -1) window.__vulns[idx] = updated;
    renderPostureContent();
  } catch (e) { alert('Could not update vulnerability status: ' + e.message); }
}



// =====================================================================
// INCIDENT RESPONSE PLAN
// =====================================================================
function renderIncident() {
  content.innerHTML = `
    ${pageHeader('Incident Management', 'Microsoft 365 Incident Response Plan', 'A structured response process for handling a simulated Microsoft 365 credential phishing incident inside the Contoso enterprise environment.', 'shield')}

    <div class="card">
      <h2>Incident Overview</h2>
      <p class="subtext">A fictional threat actor named ShadowFox targeted Contoso employees through a phishing campaign that impersonated Microsoft 365. The objective was to steal user credentials and attempt unauthorized access to company resources.</p>
    </div>

    <div class="grid grid-2">
      ${[
        ['1. Preparation','Security policies, MFA, Microsoft Defender monitoring, employee awareness training and incident response procedures are established before an attack occurs.'],
        ['2. Detection & Analysis','Suspicious Microsoft 365 login activity, unusual locations, authentication failures and phishing indicators are investigated by the security team.'],
        ['3. Containment','Compromised accounts are temporarily disabled, active sessions are terminated, passwords are reset and attacker access is blocked.'],
        ['4. Eradication','Phishing messages are removed, malicious access paths are eliminated and security weaknesses are reviewed.'],
        ['5. Recovery','Affected services are restored, user accounts are verified and continuous monitoring is enabled to confirm normal operation.'],
        ['6. Lessons Learned','The incident is reviewed to improve security awareness, access policies, phishing protection and future response procedures.']
      ].map(x => `<div class="card"><h2>${x[0]}</h2><p class="subtext">${x[1]}</p></div>`).join('')}
    </div>

    <div class="card">
      <h2>Incident Summary</h2>
      <ul class="feature-list">
        <li><strong>Victim Organization</strong><span class="desc">Contoso Ltd. (fictional enterprise organization)</span></li>
        <li><strong>Threat Actor</strong><span class="desc">ShadowFox (fictional cybercriminal group)</span></li>
        <li><strong>Attack Type</strong><span class="desc">Microsoft 365 credential phishing simulation</span></li>
        <li><strong>Target Platform</strong><span class="desc">Microsoft 365 cloud environment</span></li>
        <li><strong>Status</strong><span class="desc">Resolved after security response actions</span></li>
      </ul>
    </div>`;
}

// =====================================================================
// DATA PROTECTION & PRIVACY
// =====================================================================
function renderPrivacy() {
  content.innerHTML = `
    ${pageHeader('Compliance', 'Data Protection & Privacy Compliance', 'Security controls used to protect organizational data in a Microsoft 365 environment.', 'lock')}
    <div class="card">
      <ul class="feature-list">
        <li><strong>GDPR Principles</strong><span class="desc">Personal data is processed securely with privacy and accountability requirements.</span></li>
        <li><strong>Access Control</strong><span class="desc">Role-based permissions ensure users only access required information.</span></li>
        <li><strong>Multi-Factor Authentication</strong><span class="desc">Additional verification protects accounts from unauthorized access.</span></li>
        <li><strong>Encryption & Monitoring</strong><span class="desc">Data protection controls help secure information during storage and transfer.</span></li>
        <li><strong>Data Retention</strong><span class="desc">Policies are applied to manage storage and lifecycle of sensitive information.</span></li>
      </ul>
    </div>`;
}

// =====================================================================
// RECOMMENDATIONS
// =====================================================================
async function renderRecommendations() {
  const recs = await Api.get('/recommendations');
  content.innerHTML = `
    ${pageHeader('Roadmap', 'Security Recommendations', 'Proposed improvements — stronger policies, network monitoring, employee training, and hardened architecture.', 'bulb')}
    <div class="grid grid-2">
      ${recs.map(r => `<div class="card accent-${(r.priority || '').toLowerCase()}" style="margin-bottom:0;">
        <div class="card-title-row"><h2 style="font-size:15.5px;">${r.title}</h2>${sevBadge(r.priority)}</div>
        <div style="margin-bottom:10px;"><span class="badge badge-neutral">${r.category}</span></div>
        <p class="subtext" style="margin:0;">${r.description}</p>
      </div>`).join('')}
    </div>
  `;
}
