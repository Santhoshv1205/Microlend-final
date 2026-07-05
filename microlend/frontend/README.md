# MicroLend Frontend

React 18 frontend for MicroLend NBFC Loan Management System.

## Prerequisites
- Node.js 18+
- Backend running on port 8082

## Setup & Run
```bash
npm install
npm start
```
Opens at http://localhost:3000 · Proxies /api/* → http://localhost:8082

## Default Login
admin@microlend.com / admin123

## 6 Role Dashboards
| Role | URL | Login |
|------|-----|-------|
| ADMIN | /admin | admin@microlend.com / admin123 |
| FIELD_OFFICER | /field | Register via Admin panel |
| CREDIT_OFFICER | /credit | Register via Admin panel |
| BRANCH_MANAGER | /branch | Register via Admin panel |
| COLLECTIONS_OFFICER | /collections | Register via Admin panel |
| BORROWER | /borrower | Auto-created on borrower registration |

## File Structure
```
src/
├── api/
│   ├── client.js        Axios + JWT interceptor
│   └── index.js         50+ API functions (matches new backend endpoints)
├── context/
│   └── AuthContext.js   JWT auth state + role-based routing
├── components/
│   └── Layout.js        Collapsible sidebar with role-specific nav
├── utils.js             Shared components + hooks (useApi, Badge, Modal, DataTable, etc.)
└── pages/
    ├── Login.js
    ├── admin/           Dashboard, Products, Users, AuditLogs, Notifications
    ├── field/           Dashboard, Borrowers, KYCUpload, Centres, Groups, Meetings, Applications, Collections
    ├── credit/          Dashboard, KYCVerify, Assessments, Applications, Sanctions, Disbursements, Accounts
    ├── branch/          Dashboard, RegisterStaff, Delinquency, Accounts
    ├── collections/     Dashboard, Cases, RecordPayment
    └── borrower/        Portal, MyLoans, Schedule, Notifications
```
