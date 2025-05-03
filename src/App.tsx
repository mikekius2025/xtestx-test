
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
import { toast } from "sonner";

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
          fetchUserProfile(newSession.user.id);
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
        fetchUserProfile(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const userData: User = {
          id: userId,
          email: session?.user?.email || '',
          username: data.username || session?.user?.user_metadata.username || '',
          avatar_url: data.avatar_url || '',
          bio: data.bio || '',
          created_at: session?.user?.created_at || '',
          updated_at: data.updated_at
        };
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setSession(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
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
      if (!user || !session) {
        throw new Error("Not authenticated");
      }
      
      // Update profile in Supabase profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Also update username in auth metadata if it changed
      if (profile.username !== user.username) {
        const { error } = await supabase.auth.updateUser({
          data: { username: profile.username }
        });
        
        if (error) {
          throw error;
        }
      }
      
      // Update the user state with the new profile info
      const updatedUser = {
        ...user,
        ...profile,
        updated_at: new Date().toISOString()
      };
      
      setUser(updatedUser);
      toast.success("Profile updated successfully");
      return updatedUser;
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error("Profile update failed: " + (error.message || "Please try again"));
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
