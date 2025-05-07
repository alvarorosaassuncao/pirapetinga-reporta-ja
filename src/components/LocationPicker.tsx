
import { useState, useRef, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LocationPickerProps {
  onSelectLocation: (location: { address: string; latitude: number; longitude: number }) => void;
}

const LocationPicker = ({ onSelectLocation }: LocationPickerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{ address: string; latitude: number; longitude: number } | null>(null);
  
  // This is a placeholder. In a real implementation, this would use a map API like Google Maps or Mapbox
  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Simulate finding a location in Pirapetinga
      const mockLocation = {
        address: `${searchTerm}, Pirapetinga, MG`,
        latitude: -21.6555, // Example coordinates for Pirapetinga
        longitude: -42.3422
      };
      
      setSelectedLocation(mockLocation);
      onSelectLocation(mockLocation);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex space-x-2">
        <div className="relative flex-grow">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite um endereço"
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <Button onClick={handleSearch} type="button">Buscar</Button>
      </div>

      {selectedLocation && (
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">{selectedLocation.address}</p>
              <p className="text-xs text-gray-500 mt-1">
                Coordenadas: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-200 rounded-md w-full h-60 flex items-center justify-center">
        <p className="text-gray-500">
          Mapa será carregado aqui
        </p>
      </div>

      <p className="text-xs text-gray-500">
        Selecione um ponto no mapa ou busque um endereço para marcar a localização exata do problema.
      </p>
    </div>
  );
};

export default LocationPicker;
