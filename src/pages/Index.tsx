
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Post, User, AuthFormValues, UserProfile } from "@/types";
import Home from "./Home";
import { supabaseClient } from "@/lib/supabase";
import { toast } from "sonner";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app with Supabase, we would use this to check for an existing session
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        // Simulate loading the user session
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // No user session for now - in a complete app, this would check Supabase Auth
        setUser(null);
        
        // Load some dummy posts
        await fetchPosts();
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // For demo purposes - simulates getting posts
  const fetchPosts = async () => {
    try {
      // Simulate API call to Supabase
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Dummy posts data - in a real app this would come from Supabase
      const dummyUser = {
        id: "user-1",
        email: "demo@example.com",
        username: "echoDemoUser",
        created_at: new Date().toISOString()
      };
      
      const dummyPosts = [
        {
          id: "post-1",
          user_id: "user-1",
          content: "Welcome to Echo! This is a Twitter-like social media app built with React and ready for Supabase integration.",
          created_at: new Date().toISOString(),
          user: dummyUser,
          likes_count: 5,
          replies_count: 2,
          has_liked: false
        },
        {
          id: "post-2",
          user_id: "user-1",
          content: "To get started with Echo, connect the app to Supabase using the native integration. This will enable authentication, database access, and real-time features.",
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          user: dummyUser,
          likes_count: 3,
          replies_count: 1,
          has_liked: true
        },
        {
          id: "post-3",
          user_id: "user-1",
          content: "Echo supports all core social media features: user authentication, posting, liking, and replying. The UI is fully responsive and built with Tailwind CSS.",
          created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          user: dummyUser,
          likes_count: 7,
          replies_count: 3,
          has_liked: false
        }
      ];
      
      setPosts(dummyPosts);
      return dummyPosts;
    } catch (error) {
      console.error("Fetch posts error:", error);
      toast.error("Failed to load posts. Please try again.");
      return [];
    }
  };
  
  // Auth handlers - would interact with Supabase in a complete app
  const handleSignIn = async (values: AuthFormValues): Promise<User> => {
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
    }
  };
  
  const handleSignUp = async (values: AuthFormValues): Promise<User> => {
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
    }
  };
  
  const handleLogout = async () => {
    try {
      // Simulate API call to Supabase Auth
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed");
    }
  };
  
  const handleResetPassword = async (email: string) => {
    try {
      // Simulate API call to Supabase Auth
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log("Password reset requested for:", email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw new Error("Password reset failed");
    }
  };
  
  const handleUpdateProfile = async (profile: UserProfile): Promise<User> => {
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
    }
  };

  // This component now serves as a router handler that passes props to the appropriate views
  // In a real app with Supabase, this would have real auth state and API calls
  
  // When not logged in, show a landing page
  if (!user && !loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-echo-primary rounded-full flex items-center justify-center mb-6">
          <span className="text-white text-3xl font-bold">E</span>
        </div>
        <h1 className="text-4xl font-bold text-echo-primary mb-4">Welcome to Echo</h1>
        <p className="text-xl text-gray-700 max-w-2xl mb-8">
          Join the conversation and connect with others through short posts, likes, and replies.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-echo-primary hover:bg-echo-secondary">
            <Link to="/auth">Get Started</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-echo-primary text-echo-primary hover:bg-echo-light"
            onClick={async () => {
              try {
                // Demo login for easy testing
                await handleSignIn({ 
                  email: "demo@example.com", 
                  password: "password123",
                  username: "demoUser" 
                });
                toast.success("Signed in with demo account");
              } catch (error) {
                toast.error("Demo login failed");
              }
            }}
          >
            Try Demo
          </Button>
        </div>
        <p className="mt-8 text-sm text-gray-500">
          This app requires Supabase for full functionality.
        </p>
      </div>
    );
  }

  // When logged in, show the home feed
  if (user) {
    return (
      <Home 
        user={user} 
        posts={posts} 
        fetchPosts={fetchPosts} 
        loading={loading} 
      />
    );
  }

  // Loading state
  return (
    <div className="min-h-[60vh] flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-echo-primary"></div>
    </div>
  );
};

export default Index;
