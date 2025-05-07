
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReportCard from "@/components/ReportCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Dados de exemplo
const mockReports = [
  {
    id: "1",
    title: "Buraco na calçada",
    description: "Há um buraco grande na calçada que está causando acidentes com pedestres.",
    category: "Calçadas e Vias",
    location: "Rua das Flores, 123",
    status: "pending",
    date: "22/04/2023",
    imageUrl: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "2",
    title: "Lâmpada queimada",
    description: "Poste de iluminação com lâmpada queimada há mais de duas semanas.",
    category: "Iluminação Pública",
    location: "Av. Principal, 500",
    status: "in-progress",
    date: "15/04/2023",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "3",
    title: "Lixo acumulado",
    description: "Lixo acumulado na esquina, atraindo animais e causando mau cheiro na vizinhança.",
    category: "Limpeza Urbana",
    location: "Rua dos Ipês, 78",
    status: "resolved",
    date: "10/04/2023",
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
] as const;

const MyReports = () => {
  const filterReports = (status?: string) => {
    if (status && status !== "all") {
      return mockReports.filter(report => report.status === status);
    }
    return mockReports;
  };

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
          
          {mockReports.length === 0 ? (
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
            <Tabs defaultValue="all">
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
                      status={report.status as any}
                      date={report.date}
                      imageUrl={report.imageUrl}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterReports('pending').map((report) => (
                    <ReportCard
                      key={report.id}
                      id={report.id}
                      title={report.title}
                      description={report.description}
                      category={report.category}
                      location={report.location}
                      status={report.status as any}
                      date={report.date}
                      imageUrl={report.imageUrl}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="in-progress" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterReports('in-progress').map((report) => (
                    <ReportCard
                      key={report.id}
                      id={report.id}
                      title={report.title}
                      description={report.description}
                      category={report.category}
                      location={report.location}
                      status={report.status as any}
                      date={report.date}
                      imageUrl={report.imageUrl}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="resolved" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterReports('resolved').map((report) => (
                    <ReportCard
                      key={report.id}
                      id={report.id}
                      title={report.title}
                      description={report.description}
                      category={report.category}
                      location={report.location}
                      status={report.status as any}
                      date={report.date}
                      imageUrl={report.imageUrl}
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
