
import { useState, useEffect } from "react";
import PostItem from "./PostItem";
import { Post, User } from "@/types";

interface PostListProps {
  posts: Post[];
  currentUser: User | null;
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
  onReply: (content: string, parentId: string) => Promise<void>;
  loading: boolean;
  likeLoading: boolean;
  deleteLoading: boolean;
  replyLoading: boolean;
}

const PostList = ({
  posts,
  currentUser,
  onLike,
  onDelete,
  onReply,
  loading,
  likeLoading,
  deleteLoading,
  replyLoading,
}: PostListProps) => {
  const [animate, setAnimate] = useState(false);

  // Trigger animation when posts are loaded or updated
  useEffect(() => {
    if (!loading && posts.length > 0) {
      setAnimate(true);
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [posts, loading]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 p-4 rounded-md shadow-sm animate-pulse"
          >
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 w-24 mb-2 bg-gray-200 rounded"></div>
                <div className="h-3 w-full mb-1 bg-gray-100 rounded"></div>
                <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!loading && posts.length === 0) {
    return (
      <div className="p-8 text-center border border-gray-200 rounded-md bg-gray-50">
        <h3 className="font-medium text-gray-600 mb-1">No posts yet</h3>
        <p className="text-gray-500">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${animate ? "animate-fade-in" : ""}`}>
      {posts
        .filter(post => !post.parent_id) // Only show main posts, not replies
        .map((post) => (
          <PostItem
            key={post.id}
            post={post}
            currentUser={currentUser}
            onLike={onLike}
            onDelete={onDelete}
            onReply={onReply}
            likeLoading={likeLoading}
            deleteLoading={deleteLoading}
            replyLoading={replyLoading}
          />
        ))}
    </div>
  );
};

export default PostList;
