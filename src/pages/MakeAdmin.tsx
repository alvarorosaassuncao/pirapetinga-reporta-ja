
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const MakeAdmin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [email, setEmail] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Secret key for making an admin - for simplicity using "admin123"
  // In a real app, this would be securely stored in an environment variable
  const ADMIN_SECRET = "admin123";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (secretKey !== ADMIN_SECRET) {
        throw new Error("A chave secreta está incorreta.");
      }
      
      // Check if user exists in Supabase
      const { data: userData, error: userError } = await supabase
        .from("auth.users")
        .select("id")
        .eq("email", email)
        .single();
      
      if (userError) {
        if (userError.code === "PGRST116") {
          throw new Error("Usuário não encontrado. Verifique o email.");
        }
        throw userError;
      }
      
      // Make user an admin
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: userData.id,
          role: "admin"
        });
      
      if (error) {
        if (error.code === "23505") { // Unique constraint violation
          throw new Error("Este usuário já é um administrador.");
        }
        throw error;
      }
      
      toast({
        title: "Sucesso!",
        description: `O usuário com email ${email} agora é um administrador.`,
      });
      
      setEmail("");
      setSecretKey("");
      
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao tentar adicionar o administrador.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 sm:p-8 shadow-sm rounded-lg border border-gray-100">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Adicionar Administrador</h1>
              <p className="mt-2 text-gray-600">
                Adicione um usuário como administrador do sistema.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email do Usuário</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secretKey">Chave Secreta</Label>
                <Input
                  id="secretKey"
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Digite a chave secreta"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processando..." : "Adicionar Administrador"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MakeAdmin;
