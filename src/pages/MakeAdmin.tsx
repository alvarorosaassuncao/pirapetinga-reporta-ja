
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MakeAdmin = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // First get the user ID from the email
      const { data, error: userError } = await supabase.rpc(
        "get_user_id_by_email",
        { email_input: email }
      );

      if (userError) throw userError;
      
      if (!data) {
        setResult(`Nenhum usuário encontrado com o email ${email}`);
        setLoading(false);
        return;
      }

      const userId = data;
      
      // Insert admin role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "admin"
        });

      if (roleError) {
        if (roleError.code === "23505") {
          setResult(`O usuário ${email} já é um administrador.`);
        } else {
          throw roleError;
        }
      } else {
        setResult(`Sucesso! O usuário ${email} agora é um administrador.`);
      }
    } catch (error: any) {
      console.error("Error making admin:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao tentar conceder permissões de administrador.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold mb-6">Adicionar Administrador</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email do usuário
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@exemplo.com"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  O usuário deve já estar registrado no sistema.
                </p>
              </div>
              
              <Button type="submit" disabled={loading}>
                {loading ? "Processando..." : "Tornar Administrador"}
              </Button>
              
              {result && (
                <div className={`p-3 rounded-md mt-4 ${result.includes("Sucesso") ? "bg-green-50 text-green-800" : "bg-yellow-50 text-yellow-800"}`}>
                  {result}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MakeAdmin;
