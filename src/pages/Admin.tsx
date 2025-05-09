
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();
      
      if (error && error.code !== "PGRST116") {
        toast({
          title: "Erro",
          description: "Não foi possível verificar suas permissões",
          variant: "destructive"
        });
        navigate("/");
        return;
      }
      
      if (data) {
        setIsAdmin(true);
      } else {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta página",
          variant: "destructive"
        });
        navigate("/");
      }
    };
    
    checkAdminStatus();
  }, [user, navigate, toast]);

  // Fetch all reports
  const { 
    data: reports, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      if (!user || !isAdmin) return [];
      
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        toast({
          title: "Erro ao carregar denúncias",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user && isAdmin
  });

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", reportId);
      
      if (error) throw error;
      
      toast({
        title: "Status atualizado",
        description: "O status da denúncia foi atualizado com sucesso."
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar status da denúncia",
        variant: "destructive"
      });
    }
  };

  const filterReports = () => {
    if (!reports) return [];
    
    let filtered = [...reports];
    
    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter(report => report.status === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(term) || 
        report.description.toLowerCase().includes(term) ||
        report.location.toLowerCase().includes(term) ||
        report.category.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-10 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Verificando permissões...</p>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="pending">Pendentes</TabsTrigger>
                  <TabsTrigger value="in-progress">Em Análise</TabsTrigger>
                  <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Pesquisar denúncias..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <p>Carregando denúncias...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">Erro ao carregar denúncias</p>
                <Button onClick={() => refetch()} className="mt-2">Tentar novamente</Button>
              </div>
            ) : filterReports().length === 0 ? (
              <div className="text-center py-8">
                <p>Nenhuma denúncia encontrada.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Título</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterReports().map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <a href={`/report/${report.id}`} className="hover:text-primary">
                            {report.title}
                          </a>
                        </TableCell>
                        <TableCell>{report.category}</TableCell>
                        <TableCell>{report.location}</TableCell>
                        <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <StatusBadge status={report.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={report.status}
                            onValueChange={(value) => updateReportStatus(report.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue placeholder="Alterar status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="in-progress">Em Análise</SelectItem>
                              <SelectItem value="resolved">Resolvido</SelectItem>
                              <SelectItem value="rejected">Rejeitado</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
