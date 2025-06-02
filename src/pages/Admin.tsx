
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminTable from "@/components/AdminTable";
import AdminFilters from "@/components/AdminFilters";
import { ReportStatus } from "@/types/report";

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  // Check if user is admin with better error handling
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
    if (!isLoadingAdmin && !isCheckingAdmin) {
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
  }, [user, isAdmin, isLoadingAdmin, adminError, navigate, toast, isCheckingAdmin]);

  // Set checking admin to false after initial load
  useEffect(() => {
    if (!isLoadingAdmin) {
      setIsCheckingAdmin(false);
    }
  }, [isLoadingAdmin]);

  // Fetch all reports with better error handling
  const { 
    data: reports, 
    isLoading: isLoadingReports, 
    error: reportsError, 
    refetch 
  } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      console.log("Fetching reports for admin panel");
      
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching reports:", error);
        throw error;
      }
      
      console.log("Reports fetched successfully:", data?.length);
      return data || [];
    },
    enabled: !!user && isAdmin === true,
    retry: 3,
    retryDelay: 1000
  });

  const updateReportStatus = async (reportId: string, newStatus: ReportStatus) => {
    try {
      console.log("Updating report status:", { reportId, newStatus });
      
      const { error } = await supabase
        .from("reports")
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", reportId);
      
      if (error) {
        console.error("Error updating report status:", error);
        throw error;
      }
      
      toast({
        title: "Status atualizado",
        description: "O status da denúncia foi atualizado com sucesso."
      });
      
      refetch();
    } catch (error: any) {
      console.error("Error updating report status:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar status da denúncia",
        variant: "destructive"
      });
    }
  };

  // Show loading while checking admin status
  if (isLoadingAdmin || isCheckingAdmin || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-10 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando permissões...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Don't render admin panel if user is not admin
  if (isAdmin !== true) {
    return null;
  }

  if (reportsError) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-10 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Erro ao carregar denúncias</h2>
            <p className="text-gray-600 mb-4">Ocorreu um erro ao tentar carregar as denúncias.</p>
            <button 
              onClick={() => refetch()} 
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-700"
            >
              Tentar novamente
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Painel do Administrador</h1>
            <p className="mt-2 text-gray-600">
              Gerencie todas as denúncias reportadas pelos cidadãos.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <AdminFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            
            <AdminTable
              reports={reports || []}
              isLoading={isLoadingReports}
              activeTab={activeTab}
              searchTerm={searchTerm}
              updateReportStatus={updateReportStatus}
              refetch={refetch}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
