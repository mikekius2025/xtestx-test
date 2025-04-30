
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { AuthFormValues } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSignIn = async (values: AuthFormValues) => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Signed in successfully");
      navigate("/");
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setAuthLoading(false);
    }
  };
  
  const handleSignUp = async (values: AuthFormValues) => {
    setAuthLoading(true);
    try {
      // Register user with Supabase
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Account created successfully! Please check your email to verify your account.");
      // Don't redirect immediately as they may need to verify email first
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4">
      <AuthForm 
        onSignIn={handleSignIn} 
        onSignUp={handleSignUp} 
        loading={authLoading} 
      />
    </div>
  );
};

export default Auth;
