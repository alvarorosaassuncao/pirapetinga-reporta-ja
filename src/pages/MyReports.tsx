
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReportCard from "@/components/ReportCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Report, ReportStatus } from "@/types/report";

const MyReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const {
    data: reports,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["reports", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from("reports")
          .select("*")
          .eq("user_id", user.id);
        
        if (error) {
          console.error("Error fetching reports:", error);
          toast({
            title: "Erro ao carregar denúncias",
            description: error.message,
            variant: "destructive"
          });
          throw error;
        }
        
        // Log the image URLs to help with debugging
        if (data && data.length > 0) {
          console.log("Report data with images:", data.map(item => ({
            id: item.id,
            title: item.title,
            imageUrl: item.image_url
          })));
        }
        
        return data || [];
      } catch (error) {
        console.error("Error in query function:", error);
        throw error;
      }
    },
    enabled: !!user
  });
  
  const filterReports = (status?: ReportStatus | "all") => {
    if (!reports) return [];
    
    if (status && status !== "all") {
      return reports.filter(report => report.status === status);
    }
    
    return reports;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-10 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Carregando denúncias...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-10 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Erro ao carregar denúncias</h2>
            <p className="text-gray-600 mb-4">Ocorreu um erro ao tentar carregar suas denúncias.</p>
            <Button onClick={() => refetch()}>Tentar novamente</Button>
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
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Minhas Denúncias</h1>
              <p className="mt-2 text-gray-600">
                Acompanhe o status das suas denúncias e receba atualizações.
              </p>
            </div>
            
            <Link to="/report-problem">
              <Button className="bg-primary hover:bg-primary-700">
                Nova Denúncia
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {!reports || reports.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-10 text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma denúncia encontrada</h2>
              <p className="text-gray-600 mb-6">
                Você ainda não reportou nenhum problema na cidade.
              </p>
              <Link to="/report-problem">
                <Button>Reportar um problema</Button>
              </Link>
            </div>
          ) : (
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="in-progress">Em Análise</TabsTrigger>
                <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterReports().map((report) => (
                    <ReportCard
                      key={report.id}
                      id={report.id}
                      title={report.title}
                      description={report.description}
                      category={report.category}
                      location={report.location}
                      status={report.status as ReportStatus}
                      date={new Date(report.created_at).toLocaleDateString()}
                      imageUrl={report.image_url}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterReports('pending' as ReportStatus).map((report) => (
                    <ReportCard
                      key={report.id}
                      id={report.id}
                      title={report.title}
                      description={report.description}
                      category={report.category}
                      location={report.location}
                      status={report.status as ReportStatus}
                      date={new Date(report.created_at).toLocaleDateString()}
                      imageUrl={report.image_url}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="in-progress" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterReports('in-progress' as ReportStatus).map((report) => (
                    <ReportCard
                      key={report.id}
                      id={report.id}
                      title={report.title}
                      description={report.description}
                      category={report.category}
                      location={report.location}
                      status={report.status as ReportStatus}
                      date={new Date(report.created_at).toLocaleDateString()}
                      imageUrl={report.image_url}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="resolved" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterReports('resolved' as ReportStatus).map((report) => (
                    <ReportCard
                      key={report.id}
                      id={report.id}
                      title={report.title}
                      description={report.description}
                      category={report.category}
                      location={report.location}
                      status={report.status as ReportStatus}
                      date={new Date(report.created_at).toLocaleDateString()}
                      imageUrl={report.image_url}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyReports;
