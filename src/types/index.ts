
export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at?: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: User;
  likes_count?: number;
  replies_count?: number;
  has_liked?: boolean;
  parent_id?: string | null;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface AuthFormValues {
  email: string;
  password: string;
  username?: string;
}

export interface UserProfile {
  username?: string;
  avatar_url?: string;
  bio?: string;
}
