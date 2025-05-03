import { useEffect, useState } from "react";
import { Post, User } from "@/types";
import CreatePostForm from "./CreatePostForm";
import PostItem from "./PostItem";
import { supabase } from "@/integrations/supabase/client";

interface PostRepliesProps {
  parentPost: Post;
  currentUser: User | null;
  onReply: (content: string, parentId: string) => Promise<void>;
  replyLoading: boolean;
  showForm: boolean;
  showReplies: boolean;
}

const PostReplies = ({
  parentPost,
  currentUser,
  onReply,
  replyLoading,
  showForm,
  showReplies,
}: PostRepliesProps) => {
  const [replies, setReplies] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (showReplies) {
      fetchReplies();
    }
  }, [showReplies, parentPost.id]);

  const fetchReplies = async () => {
    try {
      setLoading(true);
      
      const { data: repliesData, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq('parent_id', parentPost.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Format replies to match our Post type and add like counts
      const formattedReplies = await Promise.all(repliesData.map(async (reply) => {
        // Get like count for the reply
        const { count: likesCount, error: likesError } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', reply.id);
          
        // Check if current user has liked this reply
        const { data: userLikes, error: userLikesError } = await supabase
          .from('likes')
          .select('*')
          .eq('post_id', reply.id)
          .eq('user_id', currentUser?.id);
          
        if (likesError || userLikesError) {
          console.error("Error fetching reply details:", { likesError, userLikesError });
        }
        
        return {
          id: reply.id,
          content: reply.content,
          user_id: reply.author_id,
          created_at: reply.created_at,
          parent_id: reply.parent_id,
          user: {
            id: reply.profiles.id,
            username: reply.profiles.username,
            avatar_url: reply.profiles.avatar_url,
            email: '',
            created_at: ''
          },
          likes_count: likesCount || 0,
          has_liked: userLikes && userLikes.length > 0
        };
      }));
      
      setReplies(formattedReplies);
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle replying to a post
  const handleReplyToPost = async (content: string) => {
    await onReply(content, parentPost.id);
    
    // After replying, refresh the replies
    if (showReplies) {
      fetchReplies();
    }
  };
  
  // Handle liking a reply
  const handleLike = async (replyId: string) => {
    if (!currentUser) return;
    
    try {
      // Check if user has already liked this reply
      const { data: existingLikes } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', replyId)
        .eq('user_id', currentUser.id);
      
      if (existingLikes && existingLikes.length > 0) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', replyId)
          .eq('user_id', currentUser.id);
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({
            post_id: replyId,
            user_id: currentUser.id
          });
      }
      
      // Refresh replies to show updated likes
      fetchReplies();
    } catch (error) {
      console.error("Error handling reply like:", error);
    }
  };
  
  // Handle deleting a reply
  const handleDelete = async (replyId: string) => {
    if (!currentUser) return;
    
    try {
      await supabase
        .from('posts')
        .delete()
        .eq('id', replyId)
        .eq('author_id', currentUser.id);
      
      // Refresh replies
      fetchReplies();
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  // Create a proper async function for the onReply prop to match the expected type
  const handleReplyToReply = async (content: string, parentId: string): Promise<void> => {
    // For now, we're not supporting nested replies, but we need to return a Promise<void>
    // to satisfy TypeScript
    return Promise.resolve();
  };

  return (
    <div className="pl-4 border-l border-gray-100 mt-2">
      {showForm && currentUser && (
        <CreatePostForm
          user={currentUser}
          onCreatePost={handleReplyToPost}
          loading={replyLoading}
          parentId={parentPost.id}
          placeholder="Write a reply..."
          isReply
        />
      )}

      {showReplies && (
        <div className="space-y-3 mt-2">
          {loading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : replies.length > 0 ? (
            replies.map((reply) => (
              <PostItem
                key={reply.id}
                post={reply}
                currentUser={currentUser}
                onLike={handleLike}
                onDelete={handleDelete}
                onReply={handleReplyToReply} // Using the new async function that returns a Promise
                likeLoading={false}
                deleteLoading={false}
                replyLoading={false}
                isReply
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No replies yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostReplies;
