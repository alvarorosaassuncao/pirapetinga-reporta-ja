
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is admin
  const {
    data: isAdmin,
    isLoading: isLoadingAdmin,
    error: adminError
  } = useQuery({
    queryKey: ["admin-check", user?.id],
    queryFn: async () => {
      if (!user) {
        console.log("No user found for admin check");
        return false;
      }
      
      try {
        console.log("Checking admin status for user:", user.email);
        
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();
        
        if (error) {
          console.error("Error checking admin status:", error);
          throw error;
        }
        
        const hasAdminRole = !!data;
        console.log("Admin check result:", { hasAdminRole, data });
        
        return hasAdminRole;
      } catch (error) {
        console.error("Error in admin check query:", error);
        throw error;
      }
    },
    enabled: !!user,
    retry: 3,
    retryDelay: 1000
  });

  // Redirect non-admin users
  useEffect(() => {
    if (!isLoadingAdmin) {
      if (!user) {
        console.log("No user, redirecting to login");
        navigate("/login");
        return;
      }
      
      if (isAdmin === false) {
        console.log("User is not admin, redirecting");
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta página",
          variant: "destructive"
        });
        navigate("/");
        return;
      }
      
      if (adminError) {
        console.error("Admin check error:", adminError);
        toast({
          title: "Erro",
          description: "Erro ao verificar permissões de administrador",
          variant: "destructive"
        });
        navigate("/");
        return;
      }
    }
  }, [user, isAdmin, isLoadingAdmin, adminError, navigate, toast]);

  // Show loading while checking admin status
  if (isLoadingAdmin || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Don't render admin panel if user is not admin
  if (isAdmin !== true) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Gestão de Denúncias
          </h1>
          <p className="text-gray-600">
            Analise, aprove ou rejeite as denúncias reportadas pelos cidadãos.
          </p>
        </div>
        
        <AdminDashboard />
      </div>
    </AdminLayout>
  );
};

export default Admin;
