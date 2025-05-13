import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ReportStatus } from "@/types/report";

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["report", id],
    queryFn: async () => {
      if (!id) return null;
      
      try {
        // Fetch report first
        const { data: reportData, error: reportError } = await supabase
          .from("reports")
          .select("*")
          .eq("id", id)
          .single();
        
        if (reportError) {
          if (reportError.code === "PGRST116") {
            return null; // Not found
          }
          
          toast({
            title: "Erro ao carregar denúncia",
            description: reportError.message,
            variant: "destructive",
          });
          
          throw reportError;
        }
        
        if (!reportData) {
          return null;
        }
        
        // Now fetch profile data separately
        let userName = "Usuário Anônimo";
        
        if (reportData.user_id) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", reportData.user_id)
            .single();
            
          if (profileData && profileData.name) {
            userName = profileData.name;
          }
        }
        
        console.log("Fetched report data:", reportData, "Username:", userName);
        
        return {
          ...reportData,
          status: reportData.status as ReportStatus,
          userName: userName
        };
      } catch (error) {
        console.error("Error fetching report details:", error);
        throw error;
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-10 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Carregando detalhes da denúncia...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-10 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700">Denúncia não encontrada</h2>
            <p className="mt-2 text-gray-600">A denúncia que você está procurando não existe ou você não tem permissão para visualizá-la.</p>
            <Link to="/my-reports">
              <Button className="mt-4">Voltar para Minhas Denúncias</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = report ? new Date(report.created_at).toLocaleDateString() : '';
  const hasImage = report?.image_url && report.image_url.trim() !== '';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/my-reports" className="inline-flex items-center text-primary hover:text-primary-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Voltar para Minhas Denúncias</span>
            </Link>
          </div>
          
          {report && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-64 w-full relative">
                {hasImage ? (
                  <img 
                    src={report.image_url} 
                    alt={report.title || "Imagem da denúncia"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Error loading image:", report.image_url);
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1524230572899-a752b3835840?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
                    }}
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1524230572899-a752b3835840?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                    alt="Imagem padrão"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-4 right-4">
                  <StatusBadge status={report.status} />
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-sm text-primary font-medium">{report.category}</p>
                  <h1 className="text-2xl font-bold mt-1">{report.title}</h1>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-2">Descrição</h2>
                  <p className="text-gray-700">{report.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-medium mb-2">Localização</h2>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                      {report.location}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-medium mb-2">Data da Denúncia</h2>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                      {formattedDate}
                    </div>
                  </div>
                </div>
                
                {/* Adicionando informação do usuário que fez a denúncia */}
                <div className="mt-6">
                  <h2 className="text-lg font-medium mb-2">Reportado por</h2>
                  <div className="flex items-center text-gray-700">
                    <User className="h-5 w-5 mr-2 text-gray-400" />
                    {report.userName || "Usuário Anônimo"}
                  </div>
                </div>
                
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h2 className="text-lg font-medium mb-4">Atualizações</h2>
                  
                  {report.status === "pending" ? (
                    <div className="bg-yellow-50 p-4 rounded-md">
                      <p className="text-yellow-800">
                        Sua denúncia foi recebida e está aguardando análise pela equipe responsável.
                      </p>
                    </div>
                  ) : report.status === "in-progress" ? (
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-blue-800">
                        Sua denúncia está sendo analisada pela equipe responsável.
                      </p>
                    </div>
                  ) : report.status === "resolved" ? (
                    <div className="bg-green-50 p-4 rounded-md">
                      <p className="text-green-800">
                        O problema reportado foi resolvido. Obrigado por contribuir com a melhoria da cidade!
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-4 rounded-md">
                      <p className="text-red-800">
                        Sua denúncia foi rejeitada. Por favor, entre em contato com a prefeitura para mais informações.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportDetail;
