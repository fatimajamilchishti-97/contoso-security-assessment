// lib/data.js — all site data + simple in-memory "database" + auth helpers.
// No external packages. Works identically on Vercel serverless and locally.
const crypto = require('crypto');

const SECRET = 'contoso-demo-secret-change-if-you-care'; // fine for a school demo, not for production

// ---------------- Static content ----------------
const MICROSOFT_INTRO = {
  founded: '1975', founders: 'Bill Gates & Paul Allen', headquarters: 'Redmond, Washington, USA',
  products: 'Windows, Microsoft 365, Azure, Teams, Xbox',
  description: "Microsoft Corporation is one of the world's largest technology companies, best known for Windows, the Microsoft 365 productivity suite (Outlook, Word, Excel, Teams, SharePoint), and the Azure cloud platform. Because so many organizations run their identity, email, and file storage on Microsoft 365, Microsoft has become the single most impersonated brand in phishing attacks worldwide. Attackers rarely breach Microsoft's own servers — instead, they target the organizations and employees who rely on Microsoft 365 every day.",
};

const ORGANIZATION = {
  name: 'Contoso Corporation', industry: 'Financial Services & Insurance', founded: '1998',
  headquarters: 'Seattle, WA, USA', employees: '4,200',
  description: "Contoso Corporation is our case-study organization — a mid-to-large financial services firm that runs its entire digital workplace on Microsoft 365 across 12 regional offices. Its heavy reliance on cloud identity (Azure AD / Entra ID) makes it a high-value target for the exact credential-harvesting phishing campaigns Microsoft users face every day.",
};

const INFRASTRUCTURE = [
  { category: 'Hardware', item: 'Dell OptiPlex & Latitude endpoints', description: '3,900 managed desktops and laptops enrolled in Microsoft Intune.' },
  { category: 'Hardware', item: 'HPE ProLiant servers', description: 'On-prem file, print and legacy application servers across 3 data centers.' },
  { category: 'Software', item: 'Microsoft 365 E5', description: 'Outlook, Teams, SharePoint, OneDrive, Word/Excel/PowerPoint for all staff.' },
  { category: 'Software', item: 'Windows 11 Enterprise', description: 'Standard endpoint OS, managed via Intune and Group Policy.' },
  { category: 'Software', item: 'Microsoft Defender for Endpoint', description: 'EDR and anti-malware across all managed devices.' },
];

const DIGITAL_SERVICES = [
  { name: 'Exchange Online', purpose: 'Corporate email & calendaring — the main phishing attack surface.', icon: 'mail', color: '#0078D4' },
  { name: 'Microsoft Teams', purpose: 'Chat, meetings, and external guest collaboration.', icon: 'chat', color: '#6264A7' },
  { name: 'SharePoint Online', purpose: 'Document management, intranet, and file collaboration.', icon: 'cloud', color: '#038387' },
  { name: 'Azure AD / Entra ID', purpose: 'Identity provider, single sign-on and Conditional Access.', icon: 'fingerprint', color: '#004578' },
  { name: 'OneDrive', purpose: 'Personal cloud file storage and sync for every employee.', icon: 'drive', color: '#00B7C3' },
];

const MOBILE_RISKS = [
  { risk: 'Unmanaged BYOD devices', description: 'Personal phones access corporate email without Intune enrollment.', mitigation: 'Enforce MAM-only policy with copy-paste restrictions.', severity: 'High' },
  { risk: 'Lost or stolen devices', description: 'Mobile devices with cached email/files can be physically lost.', mitigation: 'Remote wipe plus device-level encryption and biometric lock.', severity: 'Medium' },
  { risk: 'Unsanctioned cloud storage sync', description: 'Employees sync attachments to personal Dropbox/Google Drive.', mitigation: 'Block unsanctioned storage apps; OneDrive as the sole approved option.', severity: 'Medium' },
];

const NETWORK_TOPOLOGY = [
  { site: 'HQ — Seattle', topology_type: 'Hybrid Star / Cloud-Hub', description: 'On-prem star topology at HQ connects via ExpressRoute to Azure, which acts as the hub for all regional spokes.' },
  { site: 'Regional Offices (×11)', topology_type: 'Hub-and-Spoke', description: 'Each branch connects back to the Azure hub over site-to-site VPN; local switches in a star layout.' },
  { site: 'Remote / Hybrid Workers', topology_type: 'Zero Trust Mesh', description: 'Remote staff connect directly to cloud services, validated per-request via Conditional Access.' },
];
const NETWORK_PROTOCOLS = [
  { name: 'TLS 1.2 / 1.3', layer: 'Transport', purpose: 'Encrypts traffic to Exchange Online, SharePoint and Teams.' },
  { name: 'OAuth 2.0 / OpenID Connect', layer: 'Application', purpose: 'Modern authentication and token issuance for Azure AD sign-in.' },
  { name: 'SAML 2.0', layer: 'Application', purpose: 'Federated SSO for legacy and third-party line-of-business apps.' },
  { name: 'IPsec (site-to-site VPN)', layer: 'Network', purpose: 'Encrypted tunnels between branch offices and the Azure hub.' },
];
const NETWORK_DEVICES = [
  { type: 'Router', model: 'Cisco ISR 4451', role: 'Branch WAN edge routing' },
  { type: 'Firewall', model: 'Palo Alto PA-5220', role: 'Perimeter next-gen firewall / IDS-IPS' },
  { type: 'Switch', model: 'Cisco Catalyst 9300', role: 'Core & access layer switching' },
  { type: 'VPN Gateway', model: 'Azure VPN Gateway', role: 'Site-to-site connectivity to Azure hub' },
];
const NETWORK_CLOUD = [
  { service: 'Azure Virtual Network (Hub)', purpose: 'Central hub for hybrid connectivity and shared security services.' },
  { service: 'Microsoft Sentinel', purpose: 'Cloud-native SIEM/SOAR for security monitoring.' },
  { service: 'Entra Conditional Access', purpose: 'Risk-based access policies enforcing MFA and device compliance.' },
];

const THREATS = [
  { id: 1, name: 'Microsoft 365 Credential Harvesting Phishing', category: 'Phishing', description: 'Spoofed Outlook/Teams/SharePoint emails lead to a cloned Microsoft login page that silently records credentials.', severity: 'Critical', likelihood: 'High', target: 'All M365 users' },
  { id: 2, name: 'Malware / Ransomware via email attachment', category: 'Malware', description: 'Malicious macros or executables delivered through attachments, encrypting endpoint and shared drive data.', severity: 'Critical', likelihood: 'Medium', target: 'Endpoints, file servers' },
  { id: 3, name: 'Business Email Compromise (BEC)', category: 'Phishing', description: 'Attackers use a harvested mailbox to impersonate executives and request fraudulent wire transfers.', severity: 'High', likelihood: 'Medium', target: 'Finance department' },
  { id: 4, name: 'Data Breach via compromised account', category: 'Data Breach', description: 'A harvested Azure AD credential is used to exfiltrate client financial records from SharePoint/OneDrive.', severity: 'Critical', likelihood: 'Medium', target: 'SharePoint, OneDrive' },
  { id: 5, name: 'Session Token Hijacking', category: 'Unauthorized Access', description: 'An adversary-in-the-middle phishing kit steals a live session cookie, bypassing password and MFA entirely.', severity: 'High', likelihood: 'Medium', target: 'Azure AD sessions' },
];

const SECURE_APP = [
  { feature: 'Secure login system', standard: 'OWASP ASVS', description: 'Salted, hashed password verification with account lockout after repeated failures.' },
  { feature: 'Multi-factor authentication', standard: 'NIST 800-63B', description: 'A verification code is required in addition to the password.' },
  { feature: 'Encrypted data storage', standard: 'ISO/IEC 27001', description: 'Security records are stored in an access-controlled, persisted database.' },
  { feature: 'Session management', standard: 'OWASP ASVS', description: 'Server-issued tokens with expiry, instantly revocable.' },
];

const COMPLIANCE = [
  { policy: 'Data Privacy Policy', regulation: 'GDPR', description: 'Defines lawful basis, retention limits and staff obligations for processing client personal data.', status: 'Active' },
  { policy: 'GDPR Compliance Program', regulation: 'GDPR', description: 'Covers data subject access requests and breach notification within 72 hours.', status: 'Active' },
  { policy: 'Least-Privilege Access Policy', regulation: 'ISO/IEC 27001', description: 'Access to client financial records restricted to role-based groups.', status: 'Active' },
  { policy: 'Encryption-at-rest & in-transit', regulation: 'ISO/IEC 27001', description: 'All SharePoint, OneDrive and database content encrypted.', status: 'Active' },
];

const RECOMMENDATIONS = [
  { title: 'Enforce phishing-resistant MFA tenant-wide', category: 'Identity', priority: 'Critical', description: 'Move to FIDO2 security keys for privileged/finance accounts to defeat adversary-in-the-middle phishing kits.' },
  { title: 'Deploy URL / domain look-alike detection', category: 'Email Security', priority: 'High', description: 'Enable Safe Links and impersonation protection.' },
  { title: 'Reduce standing Global Admin accounts', category: 'Identity', priority: 'High', description: 'Cut Global Admin count from 22 to under 5; require just-in-time elevation.' },
  { title: 'Continuous network monitoring', category: 'Monitoring', priority: 'High', description: 'Expand Sentinel coverage with automated session-revocation playbooks.' },
  { title: 'Employee awareness training', category: 'People', priority: 'Medium', description: 'Quarterly phishing simulations modeled on real credential-harvesting lures.' },
  { title: 'Patch and decommission legacy servers', category: 'Endpoint', priority: 'High', description: 'Retire or upgrade the 14 out-of-support on-prem servers.' },
];

const ATTACK_STEPS = [
  { step_order: 1, title: 'The Bait', color: '#0078D4', description: 'An employee receives an email cloned to look exactly like an Outlook notification — subject line: "Action required: update your Microsoft 365 password."', log_line: '[09:14:02] MAIL-GW  inbound message accepted from "security@0ffice365-verify.com"' },
  { step_order: 2, title: 'The Click', color: '#CA5010', description: 'Trusting the familiar branding and urgent tone, the employee clicks a button inside the email labeled "View messages."', log_line: '[09:14:47] ENDPOINT  user jsmith clicked hyperlink → outbound request to 91.203.x.x' },
  { step_order: 3, title: 'The Fake Portal', color: '#FFB900', description: 'A pixel-perfect clone of the Microsoft sign-in page opens. The address bar reveals a look-alike domain — not the real Microsoft login.', log_line: '[09:14:49] DNS  resolved login-microsoft-secure-update.net → 91.203.x.x (unregistered 6 days ago)' },
  { step_order: 4, title: 'The Harvest', color: '#D13438', description: 'The instant the victim types their email and password, the fake page silently transmits the credentials to the attacker — no malware required.', log_line: '[09:15:03] ALERT  credentials POSTed to attacker-controlled endpoint — account jsmith@contoso.com compromised' },
];

const RESOLUTION_STEPS = [
  { phase: 'Detection', owner: 'SOC Analyst', elapsed: '+0 min', description: 'Microsoft Sentinel flags an anomalous sign-in — impossible travel, new device, risky IP — tied to the compromised account.' },
  { phase: 'Reporting', owner: 'SOC Analyst', elapsed: '+8 min', description: 'Incident logged and classified as Critical severity.' },
  { phase: 'Containment', owner: 'Security Administrator', elapsed: '+15 min', description: 'All active sessions for the affected account are revoked ("Sign out of all sessions") and the password is force-reset.' },
  { phase: 'Containment', owner: 'Network Team', elapsed: '+18 min', description: 'The malicious sender domain and look-alike URL are blocked at the email gateway and firewall.' },
  { phase: 'Recovery', owner: 'IT Support', elapsed: '+40 min', description: 'Account access is restored only after MFA re-enrollment and a clean scan from Defender for Endpoint.' },
  { phase: 'Post-Incident Review', owner: 'Security Administrator', elapsed: '+5 days', description: 'Root-cause review completed; controls updated and staff re-trained.' },
];

// ---------------- Mutable in-memory "database" ----------------
// NOTE: this resets when the server restarts (locally) or on a Vercel cold start
// (serverless functions don't have persistent disk). Fine for a demo/assignment —
// see the README for how to swap in a real database if you need permanent storage.
let vulnerabilities = [
  { id: 1, name: 'Weak / reused passwords', category: 'Identity', description: '18% of staff reuse passwords across personal and corporate accounts.', risk: 'High', system: 'Azure AD accounts', status: 'Open' },
  { id: 2, name: 'MFA not enforced tenant-wide', category: 'Identity', description: 'Legacy accounts and 3 service accounts remain exempt from Conditional Access MFA policy.', risk: 'Critical', system: 'Azure AD / Exchange Online', status: 'In Progress' },
  { id: 3, name: 'Unsecured guest Wi-Fi segmentation', category: 'Network', description: 'Guest wireless VLAN has a routable path to internal print servers.', risk: 'Medium', system: 'Branch office network', status: 'Open' },
  { id: 4, name: 'Outdated software on legacy servers', category: 'Endpoint', description: '14 on-prem servers run software past vendor end-of-support.', risk: 'High', system: 'On-prem data center', status: 'Open' },
  { id: 5, name: 'No URL / domain look-alike protection', category: 'Email Security', description: 'Mail filtering does not flag newly-registered look-alike domains.', risk: 'High', system: 'Exchange Online', status: 'Open' },
  { id: 6, name: 'Over-privileged accounts', category: 'Identity', description: '22 accounts hold Global Administrator rights when fewer than 5 are required.', risk: 'High', system: 'Azure AD', status: 'Open' },
];

let activityLog = [
  { time: '2026-07-17 09:14', event: 'Impossible-travel sign-in blocked by Conditional Access', severity: 'High' },
  { time: '2026-07-15 11:47', event: 'Defender for Endpoint quarantined a malicious macro attachment', severity: 'High' },
  { time: '2026-07-12 13:05', event: 'Look-alike domain blocked at the email gateway', severity: 'High' },
];

function cycleVulnerabilityStatus(id) {
  const order = ['Open', 'In Progress', 'Active'];
  const v = vulnerabilities.find((x) => x.id === Number(id));
  if (!v) return null;
  v.status = order[(order.indexOf(v.status) + 1) % order.length];
  return v;
}

function addActivity(entry) {
  activityLog = [entry, ...activityLog].slice(0, 10);
  return activityLog;
}

function dashboardSummary() {
  const countBy = (arr, key) => {
    const map = {};
    arr.forEach((r) => { map[r[key]] = (map[r[key]] || 0) + 1; });
    return Object.entries(map).map(([k, v]) => ({ [key]: k, count: v }));
  };
  return {
    threatsBySeverity: countBy(THREATS, 'severity'),
    vulnsByRisk: countBy(vulnerabilities, 'risk'),
    totals: {
      threats: THREATS.length,
      vulnerabilities: vulnerabilities.length,
      recommendations: RECOMMENDATIONS.length,
      openVulnerabilities: vulnerabilities.filter((v) => v.status === 'Open').length,
      criticalThreats: THREATS.filter((t) => t.severity === 'Critical').length,
    },
  };
}

// ---------------- Auth (stateless — no server-side session store needed) ----------------
function sign(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}
function createToken(username) {
  const payload = JSON.stringify({ u: username, exp: Date.now() + 60 * 60 * 1000 });
  const b64 = Buffer.from(payload).toString('base64url');
  return `${b64}.${sign(b64)}`;
}
function verifyToken(token) {
  if (!token || !token.includes('.')) return null;
  const [b64, sig] = token.split('.');
  if (sign(b64) !== sig) return null;
  try {
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch (e) { return null; }
}
function checkLogin(username, password, mfaCode) {
  if (username !== 'admin' || password !== 'Admin@2026') return { error: 'Invalid username or password.' };
  if (!/^\d{6}$/.test(String(mfaCode || ''))) return { error: 'A valid 6-digit MFA code is required.', mfaRequired: true };
  return { token: createToken(username), username, role: 'Security Administrator' };
}

module.exports = {
  MICROSOFT_INTRO, ORGANIZATION, INFRASTRUCTURE, DIGITAL_SERVICES, MOBILE_RISKS,
  NETWORK_TOPOLOGY, NETWORK_PROTOCOLS, NETWORK_DEVICES, NETWORK_CLOUD,
  THREATS, SECURE_APP, COMPLIANCE, RECOMMENDATIONS, ATTACK_STEPS, RESOLUTION_STEPS,
  getVulnerabilities: () => vulnerabilities,
  getActivityLog: () => activityLog,
  cycleVulnerabilityStatus, addActivity, dashboardSummary,
  checkLogin, verifyToken,
};
