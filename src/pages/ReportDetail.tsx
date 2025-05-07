
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

// Dados de exemplo
const mockReports = [
  {
    id: "1",
    title: "Buraco na calçada",
    description: "Há um buraco grande na calçada que está causando acidentes com pedestres.",
    category: "Calçadas e Vias",
    location: "Rua das Flores, 123",
    status: "pending" as const,
    date: "22/04/2023",
    imageUrl: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "2",
    title: "Lâmpada queimada",
    description: "Poste de iluminação com lâmpada queimada há mais de duas semanas.",
    category: "Iluminação Pública",
    location: "Av. Principal, 500",
    status: "in-progress" as const,
    date: "15/04/2023",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "3",
    title: "Lixo acumulado",
    description: "Lixo acumulado na esquina, atraindo animais e causando mau cheiro na vizinhança.",
    category: "Limpeza Urbana",
    location: "Rua dos Ipês, 78",
    status: "resolved" as const,
    date: "10/04/2023",
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    // Simular busca no banco de dados
    const foundReport = mockReports.find(report => report.id === id);
    if (foundReport) {
      setReport(foundReport);
    }
  }, [id]);

  if (!report) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-10 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700">Denúncia não encontrada</h2>
            <p className="mt-2 text-gray-600">A denúncia que você está procurando não existe.</p>
            <Link to="/my-reports">
              <Button className="mt-4">Voltar para Minhas Denúncias</Button>
            </Link>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/my-reports" className="inline-flex items-center text-primary hover:text-primary-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Voltar para Minhas Denúncias</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-64 w-full relative">
              <img 
                src={report.imageUrl} 
                alt={report.title}
                className="w-full h-full object-cover"
              />
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
                    {report.date}
                  </div>
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
                ) : (
                  <div className="bg-green-50 p-4 rounded-md">
                    <p className="text-green-800">
                      O problema reportado foi resolvido. Obrigado por contribuir com a melhoria da cidade!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportDetail;
