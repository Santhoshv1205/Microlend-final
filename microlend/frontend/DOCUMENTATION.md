# MicroLend Frontend — Complete Technical Documentation

**React 18 · Axios · React Router v6 · Recharts · Create React App 5**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure — All 39 Files](#3-project-structure--all-39-files)
4. [Core Infrastructure](#4-core-infrastructure)
   - 4.1 [src/index.js — Entry Point](#41-srcindexjs--entry-point)
   - 4.2 [src/App.js — Routes & Guards](#42-srcappjs--routes--guards)
   - 4.3 [src/utils.js — Shared Components & Hooks](#43-srcutilsjs--shared-components--hooks)
   - 4.4 [src/api/client.js — Axios Client](#44-srcapiclientjs--axios-client)
   - 4.5 [src/api/index.js — API Functions](#45-srcapiindexjs--api-functions)
   - 4.6 [src/context/AuthContext.js — Auth State](#46-srccontextauthcontextjs--auth-state)
   - 4.7 [src/components/Layout.js — Sidebar](#47-srccomponentslayoutjs--sidebar)
5. [Module 2.1 — Identity & Access Management (Login / Auth)](#5-module-21--identity--access-management)
6. [Module 2.2 — Borrower Onboarding & KYC](#6-module-22--borrower-onboarding--kyc)
7. [Module 2.3 — Group & Centre Management](#7-module-23--group--centre-management)
8. [Module 2.4 — Loan Origination & Approval](#8-module-24--loan-origination--approval)
9. [Module 2.5 — Loan Disbursement & Accounts](#9-module-25--loan-disbursement--accounts)
10. [Module 2.6 — Collections & Delinquency](#10-module-26--collections--delinquency)
11. [Module 2.7 — Portfolio Analytics & Reporting](#11-module-27--portfolio-analytics--reporting)
12. [Module 2.8 — Notifications & Alerts](#12-module-28--notifications--alerts)
13. [Role-Based Navigation Map](#13-role-based-navigation-map)
14. [API Integration Reference](#14-api-integration-reference)
15. [Quick Start Guide](#15-quick-start-guide)

---

## 1. Project Overview

MicroLend Frontend is a React 18 single-page application providing **6 role-specific dashboards** for the MicroLend NBFC backend. Each role has a completely separate navigation, page set, and data access scope.

| Role | Home URL | Pages |
|------|----------|-------|
| ADMIN | /admin | Dashboard, Products, Users, Notifications, Audit Logs |
| FIELD_OFFICER | /field | Dashboard, Borrowers, KYC Upload, Centres, Groups, Meetings, Applications, Collections |
| CREDIT_OFFICER | /credit | Dashboard, KYC Verify, Assessments, Applications, Sanctions, Disbursements, Accounts |
| BRANCH_MANAGER | /branch | Dashboard+Reports, Register Staff, Delinquency, Accounts |
| COLLECTIONS_OFFICER | /collections | Dashboard, Cases, Record Payment |
| BORROWER | /borrower | Portal, My Loans, Schedule, Notifications |

**Metrics:** 39 JS files · 6 role dashboards · 32 page components · 50+ API functions · Port 3000

---

## 2. Technology Stack

| Library | Version | Purpose |
|---------|---------|---------|
| React | 18.2.0 | UI framework — component rendering |
| react-router-dom | 6.22.0 | Client-side routing with Guards |
| Axios | 1.6.7 | HTTP client — JWT interceptor |
| Recharts | 2.12.0 | BarChart in Branch Manager dashboard |
| react-scripts | 5.0.1 | CRA build toolchain |

---

## 3. Project Structure — All 39 Files

```
microlend-frontend/
├── package.json                        Dependencies and scripts
├── .env                                REACT_APP_API_BASE=http://localhost:8082
├── public/
│   └── index.html                      HTML shell with #root
└── src/
    ├── index.js                        ReactDOM.createRoot() entry
    ├── App.js                          All 27 routes + Guard + role home routing
    ├── utils.js                        useApi hook + 9 shared components + formatters
    ├── api/
    │   ├── client.js                   Axios instance + JWT request interceptor + 401 handler
    │   └── index.js                    50+ named functions covering all 80 backend endpoints
    ├── context/
    │   └── AuthContext.js              login() / logout() + localStorage JWT + setUser
    ├── components/
    │   └── Layout.js                   Collapsible sidebar + role nav + logout
    └── pages/
        ├── Login.js                    Public login form
        ├── admin/                      MODULE 2.1 (admin role)
        │   ├── Dashboard.js            Stats: users + borrowers + products + recent audit
        │   ├── Products.js             CRUD loan products + discontinue
        │   ├── Users.js                Register staff + suspend/activate/delete
        │   ├── Notifications.js        Send notifications + view all
        │   └── AuditLogs.js            Read-only audit trail
        ├── field/                      MODULE 2.2 + 2.3 (field_officer role)
        │   ├── Dashboard.js            Stats overview
        │   ├── Borrowers.js            Register borrower (email+password → auto User)
        │   ├── KYCUpload.js            Upload KYC docs (cannot verify — 403 enforced)
        │   ├── Centres.js              Create/view village centres
        │   ├── Groups.js               Create/view JLG groups
        │   ├── Meetings.js             Schedule meetings + record outcomes
        │   ├── Applications.js         Create + submit loan applications
        │   └── Collections.js          Record EMI payments (full/partial/excess)
        ├── credit/                     MODULE 2.4 + 2.5 (credit_officer role)
        │   ├── Dashboard.js            Pending apps + KYC awaiting + assessment count
        │   ├── KYCVerify.js            Verify/reject KYC (maker-checker — FIELD cannot access)
        │   ├── Assessments.js          Credit scoring + DBR + recommendation
        │   ├── Applications.js         State machine UI: review/approve/reject
        │   ├── Sanctions.js            Issue + accept sanction letters
        │   ├── Disbursements.js        Disburse loans + view all accounts
        │   └── Accounts.js             View accounts + drill into repayment schedule
        ├── branch/                     MODULE 2.7 + 2.6 (branch_manager role)
        │   ├── Dashboard.js            Generate portfolio report + BarChart + history
        │   ├── RegisterStaff.js        Register staff (branch-scoped)
        │   ├── Delinquency.js          View/update cases + trigger engine
        │   └── Accounts.js             Read-only loan account overview
        ├── collections/                MODULE 2.6 (collections_officer role)
        │   ├── Dashboard.js            Case/collection counts
        │   ├── Cases.js                Update delinquency case action/status
        │   └── RecordPayment.js        Record recovery payments
        └── borrower/                   MODULE 2.2 + 2.5 + 2.8 (borrower role)
            ├── Portal.js               Active loans summary + outstanding
            ├── MyLoans.js              All loan accounts table
            ├── Schedule.js             Full repayment schedule with PARTIAL/PAID/OVERDUE status
            └── Notifications.js        Inbox with read/dismiss
```

---

## 4. Core Infrastructure

### 4.1 src/index.js — Entry Point

```javascript
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
```

Uses React 18's `createRoot` API.

### 4.2 src/App.js — Routes & Guards

**Guard component** — protects every route:
- No user → redirect to `/login`
- Wrong role → redirect to that user's home page
- Correct role → renders `<Layout>` with the page component

**ROLE_HOME map** maps each role to its home URL:
```javascript
const ROLE_HOME = {
  ADMIN:'/admin', BRANCH_MANAGER:'/branch', CREDIT_OFFICER:'/credit',
  FIELD_OFFICER:'/field', COLLECTIONS_OFFICER:'/collections', BORROWER:'/borrower'
};
```

27 protected routes + `/login` + `/` (Home redirector).

### 4.3 src/utils.js — Shared Components & Hooks

**useApi(apiFn, deps)** — custom hook used by every page:
```javascript
const { data, loading, error, reload } = useApi(getBorrowers);
```
Manages loading state, error state, and a `reload()` function to refetch after mutations.

**Shared components:** `Spinner`, `Alert`, `Badge` (auto-colours via statusColor map), `Btn`, `GhostBtn`, `Card`, `PageHeader`, `StatCard`, `Field` (input/select/textarea), `Modal`, `DataTable`.

**Formatters:** `fmt$(v)` → Indian Rupee, `fmtD(d)` → date, `fmtDT(d)` → datetime.

**statusColor(s)** — maps 30+ status strings to hex colours (ACTIVE=green, PENDING=grey, REJECTED=red, PARTIAL=amber, etc.).

### 4.4 src/api/client.js — Axios Client

```javascript
const client = axios.create({ baseURL: 'http://localhost:8082' });

// Request interceptor — auto-attach JWT
client.interceptors.request.use(cfg => {
  const token = localStorage.getItem('ml_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Response interceptor — global 401 handler
client.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) { localStorage.clear(); window.location.href = '/login'; }
  return Promise.reject(err);
});
```

### 4.5 src/api/index.js — API Functions

50+ named functions covering all 80 backend endpoints. Examples:

```javascript
// Auth
export const login = d => client.post('/api/auth/login', d);
export const register = d => client.post('/api/auth/register', d);

// Borrowers
export const createBorrower = d => client.post('/api/borrowers', d);
export const verifyKyc = (id, status, verifiedByID) =>
  client.patch(`/api/kyc/${id}/verify`, null, { params: { status, verifiedByID } });

// Collections (3-branch payment engine)
export const recordCollection = d => client.post('/api/collections', d);

// Delinquency engine trigger
export const triggerEngine = () => client.post('/api/delinquency/trigger');
```

### 4.6 src/context/AuthContext.js — Auth State

```javascript
// login() stores token + user in localStorage, updates React state
async function login(creds) {
  const r = await apiLogin(creds);
  const data = r.data.data;
  localStorage.setItem('ml_token', data.token);
  localStorage.setItem('ml_user', JSON.stringify(data));
  setUser(data);
  return { ok: true, to: ROLE_HOME[data.role] || '/' };
}
```

User persists across refreshes: `useState(() => JSON.parse(localStorage.getItem('ml_user')))`.

### 4.7 src/components/Layout.js — Sidebar

- Collapsible: `width: collapsed ? 58 : 220` with CSS transition
- Role-coloured navigation links using `NavLink` with `isActive` styling
- Role badge showing the current user's role
- Logout button → `logout()` + navigate to `/login`

---

## 5. Module 2.1 — Identity & Access Management

**Role:** ADMIN  
**Files:** `src/pages/Login.js`, `src/pages/admin/Dashboard.js`, `src/pages/admin/Users.js`, `src/pages/admin/AuditLogs.js`

**Login.js** — Public page. Posts to `POST /api/auth/login`. On success, `AuthContext.login()` stores JWT + user in localStorage. Redirects to role home.

**Users.js** — Calls `POST /api/auth/register` with ADMIN JWT. Provides register/suspend/activate/delete for staff accounts. Branch Manager can also register staff but only FIELD/CREDIT/COLLECTIONS roles within their branch.

**AuditLogs.js** — Read-only table calling `GET /api/admin/audit-logs`. Shows `userID=0` for SYSTEM events written by the delinquency scheduler.

**Backend tables:** `users`, `audit_logs`

---

## 6. Module 2.2 — Borrower Onboarding & KYC

**Roles:** FIELD_OFFICER (upload), CREDIT_OFFICER (verify)  
**Files:** `src/pages/field/Borrowers.js`, `src/pages/field/KYCUpload.js`, `src/pages/credit/KYCVerify.js`

**Borrowers.js** — Form includes `email` and `password` fields (new backend requirement). When submitted, `POST /api/borrowers` auto-creates a linked User account (role=BORROWER) on the backend.

**KYCUpload.js** — FIELD_OFFICER only. Shows amber warning banner: "You can upload documents but cannot verify them." Calls `POST /api/kyc`. Status starts as PENDING.

**KYCVerify.js** — CREDIT_OFFICER only. Verify/Reject buttons call `PATCH /api/kyc/{id}/verify?status=VERIFIED&verifiedByID=`. FIELD_OFFICER cannot access this page (Guard redirects, and backend returns 403 anyway).

**Backend tables:** `borrowers`, `borrower_kyc`

---

## 7. Module 2.3 — Group & Centre Management

**Role:** FIELD_OFFICER, BRANCH_MANAGER  
**Files:** `src/pages/field/Centres.js`, `src/pages/field/Groups.js`, `src/pages/field/Meetings.js`

**Centres.js** — Creates village centres with `meetingDay` and `meetingTime`.

**Groups.js** — Creates JLG groups within centres. `jointLiabilityEnabled` boolean toggle.

**Meetings.js** — Two modes: Schedule (create) and Record (update with attendance + collectionAmount). Only SCHEDULED meetings show "Record" button.

**Backend tables:** `centres`, `borrower_groups`, `centre_meetings`

---

## 8. Module 2.4 — Loan Origination & Approval

**Roles:** ADMIN, CREDIT_OFFICER, FIELD_OFFICER  
**Files:** `src/pages/admin/Products.js`, `src/pages/field/Applications.js`, `src/pages/credit/Applications.js`, `src/pages/credit/Assessments.js`, `src/pages/credit/Sanctions.js`

**Products.js** — ADMIN creates/edits/discontinues loan products. `interestType` FLAT or REDUCING.

**field/Applications.js** — Creates applications (always DRAFT). Submit button calls `PATCH /{id}/submit` → DRAFT→SUBMITTED.

**credit/Applications.js** — State machine UI. SUBMITTED rows show "UNDER_REVIEW" button. UNDER_REVIEW shows "APPROVE" and "REJECT". Confirmation modal with remarks required.

**Sanctions.js** — Issue sanction on APPROVED applications only. Accept button → `acceptedByBorrower=true`.

**Backend tables:** `loan_products`, `loan_applications`, `credit_assessments`, `sanction_letters`

---

## 9. Module 2.5 — Loan Disbursement & Accounts

**Role:** CREDIT_OFFICER (disburse), all roles (view)  
**Files:** `src/pages/credit/Disbursements.js`, `src/pages/credit/Accounts.js`, `src/pages/borrower/MyLoans.js`, `src/pages/borrower/Schedule.js`

**Disbursements.js** — Lists APPROVED applications for selection. `POST /api/loan-accounts/disburse` is `@Transactional` — creates account + all N schedule rows atomically.

**Accounts.js (credit)** — Table of all loan accounts. "View" button loads repayment schedule for selected account inline below the table.

**Schedule.js (borrower)** — Fetches loans by `userID`, auto-selects active loan, loads full schedule. Color-coded rows: PAID=green, PARTIAL=amber, OVERDUE=red. Shows cumulative `amountPaid` per installment.

**Backend tables:** `loan_accounts`, `repayment_schedules`

---

## 10. Module 2.6 — Collections & Delinquency

**Roles:** FIELD_OFFICER + COLLECTIONS_OFFICER (record), BRANCH_MANAGER (monitor)  
**Files:** `src/pages/field/Collections.js`, `src/pages/collections/Cases.js`, `src/pages/collections/RecordPayment.js`, `src/pages/branch/Delinquency.js`

**Collections.js + RecordPayment.js** — Info banner explains the 3-branch state machine. `scheduleID` is optional — if provided, tracks against the specific installment. Backend handles FULL/PARTIAL/EXCESS logic.

**Delinquency (branch)** — Shows PAR30/PAR60/PAR90/PAR180 stats. "⚡ Trigger Engine" button calls `POST /api/delinquency/trigger` (ADMIN JWT required — this button only appears for ADMIN via backend enforcement).

**Backend tables:** `collection_records`, `delinquency_cases`

---

## 11. Module 2.7 — Portfolio Analytics & Reporting

**Role:** BRANCH_MANAGER  
**Files:** `src/pages/branch/Dashboard.js`

**Dashboard.js** — "↻ Generate Report" calls `POST /api/reports/generate?scope=BRANCH&scopeRefID={branchID}`. Displays: activeLoanCount, totalOutstanding, npaPercent (red if >0), PAR30, PAR90 as StatCards. Recharts BarChart shows Outstanding vs Disbursed. Report history table below.

**Backend tables:** `portfolio_reports`

---

## 12. Module 2.8 — Notifications & Alerts

**Roles:** ADMIN (send), all (receive)  
**Files:** `src/pages/admin/Notifications.js`, `src/pages/borrower/Notifications.js`

**admin/Notifications.js** — Sends to specific userID with category (REPAYMENT/DISBURSEMENT/MEETING/DELINQUENCY/COMPLIANCE).

**borrower/Notifications.js** — Inbox with UNREAD/READ/DISMISSED lifecycle. Unread shown with blue background. Read/Dismiss buttons call respective PATCH endpoints.

**Backend tables:** `notifications`

---

## 13. Role-Based Navigation Map

| Path | Role | Component |
|------|------|-----------|
| /admin | ADMIN | admin/Dashboard.js |
| /admin/products | ADMIN | admin/Products.js |
| /admin/users | ADMIN | admin/Users.js |
| /admin/notifications | ADMIN | admin/Notifications.js |
| /admin/audit | ADMIN | admin/AuditLogs.js |
| /field | FIELD_OFFICER | field/Dashboard.js |
| /field/borrowers | FIELD_OFFICER | field/Borrowers.js |
| /field/kyc | FIELD_OFFICER | field/KYCUpload.js |
| /field/centres | FIELD_OFFICER | field/Centres.js |
| /field/groups | FIELD_OFFICER | field/Groups.js |
| /field/meetings | FIELD_OFFICER | field/Meetings.js |
| /field/applications | FIELD_OFFICER | field/Applications.js |
| /field/collections | FIELD_OFFICER | field/Collections.js |
| /credit | CREDIT_OFFICER | credit/Dashboard.js |
| /credit/kyc | CREDIT_OFFICER | credit/KYCVerify.js |
| /credit/assessments | CREDIT_OFFICER | credit/Assessments.js |
| /credit/applications | CREDIT_OFFICER | credit/Applications.js |
| /credit/sanctions | CREDIT_OFFICER | credit/Sanctions.js |
| /credit/disbursements | CREDIT_OFFICER | credit/Disbursements.js |
| /credit/accounts | CREDIT_OFFICER | credit/Accounts.js |
| /branch | BRANCH_MANAGER | branch/Dashboard.js |
| /branch/register | BRANCH_MANAGER | branch/RegisterStaff.js |
| /branch/delinquency | BRANCH_MANAGER | branch/Delinquency.js |
| /branch/accounts | BRANCH_MANAGER | branch/Accounts.js |
| /collections | COLLECTIONS_OFFICER | collections/Dashboard.js |
| /collections/cases | COLLECTIONS_OFFICER | collections/Cases.js |
| /collections/record | COLLECTIONS_OFFICER | collections/RecordPayment.js |
| /borrower | BORROWER | borrower/Portal.js |
| /borrower/loans | BORROWER | borrower/MyLoans.js |
| /borrower/schedule | BORROWER | borrower/Schedule.js |
| /borrower/notifications | BORROWER | borrower/Notifications.js |

---

## 14. API Integration Reference

All API calls go through `src/api/client.js` which auto-attaches the JWT. The `src/api/index.js` exports one function per backend endpoint.

### Auth
- `login(d)` → `POST /api/auth/login`
- `register(d)` → `POST /api/auth/register` *(requires ADMIN or BM JWT)*

### Borrowers & KYC
- `createBorrower(d)` — sends `{name, email, password, nationalIDNumber, ...}`
- `uploadKyc(d)` → `POST /api/kyc`
- `verifyKyc(id, status, verifiedByID)` → `PATCH /api/kyc/{id}/verify` *(CREDIT only)*

### Loan Lifecycle
- `createApplication(d)` → always creates DRAFT
- `submitApplication(id)` → DRAFT → SUBMITTED
- `updateAppStatus(id, {status, remarks})` → state machine
- `issueSanction(d)` → requires APPROVED application
- `acceptSanction(id)` → sets `acceptedByBorrower=true`
- `disburseLoan(d)` → `POST /api/loan-accounts/disburse` *(@Transactional)*

### Collections
- `recordCollection(d)` — `{loanAccountID, scheduleID?, collectedAmount, mode}`
- Backend auto-detects FULL/PARTIAL/EXCESS

### Delinquency
- `triggerEngine()` → `POST /api/delinquency/trigger` *(ADMIN JWT)*

### Reports
- `generateReport(scope, scopeRefID)` → `POST /api/reports/generate?scope=BRANCH&scopeRefID=1`

---

## 15. Quick Start Guide

```bash
# Prerequisites: Node 18+, backend on port 8082

unzip microlend-frontend.zip
cd microlend-frontend
npm install
npm start
# Opens http://localhost:3000

# Login: admin@microlend.com / admin123
# Register staff via Admin → Staff Users → Register Staff
# Borrower accounts created automatically when Field Officer registers a borrower
```

---

*MicroLend Frontend Documentation — React 18 · com.microlend · Port 3000*
