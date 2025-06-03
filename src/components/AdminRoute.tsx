
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading: authLoading } = useAuth();

  const { data: isAdmin, isLoading: adminLoading } = useQuery({
    queryKey: ["admin-route-check", user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      console.log("AdminRoute: Checking admin status for user:", user.email);
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      
      if (error) {
        console.error("AdminRoute: Error checking admin status:", error);
        return false;
      }
      
      console.log("AdminRoute: Admin check result:", !!data);
      return !!data;
    },
    enabled: !!user && !authLoading,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1
  });

  if (authLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log("AdminRoute: No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    console.log("AdminRoute: User is not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
