
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  MapPin, 
  List,
  User
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <Link to="/report-problem" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md font-medium">
              Reportar Problema
            </Link>
            <Link to="/my-reports" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md font-medium">
              Minhas Denúncias
            </Link>
            <div className="ml-2">
              <Link to="/login">
                <Button variant="outline" className="mr-2">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary-700">Cadastrar</Button>
              </Link>
            </div>
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
            <div className="pt-2 pb-1 flex space-x-2">
              <Link to="/login" className="w-1/2" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">Entrar</Button>
              </Link>
              <Link to="/register" className="w-1/2" onClick={toggleMenu}>
                <Button className="w-full bg-primary hover:bg-primary-700">Cadastrar</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
