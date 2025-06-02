
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReportStatus } from "@/types/report";
import ReportManagementCard from "./ReportManagementCard";

interface Report {
  id: string;
  title: string;
  category: string;
  location: string;
  status: string;
  created_at: string;
  description: string;
  user_id: string;
  image_url?: string;
}

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch reports
  const {
    data: reports = [],
    isLoading: isLoadingReports,
    error: reportsError
  } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      console.log("Fetching reports for admin dashboard...");
      
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching reports:", error);
        throw error;
      }
      
      console.log("Fetched reports:", data);
      return data || [];
    }
  });

  // Fetch user profiles to get names
  const {
    data: profiles = [],
    isLoading: isLoadingProfiles
  } = useQuery({
    queryKey: ["user-profiles"],
    queryFn: async () => {
      console.log("Fetching user profiles...");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name");
      
      if (error) {
        console.error("Error fetching profiles:", error);
        return [];
      }
      
      console.log("Fetched profiles:", data);
      return data || [];
    }
  });

  // Get user name by ID
  const getUserName = (userId: string) => {
    const profile = profiles.find(p => p.id === userId);
    return profile?.name || "Usuário não identificado";
  };

  // Update report status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ reportId, newStatus }: { reportId: string; newStatus: ReportStatus }) => {
      console.log("Updating report status:", { reportId, newStatus });
      
      const { data, error } = await supabase
        .from("reports")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", reportId)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating report status:", error);
        throw error;
      }
      
      console.log("Updated report:", data);
      return data;
    },
    onSuccess: (updatedReport) => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      toast({
        title: "Status atualizado",
        description: `Denúncia foi marcada como ${getStatusLabel(updatedReport.status)}`
      });
    },
    onError: (error) => {
      console.error("Failed to update status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da denúncia",
        variant: "destructive"
      });
    }
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in-progress': return 'Em Análise';
      case 'resolved': return 'Resolvido';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  const getStatusStats = () => {
    const stats = {
      pending: reports.filter(r => r.status === 'pending').length,
      'in-progress': reports.filter(r => r.status === 'in-progress').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
      rejected: reports.filter(r => r.status === 'rejected').length,
      total: reports.length
    };
    return stats;
  };

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    await updateStatusMutation.mutateAsync({ reportId, newStatus });
  };

  const handleViewDetails = (reportId: string) => {
    window.open(`/report/${reportId}`, '_blank');
  };

  // Filter reports based on search and status
  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchTerm || 
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoadingReports || isLoadingProfiles) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (reportsError) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Erro ao carregar denúncias: {reportsError.message}</p>
      </div>
    );
  }

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Em Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats['in-progress']}</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolvidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.resolved}</div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 flex items-center">
              <XCircle className="h-4 w-4 mr-2" />
              Rejeitadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por título, descrição ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge 
                variant={statusFilter === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("all")}
              >
                Todas ({stats.total})
              </Badge>
              <Badge 
                variant={statusFilter === "pending" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("pending")}
              >
                Pendentes ({stats.pending})
              </Badge>
              <Badge 
                variant={statusFilter === "in-progress" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("in-progress")}
              >
                Em Análise ({stats['in-progress']})
              </Badge>
              <Badge 
                variant={statusFilter === "resolved" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("resolved")}
              >
                Resolvidas ({stats.resolved})
              </Badge>
              <Badge 
                variant={statusFilter === "rejected" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("rejected")}
              >
                Rejeitadas ({stats.rejected})
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" 
                ? "Nenhuma denúncia encontrada com os filtros aplicados." 
                : "Nenhuma denúncia encontrada."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <ReportManagementCard
              key={report.id}
              report={report}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              userName={getUserName(report.user_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
