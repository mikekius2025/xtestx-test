
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, MessageSquare, Trash } from "lucide-react";
import { Post, User } from "@/types";
import { formatDistanceToNow } from "date-fns";
import PostReplies from "./PostReplies";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PostItemProps {
  post: Post;
  currentUser: User | null;
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
  onReply: (content: string, parentId: string) => Promise<void>;
  likeLoading: boolean;
  deleteLoading: boolean;
  replyLoading: boolean;
  showReplies?: boolean;
  isReply?: boolean;
}

const PostItem = ({
  post,
  currentUser,
  onLike,
  onDelete,
  onReply,
  likeLoading,
  deleteLoading,
  replyLoading,
  showReplies = false,
  isReply = false,
}: PostItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(showReplies);
  const isAuthor = currentUser?.id === post.user_id;
  
  const formattedDate = post.created_at
    ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
    : "";

  const userInitials = post.user?.username
    ? post.user.username.substring(0, 2).toUpperCase()
    : "EC";
    
  const handleLike = async () => {
    if (currentUser) {
      await onLike(post.id);
    }
  };

  const handleDelete = async () => {
    await onDelete(post.id);
  };

  const toggleReplies = () => {
    setIsRepliesOpen(!isRepliesOpen);
  };

  return (
    <Card className={`w-full mb-4 ${isReply ? 'border-0 shadow-none' : 'border border-gray-200 shadow-sm'}`}>
      <CardContent className={`${isReply ? 'px-0 pt-2 pb-0' : 'p-4'}`}>
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={post.user?.avatar_url || undefined}
              alt={post.user?.username || "User"}
            />
            <AvatarFallback className="bg-echo-accent text-echo-primary">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{post.user?.username || "User"}</h3>
              <span className="text-sm text-gray-500">·</span>
              <span className="text-sm text-gray-500">{formattedDate}</span>
            </div>
            <div className="mt-1 text-gray-800 whitespace-pre-wrap break-words">
              {post.content}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className={`${isReply ? 'px-0 pt-2 pb-0' : 'px-4 py-2'} flex justify-between`}>
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 p-1 h-auto text-gray-600 hover:text-echo-primary hover:bg-transparent"
            onClick={() => setShowReplyForm(!showReplyForm)}
            disabled={!currentUser}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">{post.replies_count || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 p-1 h-auto ${
              post.has_liked
                ? "text-red-500 hover:text-red-600"
                : "text-gray-600 hover:text-red-500"
            } hover:bg-transparent`}
            onClick={handleLike}
            disabled={!currentUser || likeLoading}
          >
            <Heart className={`h-4 w-4 ${post.has_liked ? "fill-current" : ""}`} />
            <span className="text-sm">{post.likes_count || 0}</span>
          </Button>
        </div>
        {isAuthor && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-red-500 hover:bg-transparent p-1 h-auto"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this post? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
      
      {/* Reply form */}
      {showReplyForm && currentUser && (
        <div className="px-4 py-2">
          <PostReplies
            parentPost={post}
            currentUser={currentUser}
            onReply={onReply}
            replyLoading={replyLoading}
            showForm={true}
            showReplies={false}
          />
        </div>
      )}
      
      {/* Replies */}
      {(post.replies_count && post.replies_count > 0) ? (
        <div className="px-4 pt-0 pb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleReplies}
            className="text-echo-primary hover:text-echo-secondary hover:bg-transparent px-0 py-1 h-auto"
          >
            {isRepliesOpen ? "Hide replies" : `Show ${post.replies_count} ${post.replies_count === 1 ? "reply" : "replies"}`}
          </Button>
          
          {isRepliesOpen && currentUser && (
            <PostReplies
              parentPost={post}
              currentUser={currentUser}
              onReply={onReply}
              replyLoading={replyLoading}
              showForm={false}
              showReplies={true}
            />
          )}
        </div>
      ) : null}
    </Card>
  );
};

export default PostItem;
