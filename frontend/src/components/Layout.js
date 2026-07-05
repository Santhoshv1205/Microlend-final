import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = {
  ADMIN: [
    { to: '/admin', icon: '🏠', label: 'Dashboard' },
    { to: '/admin/products', icon: '📦', label: 'Loan Products' },
    { to: '/admin/users', icon: '👥', label: 'Staff Users' },
    { to: '/admin/notifications', icon: '🔔', label: 'Notifications' },
    { to: '/admin/audit', icon: '📋', label: 'Audit Logs' },
  ],
  FIELD_OFFICER: [
    { to: '/field', icon: '🏠', label: 'Dashboard' },
    { to: '/field/borrowers', icon: '👤', label: 'Borrowers' },
    { to: '/field/kyc', icon: '📄', label: 'KYC Upload' },
    { to: '/field/centres', icon: '🏘️', label: 'Centres' },
    { to: '/field/groups', icon: '👥', label: 'Groups' },
    { to: '/field/meetings', icon: '📅', label: 'Meetings' },
    { to: '/field/applications', icon: '📝', label: 'Applications' },
    { to: '/field/collections', icon: '💰', label: 'Collections' },
  ],
  CREDIT_OFFICER: [
    { to: '/credit', icon: '🏠', label: 'Dashboard' },
    { to: '/credit/kyc', icon: '✅', label: 'KYC Verify' },
    { to: '/credit/assessments', icon: '📊', label: 'Assessments' },
    { to: '/credit/applications', icon: '📝', label: 'Applications' },
    { to: '/credit/sanctions', icon: '📜', label: 'Sanctions' },
    { to: '/credit/disbursements', icon: '💳', label: 'Disburse' },
    { to: '/credit/accounts', icon: '📂', label: 'Accounts' },
  ],
  BRANCH_MANAGER: [
    { to: '/branch', icon: '🏠', label: 'Dashboard' },
    { to: '/branch/register', icon: '➕', label: 'Register Staff' },
    { to: '/branch/portfolio', icon: '📈', label: 'Portfolio' },
    { to: '/branch/delinquency', icon: '⚠️', label: 'Delinquency' },
    { to: '/branch/accounts', icon: '📂', label: 'Accounts' },
  ],
  COLLECTIONS_OFFICER: [
    { to: '/collections', icon: '🏠', label: 'Dashboard' },
    { to: '/collections/cases', icon: '⚠️', label: 'Cases' },
    { to: '/collections/record', icon: '💰', label: 'Record Payment' },
  ],
  BORROWER: [
    { to: '/borrower', icon: '🏠', label: 'My Portal' },
    { to: '/borrower/loans', icon: '💼', label: 'My Loans' },
    { to: '/borrower/schedule', icon: '📅', label: 'Schedule' },
    { to: '/borrower/notifications', icon: '🔔', label: 'Notifications' },
  ],
};

const ROLE_COLOR = {
  ADMIN: '#1d4ed8', BRANCH_MANAGER: '#d97706', CREDIT_OFFICER: '#7c3aed',
  FIELD_OFFICER: '#15803d', COLLECTIONS_OFFICER: '#dc2626', BORROWER: '#0891b2',
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = NAV[user?.role] || [];
  const roleColor = ROLE_COLOR[user?.role] || '#1d4ed8';

  function handleLogout() { logout(); navigate('/login'); }

  const sideW = collapsed ? 58 : 220;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: sideW, background: '#0f172a', position: 'sticky', top: 0,
        height: '100vh', overflowY: 'auto', overflowX: 'hidden', flexShrink: 0,
        transition: 'width .2s ease', display: 'flex', flexDirection: 'column' }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '16px 0' : '16px 14px', borderBottom: '1px solid #1e293b',
          display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: roleColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#fff', fontSize: 14, flexShrink: 0 }}>M</div>
          {!collapsed && <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>MicroLend</span>}
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div style={{ padding: '8px 14px', background: '#1e293b' }}>
            <span style={{ background: roleColor + '33', color: roleColor, fontSize: 10,
              padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {navItems.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to.split('/').length <= 2}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '10px 13px' : '10px 14px',
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive ? roleColor + '33' : 'none',
                borderLeft: isActive ? `3px solid ${roleColor}` : '3px solid transparent',
                textDecoration: 'none', fontSize: 13, fontWeight: isActive ? 600 : 400,
                transition: 'all .15s',
              })}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
              {!collapsed && <span>{n.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div style={{ borderTop: '1px solid #1e293b', padding: collapsed ? '12px 8px' : 12 }}>
          {!collapsed && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 600, overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ color: '#64748b', fontSize: 11, overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
            </div>
          )}
          <button onClick={handleLogout} style={{ background: '#dc2626', color: '#fff',
            border: 'none', borderRadius: 6, padding: collapsed ? '6px 8px' : '6px 12px',
            cursor: 'pointer', fontSize: 11, fontWeight: 600, width: '100%' }}>
            {collapsed ? '→' : 'Logout'}
          </button>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(c => !c)}
          style={{ background: '#1e293b', border: 'none', color: '#64748b',
            cursor: 'pointer', padding: '8px', fontSize: 14, borderTop: '1px solid #334155' }}>
          {collapsed ? '›' : '‹'}
        </button>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
