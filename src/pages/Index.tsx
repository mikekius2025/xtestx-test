
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Post, User } from "@/types";
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
        
        // Load empty posts array since demo is removed
        setPosts([]);
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Empty fetch posts function - will be implemented with Supabase
  const fetchPosts = async () => {
    try {
      // Will be replaced with actual Supabase query
      return [];
    } catch (error) {
      console.error("Fetch posts error:", error);
      toast.error("Failed to load posts. Please try again.");
      return [];
    }
  };

  // When not logged in, show a landing page
  if (!user && !loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-echo-primary rounded-full flex items-center justify-center mb-6">
          <span className="text-white text-3xl font-bold">F</span>
        </div>
        <h1 className="text-4xl font-bold text-echo-primary mb-4">Welcome to FederalPH</h1>
        <p className="text-xl text-gray-700 max-w-2xl mb-8">
          Join the conversation and connect with others through short posts, likes, and replies.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-echo-primary hover:bg-echo-secondary">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
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
