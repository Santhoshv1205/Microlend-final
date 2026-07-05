import React, { createContext, useContext, useState } from 'react';
import { login as apiLogin, verifyOtp as apiVerifyOtp, logout as apiLogout } from '../api';

const AuthContext = createContext(null);

const ROLE_HOME = {
  ADMIN: '/admin',
  BRANCH_MANAGER: '/branch',
  CREDIT_OFFICER: '/credit',
  FIELD_OFFICER: '/field',
  COLLECTIONS_OFFICER: '/collections',
  BORROWER: '/borrower',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ml_user')); } catch { return null; }
  });

  async function login(email, password) {
    await apiLogin({ email, password });
  }

  async function verifyAndCompleteLogin(email, otpCode) {
    const r = await apiVerifyOtp({ email, otpCode });
    const data = r.data.data;
    localStorage.setItem('ml_token', data.token);
    localStorage.setItem('ml_refresh_token', data.refreshToken);
    localStorage.setItem('ml_user', JSON.stringify(data));
    setUser(data);
    return { ok: true, to: ROLE_HOME[data.role] || '/' };
  }

  async function logout() {
    try {
      await apiLogout();
    } catch (e) {
      console.warn("Logout request failed:", e);
    }
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, verifyAndCompleteLogin, logout, ROLE_HOME }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
