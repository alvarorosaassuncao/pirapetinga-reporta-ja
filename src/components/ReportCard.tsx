
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Link } from "react-router-dom";

interface ReportCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  date: string;
  imageUrl?: string;
}

const ReportCard = ({
  id,
  title,
  description,
  category,
  location,
  status,
  date,
  imageUrl
}: ReportCardProps) => {
  const hasValidImage = imageUrl && imageUrl.trim() !== '';

  return (
    <Card className="overflow-hidden card-hover">
      <div className="relative h-48 w-full">
        {hasValidImage ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Error loading card image:", imageUrl);
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1524230572899-a752b3835840?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
            }}
          />
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1524230572899-a752b3835840?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Imagem padrão"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={status} />
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-primary font-medium">{category}</p>
            <h3 className="text-lg font-bold leading-tight mt-1">{title}</h3>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
        
        <div className="flex items-center text-gray-500 text-xs mt-2">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center text-gray-500 text-xs mt-1">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>{date}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Link 
          to={`/report/${id}`} 
          className="text-primary hover:text-primary-800 text-sm font-medium"
        >
          Ver detalhes
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
