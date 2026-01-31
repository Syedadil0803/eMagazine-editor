import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@demo/store';
import FlipbookEditor from './pages/FlipbookEditor';
import FlipbookView from './pages/FlipbookView';
import ApprovalReview from './pages/ApprovalReview';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ContentPage from './pages/Content';
import ApprovalsPage from './pages/Approvals';
import CreateMagazine from './pages/CreateMagazine';
import PreviewPage from './pages/Preview';
import AdminSettings from './pages/Dashboard/AdminSettings';
import { isAuthenticated } from '@demo/services/auth';
import '@arco-design/web-react/dist/css/arco.css';

function App() {
  return (
    <Provider store={store}>
      <Suspense
        fallback={
          <div
            style={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p style={{ fontSize: 24, color: 'rgba(0, 0, 0, 0.65)' }}>
              Please wait a moment...
            </p>
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
          <Route path="/create-magazine" element={<CreateMagazine />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/flipbook-view" element={<FlipbookView />} />
          <Route path="/approval-review" element={<ApprovalReview />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
          <Route path="/editor" element={<FlipbookEditor />} />
        </Routes>
      </Suspense>
    </Provider>
  );
}

export default App;
