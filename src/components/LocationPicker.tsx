
import { useState, useRef, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationPickerProps {
  onSelectLocation: (location: { address: string; latitude: number; longitude: number }) => void;
}

// Coordenadas aproximadas para Pirapetinga, MG, Brasil
const PIRAPETINGA_COORDS = {
  latitude: -21.6555,
  longitude: -42.3422
};

const LocationPicker = ({ onSelectLocation }: LocationPickerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{ address: string; latitude: number; longitude: number } | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  
  // Inicializa o mapa quando o componente é montado
  useEffect(() => {
    if (!mapContainer.current) return;

    // Token público do Mapbox - em um ambiente de produção, guarde em uma variável de ambiente
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXNyYWRldiIsImEiOiJjbHpuMnFranQwYXR0MmpueGVmYXR0OXMzIn0.KLrVVbYVqufV61jvMK0pOw';
    
    // Inicializa o mapa
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [PIRAPETINGA_COORDS.longitude, PIRAPETINGA_COORDS.latitude],
      zoom: 13
    });

    // Adiciona controles de navegação
    map.current.addControl(new mapboxgl.NavigationControl());
    
    // Cria um marcador inicial
    marker.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat([PIRAPETINGA_COORDS.longitude, PIRAPETINGA_COORDS.latitude])
      .addTo(map.current);

    // Evento para quando o marcador é arrastado
    marker.current.on('dragend', () => {
      if (!marker.current) return;
      const lngLat = marker.current.getLngLat();
      
      const newLocation = {
        address: `Localização personalizada, Pirapetinga, MG`,
        latitude: lngLat.lat,
        longitude: lngLat.lng
      };
      
      setSelectedLocation(newLocation);
      onSelectLocation(newLocation);
      
      console.log('Marcador movido para:', lngLat);
    });

    // Limpa quando o componente é desmontado
    return () => {
      map.current?.remove();
    };
  }, [onSelectLocation]);

  // Função para buscar um endereço (simulada)
  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Simula uma busca e move o marcador para uma posição levemente diferente
      // Em um ambiente real, aqui você usaria a API de geocodificação do Mapbox
      const randomOffset = 0.003 * (Math.random() - 0.5);
      
      const searchLocation = {
        address: `${searchTerm}, Pirapetinga, MG`,
        latitude: PIRAPETINGA_COORDS.latitude + randomOffset,
        longitude: PIRAPETINGA_COORDS.longitude + randomOffset
      };
      
      // Atualiza o estado e move o marcador no mapa
      setSelectedLocation(searchLocation);
      onSelectLocation(searchLocation);
      
      if (map.current && marker.current) {
        marker.current.setLngLat([searchLocation.longitude, searchLocation.latitude]);
        map.current.flyTo({
          center: [searchLocation.longitude, searchLocation.latitude],
          zoom: 15,
          essential: true
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Função para lidar com cliques no mapa
  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    if (!map.current || !marker.current) return;
    
    const clickLocation = {
      address: `Localização selecionada, Pirapetinga, MG`,
      latitude: e.lngLat.lat,
      longitude: e.lngLat.lng
    };
    
    setSelectedLocation(clickLocation);
    onSelectLocation(clickLocation);
    marker.current.setLngLat([clickLocation.longitude, clickLocation.latitude]);
  };

  // Adiciona o listener de clique ao mapa após ele ser carregado
  useEffect(() => {
    if (!map.current) return;
    
    map.current.on('click', handleMapClick);
    
    return () => {
      map.current?.off('click', handleMapClick);
    };
  }, [map.current, onSelectLocation]);

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

      <div ref={mapContainer} className="w-full h-60 rounded-md overflow-hidden border border-gray-200"></div>

      <p className="text-xs text-gray-500">
        Selecione um ponto no mapa ou busque um endereço para marcar a localização exata do problema.
      </p>
    </div>
  );
};

export default LocationPicker;
