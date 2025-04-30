
import { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { AuthFormValues, User } from "@/types";
import { toast } from "sonner";

interface AuthProps {
  onSignIn: (values: AuthFormValues) => Promise<User>;
  onSignUp: (values: AuthFormValues) => Promise<User>;
  loading: boolean;
}

const Auth = ({ onSignIn, onSignUp, loading }: AuthProps) => {
  const [authLoading, setAuthLoading] = useState(false);
  
  const handleSignIn = async (values: AuthFormValues) => {
    setAuthLoading(true);
    try {
      await onSignIn(values);
      toast.success("Signed in successfully");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in. Please check your credentials.");
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };
  
  const handleSignUp = async (values: AuthFormValues) => {
    setAuthLoading(true);
    try {
      await onSignUp(values);
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Failed to create account. Please try again.");
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4">
      <AuthForm 
        onSignIn={handleSignIn} 
        onSignUp={handleSignUp} 
        loading={authLoading || loading} 
      />
    </div>
  );
};

export default Auth;
