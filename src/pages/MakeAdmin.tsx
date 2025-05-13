
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const MakeAdmin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminInfo, setAdminInfo] = useState<{name: string; email: string} | null>(null);
  
  const handleMakeAdmin = async () => {
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Primeiro, buscar o ID do usuário pelo email
      const { data: functionData, error: functionError } = await supabase
        .rpc('get_user_id_by_email', { email_input: email });
      
      if (functionError) throw functionError;
      
      if (!functionData) {
        toast({
          title: "Usuário não encontrado",
          description: "Não foi possível encontrar um usuário com este email",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      const userId = functionData;
      
      // Buscar o nome do perfil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', userId)
        .single();
      
      // Verificar se já é admin
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();
      
      if (existingRole) {
        toast({
          title: "Este usuário já é um administrador",
          description: "O usuário já possui privilégios de administrador",
          variant: "default"
        });
        setAdminInfo({
          name: profileData?.name || 'Usuário',
          email: email
        });
        setIsSubmitting(false);
        return;
      }
      
      // Adicionar usuário como admin
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin'
        });
      
      if (insertError) throw insertError;
      
      toast({
        title: "Sucesso",
        description: "Usuário promovido a administrador com sucesso",
      });
      
      setAdminInfo({
        name: profileData?.name || 'Usuário',
        email: email
      });
    } catch (error: any) {
      console.error("Error making admin:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao adicionar o administrador",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Administrador</CardTitle>
              <CardDescription>
                Adicione privilégios de administrador a um usuário existente.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email do usuário
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                {adminInfo && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Administrador</AlertTitle>
                    <AlertDescription>
                      {adminInfo.name} ({adminInfo.email}) possui privilégios de administrador.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleMakeAdmin}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processando..." : "Adicionar Admin"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MakeAdmin;
