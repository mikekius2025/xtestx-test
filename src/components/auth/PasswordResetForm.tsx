
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface PasswordResetFormProps {
  onResetPassword: (email: string) => Promise<void>;
  loading: boolean;
}

const PasswordResetForm = ({ onResetPassword, loading }: PasswordResetFormProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onResetPassword(email);
      setSubmitted(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send reset instructions. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-echo-primary">Reset Password</CardTitle>
        <CardDescription className="text-center">
          {!submitted 
            ? "Enter your email to receive password reset instructions" 
            : "Check your email for reset instructions"}
        </CardDescription>
      </CardHeader>
      
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-echo-primary hover:bg-echo-secondary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Send Reset Instructions"}
            </Button>
            <Link to="/auth" className="text-sm text-center text-echo-primary hover:underline">
              Back to sign in
            </Link>
          </CardFooter>
        </form>
      ) : (
        <CardContent className="space-y-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md text-center">
            <p className="text-green-800">
              If an account exists with this email, you'll receive reset instructions shortly.
            </p>
          </div>
          <div className="text-center">
            <Link to="/auth" className="text-echo-primary hover:underline">
              Return to sign in
            </Link>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default PasswordResetForm;
