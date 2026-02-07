import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import './App.css';

// Pages
import { HomePage } from './pages/HomePage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Client Pages
import { ClientDashboard } from './pages/client/ClientDashboard';
import { CreateTaskPage } from './pages/client/CreateTaskPage';
import { ClientTasksPage } from './pages/client/ClientTasksPage';
import { ClientMilestonesPage } from './pages/client/ClientMilestonesPage';
import { TaskMilestonesPage } from './pages/client/TaskMilestonesPage';

// Freelancer Pages
import { FreelancerDashboard } from './pages/freelancer/FreelancerDashboard';
import { FreelancerProfilePage } from './pages/freelancer/FreelancerProfilePage';
import { FreelancerTasksPage } from './pages/freelancer/FreelancerTasksPage';
import { FreelancerMilestonesPage } from './pages/freelancer/FreelancerMilestonesPage';
import { FreelancerPerformancePage } from './pages/freelancer/FreelancerPerformancePage';
import { FreelancerSubmitPage } from './pages/freelancer/FreelancerSubmitPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { TaskManagementPage } from './pages/admin/TaskManagementPage';
import { PaymentManagementPage } from './pages/admin/PaymentManagementPage';
import { PerformanceAnalyticsPage } from './pages/admin/PerformanceAnalyticsPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Client Routes */}
          <Route
            path="/client/*"
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<ClientDashboard />} />
                    <Route path="create-task" element={<CreateTaskPage />} />
                    <Route path="tasks" element={<ClientTasksPage />} />
                    <Route path="task/:taskId/milestones" element={<TaskMilestonesPage />} />
                    <Route path="milestones" element={<ClientMilestonesPage />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Freelancer Routes */}
          <Route
            path="/freelancer/*"
            element={
              <ProtectedRoute requiredRole="FREELANCER">
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<FreelancerDashboard />} />
                    <Route path="profile" element={<FreelancerProfilePage />} />
                    <Route path="tasks" element={<FreelancerTasksPage />} />
                    <Route path="milestones" element={<FreelancerMilestonesPage />} />
                    <Route path="performance" element={<FreelancerPerformancePage />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagementPage />} />
                    <Route path="tasks" element={<TaskManagementPage />} />
                    <Route path="payments" element={<PaymentManagementPage />} />
                    <Route path="performance" element={<PerformanceAnalyticsPage />} />
                    <Route path="audits" element={<AuditLogsPage />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
