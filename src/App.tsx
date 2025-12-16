import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { UserProvider } from "@/contexts/UserContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Install from "./pages/Install";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminLibrary from "./pages/AdminLibrary";
import AdminLogs from "./pages/AdminLogs";
import AdminFeedback from "./pages/AdminFeedback";
import SpotifyBrowser from "./pages/SpotifyBrowser";
import SpotifyPlaylistPage from "./pages/SpotifyPlaylist";
import SpotifySearchPage from "./pages/SpotifySearch";
import SpotifyLibraryPage from "./pages/SpotifyLibrary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              <Route path="/install" element={<Install />} />
              <Route path="/settings" element={
                <ProtectedRoute requiredPermission="canAccessSettings">
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Dashboard Route */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiredPermission="canAccessSettings"><Dashboard /></ProtectedRoute>
              } />
              
              {/* Spotify Routes */}
              <Route path="/spotify" element={<SpotifyBrowser />} />
              <Route path="/spotify/playlist/:id" element={<SpotifyPlaylistPage />} />
              <Route path="/spotify/search" element={<SpotifySearchPage />} />
              <Route path="/spotify/library" element={<SpotifyLibraryPage />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredPermission="canAccessSettings"><Admin /></ProtectedRoute>
              } />
              <Route path="/admin/library" element={
                <ProtectedRoute requiredPermission="canAccessSettings"><AdminLibrary /></ProtectedRoute>
              } />
              <Route path="/admin/logs" element={
                <ProtectedRoute requiredPermission="canAccessSettings"><AdminLogs /></ProtectedRoute>
              } />
              <Route path="/admin/feedback" element={
                <ProtectedRoute requiredPermission="canAccessSettings"><AdminFeedback /></ProtectedRoute>
              } />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
