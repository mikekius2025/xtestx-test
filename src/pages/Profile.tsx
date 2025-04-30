
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserProfile } from "@/types";
import { toast } from "sonner";

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
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Failed to update profile. Please try again.");
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
                className="resize-none h-24"
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
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
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
