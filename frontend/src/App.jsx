import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './utils/auth.jsx';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Alumni from './pages/Alumni';
import Events from './pages/Events';
import Jobs from './pages/Jobs';
import Mentorship from './pages/Mentorship';
import Fundraising from './pages/Fundraising';
import Profile from './pages/Profile';
import './App.css';

// Page transition animation
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

// Protected route component
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medium-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && user) {
    const hasRequiredRole = Array.isArray(roles)
      ? roles.some((role) => user.roles.includes(role))
      : user.roles.includes(roles);
    if (!hasRequiredRole) return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => (
  <ProtectedRoute roles={['admin']}>{children}</ProtectedRoute>
);

const Layout = ({ children, showSidebar = false }) => (
  <div className="min-h-screen bg-light-gray">
    <Navbar />
    <div className="flex">
      {showSidebar && <Sidebar />}
      <main className={`flex-1 ${showSidebar ? 'ml-0' : ''}`}>
        <div className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  </div>
);

// -------------------- Authentication Pages --------------------

// Login Page
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await login({ email, password }); // pass object
    if (result.success) {
      navigate('/');
    } else {
      alert(result.message || 'Login failed. Check your credentials.');
    }
  } catch (err) {
    alert('Login failed. Check your credentials.');
    console.error(err);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-dark-blue mb-6">Log In to SetuConnect</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-dark-gray text-sm font-medium mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-dark-gray text-sm font-medium mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="w-full bg-medium-blue text-white py-2 px-4 rounded-md hover:bg-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medium-blue">
            Sign in
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-dark-gray">
            Don't have an account? <a href="/register" className="font-medium text-medium-blue hover:text-dark-blue">Sign up</a>
          </p>
          <p className="text-sm text-dark-gray mt-2">
            <a href="/forgot-password" className="font-medium text-medium-blue hover:text-dark-blue">Forgot password?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Register Page
const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");
    if (!graduationYear) return alert("Please select graduation year");
    try {
      await register({ name, email, password, graduationYear });
      alert("Account created! Please verify your email.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-dark-blue mb-6">Create Your SetuConnect Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-dark-gray text-sm font-medium mb-2">Full Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue" required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-dark-gray text-sm font-medium mb-2">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue" required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-dark-gray text-sm font-medium mb-2">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue" required />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block text-dark-gray text-sm font-medium mb-2">Confirm Password</label>
            <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue" required />
          </div>
          <div className="mb-6">
            <label htmlFor="graduation-year" className="block text-dark-gray text-sm font-medium mb-2">Graduation Year</label>
            <select id="graduation-year" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} className="w-full px-3 py-2 border border-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue" required>
              <option value="">Select your graduation year</option>
              {Array.from({ length: 19 }, (_, i) => 2023 - i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-medium-blue text-white py-2 px-4 rounded-md hover:bg-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medium-blue">
            Create Account
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-dark-gray">
            Already have an account? <a href="/login" className="font-medium text-medium-blue hover:text-dark-blue">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Forgot Password Page
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { sendResetLink } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendResetLink(email);
      setMessage('Reset link sent! Check your email.');
    } catch (err) {
      console.error(err);
      alert('Failed to send reset link.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-dark-blue mb-6">Reset Your Password</h1>
        {message && <p className="text-green-600 mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-dark-gray text-sm font-medium mb-2">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue" required />
          </div>
          <button type="submit" className="w-full bg-medium-blue text-white py-2 px-4 rounded-md hover:bg-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medium-blue">
            Send Reset Link
          </button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => navigate('/login')} className="font-medium text-medium-blue hover:text-dark-blue">Back to login</button>
        </div>
      </div>
    </div>
  );
};

// Reset Password Page
const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { resetPassword } = useAuth();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert('Passwords do not match');
    try {
      await resetPassword(token, password);
      setMessage('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-dark-blue mb-6">Create New Password</h1>
        {message && <p className="text-green-600 mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-dark-gray text-sm font-medium mb-2">New Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue" required />
          </div>
          <div className="mb-6">
            <label htmlFor="confirm-password" className="block text-dark-gray text-sm font-medium mb-2">Confirm New Password</label>
            <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-medium-blue" required />
          </div>
          <button type="submit" className="w-full bg-medium-blue text-white py-2 px-4 rounded-md hover:bg-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medium-blue">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

// -------------------- Main App and Routes --------------------

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
      <Route path="/alumni" element={<ProtectedRoute><Layout><Alumni /></Layout></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><Layout><Events /></Layout></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><Layout><Jobs /></Layout></ProtectedRoute>} />
      <Route path="/mentorship" element={<ProtectedRoute><Layout><Mentorship /></Layout></ProtectedRoute>} />
      <Route path="/fundraising" element={<ProtectedRoute><Layout><Fundraising /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />

      {/* Admin route */}
      <Route path="/admin/*" element={<AdminRoute><Layout showSidebar={true}><div>Admin Dashboard</div></Layout></AdminRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<div className="text-center mt-20">Page Not Found</div>} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;
