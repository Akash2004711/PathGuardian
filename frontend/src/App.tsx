import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './layouts/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { Intelligence3DPage } from './pages/Intelligence3DPage';
import { UploadPage } from './pages/UploadPage';
import { ResultsPage } from './pages/ResultsPage';
import { JobsPage } from './pages/JobsPage';
import { MapPage } from './pages/MapPage';
import { GpsPage } from './pages/GpsPage';
import { RoadHealthPage } from './pages/RoadHealthPage';
import { SegmentDetailPage } from './pages/SegmentDetailPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { AuthorityPage } from './pages/AuthorityPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { UsersPage } from './pages/UsersPage';
import { ModelConfigPage } from './pages/ModelConfigPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { DocsPage } from './pages/DocsPage';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/3d-intelligence" element={<Intelligence3DPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/gps" element={<GpsPage />} />
              <Route path="/road-health" element={<RoadHealthPage />} />
              <Route path="/segments/:id" element={<SegmentDetailPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/authority" element={<AuthorityPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/model-config" element={<ModelConfigPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/docs" element={<DocsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
