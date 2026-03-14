import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { LanguageProvider } from './components/i18n/LanguageContext';
import { LocationProvider } from './components/i18n/LocationContext';

// Pages
import Welcome from './pages/Welcome';
import Explore from './pages/Explore';
import JobDetails from './pages/JobDetails';
import Apply from './pages/Apply';
import Saved from './pages/Saved';
import PostJob from './pages/PostJob';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Layout
import AppLayout from './components/shared/AppLayout';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Welcome" replace />} />
      <Route path="/Welcome" element={<Welcome />} />
      
      <Route element={<AppLayout />}>
        <Route path="/Explore" element={<Explore />} />
        <Route path="/Saved" element={<Saved />} />
        <Route path="/PostJob" element={<PostJob />} />
        <Route path="/Messages" element={<Messages />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Settings" element={<Settings />} />
      </Route>
      
      <Route path="/JobDetails" element={<JobDetails />} />
      <Route path="/Apply" element={<Apply />} />
      <Route path="/Chat" element={<Chat />} />
      
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <LanguageProvider>
          <LocationProvider>
            <Router>
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </LocationProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
