
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface CreatePostFormProps {
  user: User;
  onCreatePost: (content: string, parentId?: string) => Promise<void>;
  loading: boolean;
  parentId?: string;
  placeholder?: string;
  isReply?: boolean;
}

const CreatePostForm = ({ 
  user, 
  onCreatePost, 
  loading, 
  parentId,
  placeholder = "What's happening?",
  isReply = false
}: CreatePostFormProps) => {
  const [content, setContent] = useState("");
  const maxLength = 280; // Twitter-like character limit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Post cannot be empty");
      return;
    }
    
    if (content.length > maxLength) {
      toast.error(`Post is too long. Maximum ${maxLength} characters allowed.`);
      return;
    }
    
    try {
      await onCreatePost(content, parentId);
      setContent("");
    } catch (error) {
      console.error("Create post error:", error);
    }
  };

  const userInitials = user.username ? user.username.substring(0, 2).toUpperCase() : "EC";
  
  return (
    <Card className={`w-full mb-6 border ${isReply ? 'border-gray-100' : 'border-gray-200'} shadow-sm`}>
      <CardContent className={`${isReply ? 'p-3' : 'p-4'}`}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url || undefined} alt={user.username || "User"} />
              <AvatarFallback className="bg-echo-accent text-echo-primary">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={placeholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="resize-none border-gray-200 focus:border-echo-primary min-h-[80px]"
                maxLength={maxLength}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className={`text-sm ${content.length > maxLength ? 'text-red-500' : 'text-gray-500'}`}>
              {content.length}/{maxLength}
            </div>
            <Button 
              type="submit" 
              className="bg-echo-primary hover:bg-echo-secondary"
              disabled={loading || content.length === 0 || content.length > maxLength}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </span>
              ) : isReply ? "Reply" : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
