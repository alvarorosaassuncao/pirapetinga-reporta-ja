
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ReportCard from "@/components/ReportCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Report, ReportStatus } from "@/types/report";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Convert status string to ReportStatus type
        const typedReports = data?.map(report => ({
          ...report,
          status: report.status as ReportStatus
        })) || [];
        
        setReports(typedReports);
      } catch (error) {
        console.error('Erro ao buscar denúncias:', error);
        toast({
          title: "Erro ao carregar denúncias",
          description: "Não foi possível carregar as denúncias. Por favor, tente novamente mais tarde.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, [toast]);
  
  const filterReports = (status?: string) => {
    let filtered = reports;
    
    if (status && status !== "all") {
      filtered = filtered.filter(report => report.status === status);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(
        report => 
          (report.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Ocorrências em Pirapetinga</h2>
              <p className="mt-2 text-lg text-gray-600">
                Confira todas as denúncias da cidade para ficar por dentro do que está acontecendo.
              </p>
            </div>
            
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Input
                  type="text"
                  placeholder="Buscar denúncias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="w-full sm:w-auto flex space-x-2">
                <Button variant="outline" className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Ver no Mapa
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="in-progress">Em Análise</TabsTrigger>
                <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
              </TabsList>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <TabsContent value="all" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filterReports().length > 0 ? (
                        filterReports().map((report) => (
                          <ReportCard
                            key={report.id}
                            id={report.id}
                            title={report.title || "Sem título"}
                            description={report.description}
                            category={report.category}
                            location={report.location}
                            status={report.status as ReportStatus || "pending"}
                            date={formatDate(report.created_at)}
                            imageUrl={report.image_url || undefined}
                          />
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-10">
                          <p className="text-gray-500">Nenhuma denúncia encontrada</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pending" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filterReports('pending').length > 0 ? (
                        filterReports('pending').map((report) => (
                          <ReportCard
                            key={report.id}
                            id={report.id}
                            title={report.title || "Sem título"}
                            description={report.description}
                            category={report.category}
                            location={report.location}
                            status={report.status as ReportStatus || "pending"}
                            date={formatDate(report.created_at)}
                            imageUrl={report.image_url || undefined}
                          />
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-10">
                          <p className="text-gray-500">Nenhuma denúncia pendente encontrada</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="in-progress" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filterReports('in-progress').length > 0 ? (
                        filterReports('in-progress').map((report) => (
                          <ReportCard
                            key={report.id}
                            id={report.id}
                            title={report.title || "Sem título"}
                            description={report.description}
                            category={report.category}
                            location={report.location}
                            status={report.status as ReportStatus || "pending"}
                            date={formatDate(report.created_at)}
                            imageUrl={report.image_url || undefined}
                          />
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-10">
                          <p className="text-gray-500">Nenhuma denúncia em análise encontrada</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resolved" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filterReports('resolved').length > 0 ? (
                        filterReports('resolved').map((report) => (
                          <ReportCard
                            key={report.id}
                            id={report.id}
                            title={report.title || "Sem título"}
                            description={report.description}
                            category={report.category}
                            location={report.location}
                            status={report.status as ReportStatus || "pending"}
                            date={formatDate(report.created_at)}
                            imageUrl={report.image_url || undefined}
                          />
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-10">
                          <p className="text-gray-500">Nenhuma denúncia resolvida encontrada</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
