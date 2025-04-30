
import { useState } from "react";
import CreatePostForm from "@/components/posts/CreatePostForm";
import PostList from "@/components/posts/PostList";
import { Post, User } from "@/types";
import { toast } from "sonner";

interface HomeProps {
  user: User;
  posts: Post[];
  fetchPosts: () => Promise<Post[]>;
  loading: boolean;
}

const Home = ({ user, posts, fetchPosts, loading }: HomeProps) => {
  const [createLoading, setCreateLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  
  const handleCreatePost = async (content: string) => {
    setCreateLoading(true);
    try {
      // In a completed app with Supabase, this would create a real post
      console.log("Creating post with content:", content);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      toast.success("Post created");
      await fetchPosts(); // Refetch posts
    } catch (error) {
      console.error("Create post error:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };
  
  const handleLike = async (postId: string) => {
    setLikeLoading(true);
    try {
      // In a completed app with Supabase, this would toggle a like
      console.log("Liking post:", postId);
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      await fetchPosts(); // Refetch posts
    } catch (error) {
      console.error("Like post error:", error);
      toast.error("Failed to like post. Please try again.");
    } finally {
      setLikeLoading(false);
    }
  };
  
  const handleDelete = async (postId: string) => {
    setDeleteLoading(true);
    try {
      // In a completed app with Supabase, this would delete the post
      console.log("Deleting post:", postId);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      toast.success("Post deleted");
      await fetchPosts(); // Refetch posts
    } catch (error) {
      console.error("Delete post error:", error);
      toast.error("Failed to delete post. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };
  
  const handleReply = async (content: string, parentId: string) => {
    setReplyLoading(true);
    try {
      // In a completed app with Supabase, this would create a reply
      console.log("Replying to post:", parentId, "with content:", content);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      toast.success("Reply posted");
      await fetchPosts(); // Refetch posts
    } catch (error) {
      console.error("Reply error:", error);
      toast.error("Failed to post reply. Please try again.");
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-echo-primary">Home</h1>
      <CreatePostForm
        user={user}
        onCreatePost={handleCreatePost}
        loading={createLoading}
      />
      <PostList
        posts={posts}
        currentUser={user}
        onLike={handleLike}
        onDelete={handleDelete}
        onReply={handleReply}
        loading={loading}
        likeLoading={likeLoading}
        deleteLoading={deleteLoading}
        replyLoading={replyLoading}
      />
    </div>
  );
};

export default Home;
