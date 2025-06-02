
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ReportStatus } from "@/types/report";

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: report, isLoading: reportLoading, error: reportError } = useQuery({
    queryKey: ["report", id],
    queryFn: async () => {
      if (!id) throw new Error("ID da denúncia não fornecido");
      
      console.log("Fetching report details for ID:", id);
      
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching report:", error);
        throw error;
      }
      
      if (!data) {
        throw new Error("Denúncia não encontrada");
      }
      
      console.log("Report fetched successfully:", data);
      return data;
    },
    enabled: !!id,
    retry: 3
  });

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile", report?.user_id],
    queryFn: async () => {
      if (!report?.user_id) return null;
      
      console.log("Fetching user profile for user_id:", report.user_id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", report.user_id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      
      console.log("User profile fetched:", data);
      return data;
    },
    enabled: !!report?.user_id,
    retry: 2
  });

  if (reportLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-10 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando detalhes da denúncia...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (reportError || !report) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-10 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Denúncia não encontrada
            </h2>
            <p className="text-gray-600 mb-4">
              A denúncia que você está procurando não existe ou foi removida.
            </p>
            <Link to="/">
              <Button>Voltar ao início</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const userName = userProfile?.name || "Usuário não identificado";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-primary hover:text-primary-700 mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para lista de denúncias
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {report.image_url && (
              <div className="w-full h-64 sm:h-80">
                <img 
                  src={report.image_url} 
                  alt={report.title || "Imagem da denúncia"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Error loading report image:", report.image_url);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="mb-2 sm:mb-0">
                  <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    {report.category}
                  </span>
                </div>
                <StatusBadge status={report.status as ReportStatus} />
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {report.title || "Denúncia sem título"}
              </h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{report.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{new Date(report.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>
                    {profileLoading ? "Carregando..." : userName}
                  </span>
                </div>
              </div>
              
              <div className="prose prose-gray max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {report.description}
                </p>
              </div>
              
              {report.updated_at && report.updated_at !== report.created_at && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Última atualização: {new Date(report.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportDetail;
