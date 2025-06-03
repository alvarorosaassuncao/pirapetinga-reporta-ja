
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  MapPin, 
  LogOut,
  Shield
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const { user, signOut, userName, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user || loading) {
        setIsAdmin(false);
        return;
      }
      
      setAdminLoading(true);
      
      try {
        console.log("Checking admin status for user:", user.email);
        
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();
        
        if (!error && data) {
          console.log("User is admin");
          setIsAdmin(true);
        } else {
          console.log("User is not admin");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [user, loading]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent double clicks
    
    setIsSigningOut(true);
    
    try {
      console.log("Starting sign out process...");
      
      await signOut();
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta."
      });
      
      // Close mobile menu if open
      setIsMenuOpen(false);
      
      // Clear admin state
      setIsAdmin(false);
      
      // Navigate to home
      navigate("/", { replace: true });
      
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar sair. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <MapPin className="h-8 w-8 text-primary mr-2" />
              <span className="font-bold text-xl text-gray-800">Reclama Pirapetinga</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md font-medium">
              Início
            </Link>
            {user && (
              <>
                <Link to="/report-problem" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md font-medium">
                  Reportar Problema
                </Link>
                <Link to="/my-reports" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md font-medium">
                  Minhas Denúncias
                </Link>
                {isAdmin && !adminLoading && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md font-medium flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
                  </Link>
                )}
              </>
            )}
            
            {user ? (
              <div className="flex items-center ml-2">
                <span className="text-gray-700 mr-4">
                  Olá, {userName || user.email?.split('@')[0]}
                  {isAdmin && !adminLoading && <span className="text-xs text-blue-600 ml-1">(Admin)</span>}
                </span>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut} 
                  disabled={isSigningOut}
                  className="flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isSigningOut ? "Saindo..." : "Sair"}
                </Button>
              </div>
            ) : (
              <div className="ml-2">
                <Link to="/login">
                  <Button variant="outline" className="mr-2">Entrar</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primary-700">Cadastrar</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-md">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary"
              onClick={toggleMenu}
            >
              Início
            </Link>
            {user && (
              <>
                <Link 
                  to="/report-problem" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary"
                  onClick={toggleMenu}
                >
                  Reportar Problema
                </Link>
                <Link 
                  to="/my-reports" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary"
                  onClick={toggleMenu}
                >
                  Minhas Denúncias
                </Link>
                {isAdmin && !adminLoading && (
                  <Link 
                    to="/admin" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary flex items-center"
                    onClick={toggleMenu}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Administração
                  </Link>
                )}
              </>
            )}

            {user ? (
              <div className="pt-2 pb-1">
                <div className="px-3 py-2 text-base font-medium text-gray-700">
                  Olá, {userName || user.email?.split('@')[0]}
                  {isAdmin && !adminLoading && <span className="text-xs text-blue-600 ml-1">(Admin)</span>}
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut} 
                  disabled={isSigningOut}
                  className="mt-2 w-full flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isSigningOut ? "Saindo..." : "Sair"}
                </Button>
              </div>
            ) : (
              <div className="pt-2 pb-1 flex space-x-2">
                <Link to="/login" className="w-1/2" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">Entrar</Button>
                </Link>
                <Link to="/register" className="w-1/2" onClick={toggleMenu}>
                  <Button className="w-full bg-primary hover:bg-primary-700">Cadastrar</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
