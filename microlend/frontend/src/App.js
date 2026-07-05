import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Users from './pages/admin/Users';
import AuditLogs from './pages/admin/AuditLogs';
import AdminNotifications from './pages/admin/Notifications';

// Field
import FieldDashboard from './pages/field/Dashboard';
import FieldBorrowers from './pages/field/Borrowers';
import KYCUpload from './pages/field/KYCUpload';
import FieldCentres from './pages/field/Centres';
import FieldGroups from './pages/field/Groups';
import FieldMeetings from './pages/field/Meetings';
import FieldApplications from './pages/field/Applications';
import FieldCollections from './pages/field/Collections';

// Credit
import CreditDashboard from './pages/credit/Dashboard';
import KYCVerify from './pages/credit/KYCVerify';
import Assessments from './pages/credit/Assessments';
import CreditApplications from './pages/credit/Applications';
import Sanctions from './pages/credit/Sanctions';
import Disbursements from './pages/credit/Disbursements';
import CreditAccounts from './pages/credit/Accounts';

// Branch
import BranchDashboard from './pages/branch/Dashboard';
import RegisterStaff from './pages/branch/RegisterStaff';
import BranchDelinquency from './pages/branch/Delinquency';
import BranchAccounts from './pages/branch/Accounts';

// Collections
import CollectionsDashboard from './pages/collections/Dashboard';
import CollectionsCases from './pages/collections/Cases';
import RecordPayment from './pages/collections/RecordPayment';

// Borrower
import BorrowerPortal from './pages/borrower/Portal';
import MyLoans from './pages/borrower/MyLoans';
import BorrowerSchedule from './pages/borrower/Schedule';
import BorrowerNotifications from './pages/borrower/Notifications';

const ROLE_HOME = {
  ADMIN:'/admin', BRANCH_MANAGER:'/branch', CREDIT_OFFICER:'/credit',
  FIELD_OFFICER:'/field', COLLECTIONS_OFFICER:'/collections', BORROWER:'/borrower',
};

function Guard({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={ROLE_HOME[user.role] || '/'} replace />;
  return <Layout>{children}</Layout>;
}

function Home() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />

          {/* ADMIN */}
          <Route path="/admin" element={<Guard role="ADMIN"><AdminDashboard /></Guard>} />
          <Route path="/admin/products" element={<Guard role="ADMIN"><Products /></Guard>} />
          <Route path="/admin/users" element={<Guard role="ADMIN"><Users /></Guard>} />
          <Route path="/admin/audit" element={<Guard role="ADMIN"><AuditLogs /></Guard>} />
          <Route path="/admin/notifications" element={<Guard role="ADMIN"><AdminNotifications /></Guard>} />

          {/* FIELD */}
          <Route path="/field" element={<Guard role="FIELD_OFFICER"><FieldDashboard /></Guard>} />
          <Route path="/field/borrowers" element={<Guard role="FIELD_OFFICER"><FieldBorrowers /></Guard>} />
          <Route path="/field/kyc" element={<Guard role="FIELD_OFFICER"><KYCUpload /></Guard>} />
          <Route path="/field/centres" element={<Guard role="FIELD_OFFICER"><FieldCentres /></Guard>} />
          <Route path="/field/groups" element={<Guard role="FIELD_OFFICER"><FieldGroups /></Guard>} />
          <Route path="/field/meetings" element={<Guard role="FIELD_OFFICER"><FieldMeetings /></Guard>} />
          <Route path="/field/applications" element={<Guard role="FIELD_OFFICER"><FieldApplications /></Guard>} />
          <Route path="/field/collections" element={<Guard role="FIELD_OFFICER"><FieldCollections /></Guard>} />

          {/* CREDIT */}
          <Route path="/credit" element={<Guard role="CREDIT_OFFICER"><CreditDashboard /></Guard>} />
          <Route path="/credit/kyc" element={<Guard role="CREDIT_OFFICER"><KYCVerify /></Guard>} />
          <Route path="/credit/assessments" element={<Guard role="CREDIT_OFFICER"><Assessments /></Guard>} />
          <Route path="/credit/applications" element={<Guard role="CREDIT_OFFICER"><CreditApplications /></Guard>} />
          <Route path="/credit/sanctions" element={<Guard role="CREDIT_OFFICER"><Sanctions /></Guard>} />
          <Route path="/credit/disbursements" element={<Guard role="CREDIT_OFFICER"><Disbursements /></Guard>} />
          <Route path="/credit/accounts" element={<Guard role="CREDIT_OFFICER"><CreditAccounts /></Guard>} />

          {/* BRANCH */}
          <Route path="/branch" element={<Guard role="BRANCH_MANAGER"><BranchDashboard /></Guard>} />
          <Route path="/branch/register" element={<Guard role="BRANCH_MANAGER"><RegisterStaff /></Guard>} />
          <Route path="/branch/portfolio" element={<Guard role="BRANCH_MANAGER"><BranchDashboard /></Guard>} />
          <Route path="/branch/delinquency" element={<Guard role="BRANCH_MANAGER"><BranchDelinquency /></Guard>} />
          <Route path="/branch/accounts" element={<Guard role="BRANCH_MANAGER"><BranchAccounts /></Guard>} />

          {/* COLLECTIONS */}
          <Route path="/collections" element={<Guard role="COLLECTIONS_OFFICER"><CollectionsDashboard /></Guard>} />
          <Route path="/collections/cases" element={<Guard role="COLLECTIONS_OFFICER"><CollectionsCases /></Guard>} />
          <Route path="/collections/record" element={<Guard role="COLLECTIONS_OFFICER"><RecordPayment /></Guard>} />

          {/* BORROWER */}
          <Route path="/borrower" element={<Guard role="BORROWER"><BorrowerPortal /></Guard>} />
          <Route path="/borrower/loans" element={<Guard role="BORROWER"><MyLoans /></Guard>} />
          <Route path="/borrower/schedule" element={<Guard role="BORROWER"><BorrowerSchedule /></Guard>} />
          <Route path="/borrower/notifications" element={<Guard role="BORROWER"><BorrowerNotifications /></Guard>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
