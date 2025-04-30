
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PasswordReset from "./pages/PasswordReset";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import { User, UserProfile } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          const userData: User = {
            id: newSession.user.id,
            email: newSession.user.email || '',
            username: newSession.user.user_metadata.username || '',
            created_at: newSession.user.created_at
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        const userData: User = {
          id: currentSession.user.id,
          email: currentSession.user.email || '',
          username: currentSession.user.user_metadata.username || '',
          created_at: currentSession.user.created_at
        };
        setUser(userData);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed");
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Password reset requested for:", email);
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw new Error(error.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateProfile = async (profile: UserProfile): Promise<User> => {
    setLoading(true);
    try {
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: profile
      });
      
      if (error) {
        throw error;
      }
      
      // Get updated user data
      const { data } = await supabase.auth.getUser();
      
      if (!data.user) {
        throw new Error("Failed to update profile");
      }
      
      // Update the user state with the new profile info
      const updatedUser = {
        ...user!,
        ...profile,
        updated_at: new Date().toISOString()
      };
      
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Update profile error:", error);
      throw new Error("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout user={user} loading={loading} requireAuth={false} onLogout={handleLogout} />}>
              <Route index element={<Index user={user} posts={posts} />} />
            </Route>
            
            <Route path="/auth" element={<MainLayout user={user} loading={loading} requireAuth={false} onLogout={handleLogout} />}>
              <Route index element={
                user ? <Navigate to="/" replace /> : <Auth />
              } />
            </Route>
            
            <Route path="/reset-password" element={<MainLayout user={user} loading={loading} requireAuth={false} onLogout={handleLogout} />}>
              <Route index element={<PasswordReset onResetPassword={handleResetPassword} loading={loading} />} />
            </Route>
            
            <Route path="/profile" element={<MainLayout user={user} loading={loading} requireAuth={true} onLogout={handleLogout} />}>
              <Route index element={user ? <Profile user={user} onUpdateProfile={handleUpdateProfile} loading={loading} /> : null} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
