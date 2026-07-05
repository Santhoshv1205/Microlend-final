import client from './client';

// ── AUTH ─────────────────────────────────────────────────────────────────────
export const login = d => client.post('/api/auth/login', d);
export const verifyOtp = d => client.post('/api/auth/login/verify', d);
export const register = d => client.post('/api/auth/register', d);
export const logout = () => client.post('/api/auth/logout');

// ── ADMIN USERS ───────────────────────────────────────────────────────────────
export const getUsers = () => client.get('/api/admin/users');
export const getUserById = id => client.get(`/api/admin/users/${id}`);
export const getUsersByRole = r => client.get(`/api/admin/users/role/${r}`);
export const updateUserStatus = (id, status) => client.patch(`/api/admin/users/${id}/status`, null, { params: { status } });
export const deleteUser = id => client.delete(`/api/admin/users/${id}`);
export const getAuditLogs = () => client.get('/api/admin/audit-logs');

// ── LOAN PRODUCTS ─────────────────────────────────────────────────────────────
export const getProducts = () => client.get('/api/loan-products');
export const getProductById = id => client.get(`/api/loan-products/${id}`);
export const createProduct = d => client.post('/api/loan-products', d);
export const updateProduct = (id, d) => client.put(`/api/loan-products/${id}`, d);
export const discontinueProduct = id => client.patch(`/api/loan-products/${id}/discontinue`);

// ── BORROWERS ─────────────────────────────────────────────────────────────────
export const getBorrowers = () => client.get('/api/borrowers');
export const getBorrowerById = id => client.get(`/api/borrowers/${id}`);
export const createBorrower = d => client.post('/api/borrowers', d);
export const updateBorrower = (id, d) => client.put(`/api/borrowers/${id}`, d);
export const deleteBorrower = id => client.delete(`/api/borrowers/${id}`);
export const getBorrowersByStatus = s => client.get(`/api/borrowers/status/${s}`);

// ── KYC ───────────────────────────────────────────────────────────────────────
export const getKyc = () => client.get('/api/kyc');
export const getKycById = id => client.get(`/api/kyc/${id}`);
export const getKycByBorrower = bid => client.get(`/api/kyc/borrower/${bid}`);
export const uploadKyc = d => client.post('/api/kyc', d);
export const verifyKyc = (id, status, verifiedByID) =>
  client.patch(`/api/kyc/${id}/verify`, null, { params: { status, verifiedByID } });

// ── CENTRES ───────────────────────────────────────────────────────────────────
export const getCentres = () => client.get('/api/centres');
export const getCentreById = id => client.get(`/api/centres/${id}`);
export const createCentre = d => client.post('/api/centres', d);
export const updateCentre = (id, d) => client.put(`/api/centres/${id}`, d);

// ── BORROWER GROUPS ───────────────────────────────────────────────────────────
export const getGroups = () => client.get('/api/groups');
export const getGroupById = id => client.get(`/api/groups/${id}`);
export const getGroupsByCentre = cid => client.get(`/api/groups/centre/${cid}`);
export const createGroup = d => client.post('/api/groups', d);
export const updateGroup = (id, d) => client.put(`/api/groups/${id}`, d);

// ── MEETINGS ──────────────────────────────────────────────────────────────────
export const getMeetings = () => client.get('/api/meetings');
export const getMeetingById = id => client.get(`/api/meetings/${id}`);
export const getMeetingsByCentre = cid => client.get(`/api/meetings/centre/${cid}`);
export const createMeeting = d => client.post('/api/meetings', d);
export const updateMeeting = (id, d) => client.put(`/api/meetings/${id}`, d);

// ── LOAN APPLICATIONS ─────────────────────────────────────────────────────────
export const getApplications = () => client.get('/api/loan-applications');
export const getApplicationById = id => client.get(`/api/loan-applications/${id}`);
export const getApplicationsByBorrower = bid => client.get(`/api/loan-applications/borrower/${bid}`);
export const getApplicationsByStatus = s => client.get(`/api/loan-applications/status/${s}`);
export const createApplication = d => client.post('/api/loan-applications', d);
export const submitApplication = id => client.patch(`/api/loan-applications/${id}/submit`);
export const updateAppStatus = (id, d) => client.patch(`/api/loan-applications/${id}/status`, d);

// ── CREDIT ASSESSMENTS ────────────────────────────────────────────────────────
export const getAssessments = () => client.get('/api/credit-assessments');
export const getAssessmentById = id => client.get(`/api/credit-assessments/${id}`);
export const createAssessment = d => client.post('/api/credit-assessments', d);
export const updateAssessment = (id, d) => client.put(`/api/credit-assessments/${id}`, d);

// ── SANCTION LETTERS ──────────────────────────────────────────────────────────
export const getSanctions = () => client.get('/api/sanction-letters');
export const getSanctionById = id => client.get(`/api/sanction-letters/${id}`);
export const getSanctionByApp = appId => client.get(`/api/sanction-letters/application/${appId}`);
export const issueSanction = d => client.post('/api/sanction-letters', d);
export const acceptSanction = id => client.patch(`/api/sanction-letters/${id}/accept`);

// ── LOAN ACCOUNTS ─────────────────────────────────────────────────────────────
export const getLoanAccounts = () => client.get('/api/loan-accounts');
export const getLoanAccountById = id => client.get(`/api/loan-accounts/${id}`);
export const getLoansByBorrower = bid => client.get(`/api/loan-accounts/borrower/${bid}`);
export const getSchedule = id => client.get(`/api/loan-accounts/${id}/schedule`);
export const disburseLoan = d => client.post('/api/loan-accounts/disburse', d);

// ── COLLECTIONS ───────────────────────────────────────────────────────────────
export const getCollections = () => client.get('/api/collections');
export const getCollectionById = id => client.get(`/api/collections/${id}`);
export const getCollectionsByLoan = lid => client.get(`/api/collections/loan-account/${lid}`);
export const recordCollection = d => client.post('/api/collections', d);

// ── DELINQUENCY ───────────────────────────────────────────────────────────────
export const getDelinquencies = () => client.get('/api/delinquency');
export const getDelinquencyById = id => client.get(`/api/delinquency/${id}`);
export const getDelinquenciesByStatus = s => client.get(`/api/delinquency/status/${s}`);
export const getDelinquenciesByOfficer = oid => client.get(`/api/delinquency/officer/${oid}`);
export const getDelinquenciesByLoan = lid => client.get(`/api/delinquency/loan-account/${lid}`);
export const createDelinquency = d => client.post('/api/delinquency', d);
export const updateDelinquency = (id, d) => client.put(`/api/delinquency/${id}`, d);
export const triggerEngine = () => client.post('/api/delinquency/trigger');

// ── REPORTS ───────────────────────────────────────────────────────────────────
export const getReports = () => client.get('/api/reports');
export const getReportById = id => client.get(`/api/reports/${id}`);
export const generateReport = (scope, scopeRefID) =>
  client.post('/api/reports/generate', null, { params: { scope, ...(scopeRefID ? { scopeRefID } : {}) } });

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export const getNotifications = () => client.get('/api/notifications');
export const getNotifsByUser = uid => client.get(`/api/notifications/user/${uid}`);
export const getUnreadNotifs = uid => client.get(`/api/notifications/user/${uid}/unread`);
export const sendNotif = (userID, message, category) =>
  client.post('/api/notifications/send', null, { params: { userID, message, category } });
export const markNotifRead = id => client.patch(`/api/notifications/${id}/read`);
export const dismissNotif = id => client.patch(`/api/notifications/${id}/dismiss`);
