
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PasswordReset from "./pages/PasswordReset";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import { User, AuthFormValues, UserProfile } from "./types";

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
  const [loading, setLoading] = useState(false);
  
  // These are placeholder handlers that would use Supabase in a complete app
  const handleSignIn = async (values: AuthFormValues): Promise<User> => {
    setLoading(true);
    try {
      // Simulate API call to Supabase Auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a dummy user for demonstration
      const dummyUser = {
        id: "user-1",
        email: values.email,
        username: values.username || "demoUser",
        created_at: new Date().toISOString()
      };
      
      setUser(dummyUser);
      return dummyUser;
    } catch (error) {
      console.error("Sign in error:", error);
      throw new Error("Authentication failed");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (values: AuthFormValues): Promise<User> => {
    setLoading(true);
    try {
      // Simulate API call to Supabase Auth
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Create a dummy user for demonstration
      const dummyUser = {
        id: "user-1",
        email: values.email,
        username: values.username,
        created_at: new Date().toISOString()
      };
      
      setUser(dummyUser);
      return dummyUser;
    } catch (error) {
      console.error("Sign up error:", error);
      throw new Error("Registration failed");
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    setLoading(true);
    try {
      // Simulate API call to Supabase Auth
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
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
      // Simulate API call to Supabase Auth
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log("Password reset requested for:", email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw new Error("Password reset failed");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateProfile = async (profile: UserProfile): Promise<User> => {
    setLoading(true);
    try {
      // Simulate API call to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the user with the new profile info
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
              <Route index element={<Index />} />
            </Route>
            
            <Route path="/auth" element={<MainLayout user={user} loading={loading} requireAuth={false} onLogout={handleLogout} />}>
              <Route index element={<Auth onSignIn={handleSignIn} onSignUp={handleSignUp} loading={loading} />} />
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
