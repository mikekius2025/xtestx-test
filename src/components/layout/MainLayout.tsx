
import { Outlet, Navigate } from "react-router-dom";
import Header from "./Header";
import { User } from "@/types";
import { useState, useEffect } from "react";

interface MainLayoutProps {
  user: User | null;
  loading: boolean;
  requireAuth?: boolean;
  onLogout: () => Promise<void>;
}

const MainLayout = ({ user, loading, requireAuth = true, onLogout }: MainLayoutProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything during the initial server render
  // This prevents any layout shifts or flash of unauthenticated content
  if (!isClient) {
    return null;
  }

  // If auth is required and user isn't logged in, redirect to auth page
  if (requireAuth && !loading && !user) {
    return <Navigate to="/auth" replace />;
  }
  
  // If auth is NOT required and user is logged in, redirect to home
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-1 container mx-auto px-4 sm:px-6 md:px-8 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-echo-primary"></div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default MainLayout;
