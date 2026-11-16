import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { ResumeAnalyzer } from './pages/student/ResumeAnalyzer';
import { JobList } from './pages/student/JobList';
import { ApplicationTracker } from './pages/student/ApplicationTracker';
import { CareerRecommendations } from './pages/student/CareerRecommendations';
import { InterviewPreparation } from './pages/student/InterviewPreparation';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminJobManagement } from './pages/admin/AdminJobManagement';
import { AdminApplications } from './pages/admin/AdminApplications';
import { AdminStudents } from './pages/admin/AdminStudents';

// Main Application Layout
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Dark Navy Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 min-h-screen">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Root Router Redirector
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute requiredRole="ROLE_STUDENT" />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/profile" element={<StudentProfile />} />
              <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
              <Route path="/jobs" element={<JobList />} />
              <Route path="/applications" element={<ApplicationTracker />} />
              <Route path="/career-recommendations" element={<CareerRecommendations />} />
              <Route path="/interview-prep" element={<InterviewPreparation />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/jobs" element={<AdminJobManagement />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
              <Route path="/admin/students" element={<AdminStudents />} />
            </Route>
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

