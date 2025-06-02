
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import ReportManagementCard from "./ReportManagementCard";
import { ReportStatus } from "@/types/report";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch all reports with user profiles
  const { 
    data: reports, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["admin-reports-dashboard"],
    queryFn: async () => {
      console.log("Fetching reports with user profiles for admin dashboard");
      
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          profiles!reports_user_id_fkey (
            name
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching reports:", error);
        throw error;
      }
      
      console.log("Reports with profiles fetched:", data?.length);
      return data || [];
    },
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
        description: `A denúncia foi marcada como ${getStatusLabel(newStatus)}.`,
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in-progress': return 'Em Análise';
      case 'resolved': return 'Resolvida';
      case 'rejected': return 'Rejeitada';
      default: return status;
    }
  };

  const filterReports = (status?: string) => {
    if (!reports) return [];
    
    let filtered = [...reports];
    
    // Filter by status
    if (status && status !== "all") {
      filtered = filtered.filter(report => report.status === status);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(report => 
        report.title?.toLowerCase().includes(term) || 
        report.description?.toLowerCase().includes(term) ||
        report.location?.toLowerCase().includes(term) ||
        report.category?.toLowerCase().includes(term) ||
        report.profiles?.name?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  const getReportCounts = () => {
    if (!reports) return { pending: 0, inProgress: 0, resolved: 0, rejected: 0 };
    
    return {
      pending: reports.filter(r => r.status === 'pending').length,
      inProgress: reports.filter(r => r.status === 'in-progress').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
      rejected: reports.filter(r => r.status === 'rejected').length,
    };
  };

  const handleViewDetails = (reportId: string) => {
    window.open(`/report/${reportId}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando denúncias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Erro ao carregar denúncias</h2>
        <p className="text-gray-600 mb-4">Ocorreu um erro ao tentar carregar as denúncias.</p>
        <button 
          onClick={() => refetch()} 
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const counts = getReportCounts();
  const filteredReports = filterReports(activeTab);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{counts.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{counts.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{counts.resolved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{counts.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar denúncias..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs for Status Filtering */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="pending" className="relative">
            Pendentes
            {counts.pending > 0 && (
              <Badge className="ml-2 bg-yellow-600 text-white text-xs">{counts.pending}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="relative">
            Em Análise
            {counts.inProgress > 0 && (
              <Badge className="ml-2 bg-blue-600 text-white text-xs">{counts.inProgress}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="resolved" className="relative">
            Resolvidas
            {counts.resolved > 0 && (
              <Badge className="ml-2 bg-green-600 text-white text-xs">{counts.resolved}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="relative">
            Rejeitadas
            {counts.rejected > 0 && (
              <Badge className="ml-2 bg-red-600 text-white text-xs">{counts.rejected}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma denúncia encontrada
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? "Tente ajustar sua busca ou filtros." 
                  : `Não há denúncias ${getStatusLabel(activeTab).toLowerCase()} no momento.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredReports.map((report) => (
                <ReportManagementCard
                  key={report.id}
                  report={report}
                  onStatusChange={updateReportStatus}
                  onViewDetails={handleViewDetails}
                  userName={report.profiles?.name}
                />
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
