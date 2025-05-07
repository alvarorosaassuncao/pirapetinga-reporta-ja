
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CategorySelector from "@/components/CategorySelector";
import LocationPicker from "@/components/LocationPicker";

const categories = [
  { id: "streets", name: "Calçadas e Vias", icon: "🛣️" },
  { id: "lighting", name: "Iluminação", icon: "💡" },
  { id: "garbage", name: "Lixo", icon: "🗑️" },
  { id: "water", name: "Água e Esgoto", icon: "💧" },
  { id: "signs", name: "Sinalização", icon: "🚦" },
  { id: "parks", name: "Praças e Parques", icon: "🌳" },
  { id: "public-buildings", name: "Prédios Públicos", icon: "🏛️" },
  { id: "other", name: "Outros", icon: "📋" }
];

// Lista de denúncias em memória (simulando um banco de dados)
const reportsList = [
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
];

const ReportProblem = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [location, setLocation] = useState<{ address: string; latitude: number; longitude: number } | null>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      const newPreviewImages = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviewImages]);
      
      setImages([...images, ...filesArray]);
    }
  };
  
  const removeImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    
    const updatedPreviews = [...previewImages];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      toast({
        title: "Categoria obrigatória",
        description: "Por favor, selecione uma categoria para o problema.",
        variant: "destructive",
      });
      return;
    }
    
    if (!title) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, forneça um título para o problema.",
        variant: "destructive",
      });
      return;
    }
    
    if (!location) {
      toast({
        title: "Localização obrigatória",
        description: "Por favor, marque a localização do problema no mapa.",
        variant: "destructive",
      });
      return;
    }
    
    // Criando uma nova denúncia (na vida real, isso seria enviado a um servidor)
    const newReport = {
      id: (reportsList.length + 1).toString(),
      title,
      description,
      category: selectedCategory === "streets" ? "Calçadas e Vias" : 
               selectedCategory === "lighting" ? "Iluminação" :
               selectedCategory === "garbage" ? "Lixo" :
               selectedCategory === "water" ? "Água e Esgoto" :
               selectedCategory === "signs" ? "Sinalização" :
               selectedCategory === "parks" ? "Praças e Parques" :
               selectedCategory === "public-buildings" ? "Prédios Públicos" : "Outros",
      location: location.address,
      status: "pending" as const,
      date: new Date().toLocaleDateString(),
      imageUrl: previewImages[0] || "https://images.unsplash.com/photo-1524230572899-a752b3835840?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    };
    
    // Adicionando a nova denúncia à lista (simulando um banco de dados)
    reportsList.push(newReport);
    
    // Log para debug
    console.log({
      title,
      description,
      category: selectedCategory,
      location,
      images
    });
    
    toast({
      title: "Denúncia enviada com sucesso!",
      description: "Você poderá acompanhar o status da sua denúncia em 'Minhas Denúncias'.",
    });
    
    // Redirecionar para a página de detalhes da denúncia
    setTimeout(() => {
      navigate(`/report/${newReport.id}`);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 sm:p-8 shadow-sm rounded-lg border border-gray-100">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Reportar um Problema</h1>
              <p className="mt-2 text-gray-600">
                Preencha o formulário para reportar um problema em Pirapetinga.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria do Problema</Label>
                <CategorySelector 
                  categories={categories}
                  onSelect={setSelectedCategory}
                  selectedCategory={selectedCategory}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Buraco na calçada"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o problema em detalhes..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Fotos</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {previewImages.map((src, index) => (
                    <div key={index} className="relative aspect-square">
                      <img 
                        src={src} 
                        alt={`Foto ${index + 1}`} 
                        className="w-full h-full object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                  
                  {previewImages.length < 4 && (
                    <label className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 aspect-square">
                      <Camera className="h-8 w-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Adicionar foto</span>
                      <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Máximo de 4 fotos. Formatos aceitos: JPG, PNG.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Localização do Problema</Label>
                <LocationPicker onSelectLocation={setLocation} />
              </div>
              
              <Button type="submit" className="w-full">
                Enviar Denúncia
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportProblem;
