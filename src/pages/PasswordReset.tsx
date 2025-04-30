
import { useState } from "react";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import { toast } from "sonner";

interface PasswordResetProps {
  onResetPassword: (email: string) => Promise<void>;
  loading: boolean;
}

const PasswordReset = ({ onResetPassword, loading }: PasswordResetProps) => {
  const [resetLoading, setResetLoading] = useState(false);
  
  const handleResetPassword = async (email: string) => {
    setResetLoading(true);
    try {
      await onResetPassword(email);
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to initiate password reset. Please try again.");
      throw error;
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4">
      <PasswordResetForm 
        onResetPassword={handleResetPassword} 
        loading={resetLoading || loading} 
      />
    </div>
  );
};

export default PasswordReset;
