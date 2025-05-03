
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Post, User } from "@/types";
import Home from "./Home";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface IndexProps {
  user?: User | null;
  posts?: Post[];
}

const Index = ({ user: propUser, posts: propPosts }: IndexProps) => {
  const [user, setUser] = useState<User | null>(propUser || null);
  const [posts, setPosts] = useState<Post[]>(propPosts || []);
  const [loading, setLoading] = useState(!propUser);
  const navigate = useNavigate();

  // Update user state when prop changes
  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      setLoading(false);
    }
  }, [propUser]);

  // Update posts state when prop changes
  useEffect(() => {
    if (propPosts) {
      setPosts(propPosts);
    }
  }, [propPosts]);

  // Fetch posts from Supabase when user is logged in
  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  // Fetch posts from Supabase
  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Get posts with author details and like counts
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            id,
            username,
            avatar_url
          )
        `)
        .is('parent_id', null)  // Only get main posts, not replies
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // For each post, get the like count
      const postsWithCounts = await Promise.all(postsData.map(async (post) => {
        // Get like count
        const { count: likesCount, error: likesError } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);
        
        // Get reply count
        const { count: repliesCount, error: repliesError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('parent_id', post.id);
        
        // Check if current user has liked this post
        const { data: userLikes, error: userLikesError } = await supabase
          .from('likes')
          .select('*')
          .eq('post_id', post.id)
          .eq('user_id', user?.id);
        
        const hasLiked = userLikes && userLikes.length > 0;
        
        if (likesError || repliesError || userLikesError) {
          console.error("Error getting post details:", { likesError, repliesError, userLikesError });
        }
        
        // Format the post to match our Post type
        return {
          id: post.id,
          content: post.content,
          user_id: post.author_id,
          created_at: post.created_at,
          parent_id: post.parent_id,
          user: {
            id: post.profiles.id,
            username: post.profiles.username,
            avatar_url: post.profiles.avatar_url,
            email: '',  // Email isn't included in profiles for privacy
            created_at: ''  // We don't need created_at for display
          },
          likes_count: likesCount || 0,
          replies_count: repliesCount || 0,
          has_liked: hasLiked
        };
      }));
      
      setPosts(postsWithCounts);
      
    } catch (error) {
      console.error("Fetch posts error:", error);
      toast.error("Failed to load posts. Please try again.");
      return [];
    } finally {
      setLoading(false);
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
