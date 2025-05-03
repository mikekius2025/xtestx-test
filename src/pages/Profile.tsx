
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserProfile } from "@/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProfileProps {
  user: User;
  onUpdateProfile: (profile: UserProfile) => Promise<User>;
  loading: boolean;
}

const Profile = ({ user, onUpdateProfile, loading }: ProfileProps) => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: user.username || "",
    avatar_url: user.avatar_url || "",
    bio: user.bio || "",
  });

  const userInitials = user.username ? user.username.substring(0, 2).toUpperCase() : "EC";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.username?.trim()) {
      toast.error("Username is required");
      return;
    }
    
    setUpdateLoading(true);
    try {
      await onUpdateProfile(profile);
    } catch (error) {
      console.error("Update profile error:", error);
      // Error is already handled in onUpdateProfile
    } finally {
      setUpdateLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-echo-primary">My Profile</h1>
      
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.username || "User"} />
                <AvatarFallback className="bg-echo-accent text-echo-primary text-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 w-full">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={profile.avatar_url || ""}
                  onChange={handleChange}
                  className="mt-1"
                  disabled={updateLoading || loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a URL to an image for your profile picture
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="cooluser123"
                value={profile.username || ""}
                onChange={handleChange}
                required
                disabled={updateLoading || loading}
                className="focus:border-echo-primary"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself..."
                value={profile.bio || ""}
                onChange={handleChange}
                className="resize-none h-24 focus:border-echo-primary"
                disabled={updateLoading || loading}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-echo-primary hover:bg-echo-secondary"
                disabled={updateLoading || loading}
              >
                {updateLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : "Save Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
