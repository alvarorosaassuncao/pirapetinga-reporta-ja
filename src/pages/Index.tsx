
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ReportCard from "@/components/ReportCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

// Dados de exemplo
const mockReports = [
  {
    id: "1",
    title: "Buraco na calçada",
    description: "Há um buraco grande na calçada que está causando acidentes com pedestres, especialmente à noite quando a visibilidade é baixa.",
    category: "Calçadas e Vias",
    location: "Rua das Flores, 123",
    status: "pending" as const,
    date: "22/04/2023",
    imageUrl: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "2",
    title: "Lâmpada queimada",
    description: "Poste de iluminação com lâmpada queimada há mais de duas semanas, deixando a rua muito escura e perigosa.",
    category: "Iluminação Pública",
    location: "Av. Principal, 500",
    status: "in-progress" as const,
    date: "15/04/2023",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "3",
    title: "Lixo acumulado",
    description: "Lixo acumulado na esquina, atraindo animais e causando mau cheiro na vizinhança. Coleta não passa há dias.",
    category: "Limpeza Urbana",
    location: "Rua dos Ipês, 78",
    status: "resolved" as const,
    date: "10/04/2023",
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "4",
    title: "Sinalização danificada",
    description: "Placa de 'Pare' caída no chão após ventos fortes, causando confusão no trânsito e situações perigosas.",
    category: "Sinalização",
    location: "Cruzamento das ruas A e B",
    status: "rejected" as const,
    date: "05/04/2023",
    imageUrl: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filterReports = (status?: string) => {
    let filtered = mockReports;
    
    if (status && status !== "all") {
      filtered = filtered.filter(report => report.status === status);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(
        report => 
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Como funciona</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Reportar problemas urbanos em Pirapetinga é simples e rápido.
              </p>
            </div>
            
            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4 mx-auto">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 text-center">Identifique o problema</h3>
                  <p className="mt-2 text-gray-600 text-center">
                    Encontrou um problema na cidade? Fotografe e registre os detalhes.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4 mx-auto">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 text-center">Envie sua denúncia</h3>
                  <p className="mt-2 text-gray-600 text-center">
                    Use nosso app para enviar a localização exata e detalhes do problema.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4 mx-auto">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 text-center">Acompanhe a solução</h3>
                  <p className="mt-2 text-gray-600 text-center">
                    Receba atualizações sobre o status do problema até sua resolução.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Problemas Reportados</h2>
              <p className="mt-2 text-lg text-gray-600">
                Confira as últimas denúncias da cidade e seu status de resolução.
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
                      status={report.status}
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
                      status={report.status}
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
                      status={report.status}
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
                      status={report.status}
                      date={report.date}
                      imageUrl={report.imageUrl}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
