# Contoso Security Assessment

A cybersecurity assessment site for **Contoso Corporation**, a fictional financial-
services firm running its digital workplace on Microsoft 365. Walks through a real,
interactive demonstration of the Microsoft 365 credential-harvesting phishing attack —
how it happens, and how a security team detects, contains, and resolves it.

- **Zero npm dependencies.** Pure Node.js, nothing to install.
- **One project, one deploy.** No separate frontend/backend, no CORS.
- **Deploys to Vercel with zero configuration.**

## Project structure

```
contoso-work/
├── index.html          ← static frontend (project root — required for reliable Vercel deploys)
├── dashboard.html
├── css/style.css
├── js/
│   ├── api.js
│   └── app.js
├── api/                 ← each file = one backend endpoint (Vercel serverless function)
│   ├── login.js
│   ├── threats.js
│   ├── vulnerabilities.js
│   ├── network/topology.js, protocols.js, devices.js, cloud.js
│   ├── dashboard/summary.js
│   └── ... (one file per endpoint)
├── lib/data.js          ← all data + in-memory "database" + auth logic
├── server.js            ← local dev server (zero dependencies)
├── package.json
├── vercel.json
└── README.md
```

**Important:** the static frontend files (`index.html`, `dashboard.html`, `css/`, `js/`)
live at the **project root**, not inside a `public/` folder. This matters — Vercel's
zero-config static handling is only guaranteed to work reliably when static files sit
at the root alongside the `/api` folder. An earlier version of this project nested
everything under `public/` with an `outputDirectory` setting in `vercel.json`, which
does not reliably combine with serverless functions on Vercel and caused the API calls
to fail after deployment (with the frontend visible but "sign in" failing). If you're
updating an older copy of this project, replace it with this structure rather than
patching in place.

## Option 1 — Run it locally

```bash
node server.js
```
No `npm install` needed. Open **http://localhost:3000**.

Login: username `admin`, password `Admin@2026`, any 6-digit code (e.g. `123456`).

## Option 2 — Deploy to Vercel

1. Push this folder to a GitHub repo (as-is — do not add a `public/` wrapper)
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Leave all settings default (Framework Preset: **Other**) → **Deploy**

That's it. No environment variables, no second service, no config file to edit.

### If sign-in still fails after deploying

1. Open your deployed site, open browser DevTools → **Network** tab, click Sign in,
   and check what URL the failed request actually went to and what status code it got.
2. In the Vercel dashboard, open your project → **Deployments** → your latest deploy →
   **Functions** tab. You should see `login`, `threats`, `vulnerabilities`, etc. listed
   as functions. If that list is empty, the `/api` folder wasn't detected — double check
   it's at the project root in your repo (not nested inside another folder).
3. Click into the `login` function's logs to see the actual server-side error, if any.

## Demo login

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `Admin@2026` |
| MFA code | any 6 digits, e.g. `123456` |

## Site sections

| Sidebar item | What it covers |
|---|---|
| Dashboard | Live severity/risk charts, totals, real-time activity feed |
| Company Profile | Intro to Microsoft, then Contoso Corporation, its Microsoft 365 services, mobile/device risk |
| Network Architecture | Topology, communication protocols, devices, cloud infrastructure |
| Attack Simulation | Press Play to watch the credential-harvesting attack unfold, then the resolution timeline |
| Security Posture | Tabs: Vulnerabilities (status badges are clickable, call the real API), Application Security, Compliance |
| Recommendations | Prioritized security improvements |

## Real backend behavior

- **Vulnerability status** — click any status badge on Security Posture. Calls
  `POST /api/vulnerabilities` with `{id}`, updates in-memory data, and the Dashboard's
  open-vulnerability count reflects it immediately.
- **Activity log** — finishing the resolution player calls `POST /api/activity-log`,
  adding a live entry to the Dashboard feed.

Data is stored **in memory**, not a persistent database file — this is a deliberate
simplicity trade-off (see note in the code). Locally it resets when you restart
`node server.js`; on Vercel it resets on a cold start or redeploy. If your project
requires a permanent database, this can be swapped for one without changing the
frontend or API shape.

## Editing the content

Everything lives in `lib/data.js` — edit the arrays there and restart (or redeploy)
to change any content on the site.
