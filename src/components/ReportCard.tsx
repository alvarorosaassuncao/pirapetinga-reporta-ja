
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Eye, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Report {
  id: string;
  title: string;
  category: string;
  location: string;
  status: string;
  created_at: string;
  description: string;
  image_url?: string;
  updated_at?: string;
}

interface ReportCardProps {
  report: Report;
  id?: string; // Add id prop for backward compatibility
}

const ReportCard = ({ report, id }: ReportCardProps) => {
  // Early return if report is not provided
  if (!report) {
    console.warn("ReportCard: report prop is undefined");
    return null;
  }

  // For backwards compatibility with components that pass id separately
  const reportId = report.id || id;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in-progress': return 'Em Análise';
      case 'resolved': return 'Resolvido';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  // Check if report was recently updated (within last 7 days)
  const isRecentlyUpdated = () => {
    // Safety checks
    if (!report || !report.updated_at || report.updated_at === report.created_at) {
      return false;
    }
    
    try {
      const updateDate = new Date(report.updated_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      return updateDate > weekAgo;
    } catch (error) {
      console.error("Error parsing update date:", error);
      return false;
    }
  };

  const showUpdateNotification = () => {
    if (!report) return false;
    return isRecentlyUpdated() && (report.status === 'resolved' || report.status === 'rejected' || report.status === 'in-progress');
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 relative">
      {/* Update notification indicator */}
      {showUpdateNotification() && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-blue-600 text-white rounded-full p-1">
            <AlertCircle className="h-4 w-4" />
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {report.title || "Denúncia sem título"}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(report.status || 'pending')} font-medium ml-2 shrink-0`}
          >
            {getStatusLabel(report.status || 'pending')}
          </Badge>
        </div>
        
        {showUpdateNotification() && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mb-2">
            <p className="text-sm text-blue-800 font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Sua denúncia foi analisada!
            </p>
          </div>
        )}
        
        <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-2 py-1 rounded">
          {report.category || "Sem categoria"}
        </span>
      </CardHeader>

      <CardContent className="space-y-3">
        {report.image_url && (
          <div className="w-full h-48 rounded-md overflow-hidden">
            <img 
              src={report.image_url} 
              alt={report.title || "Imagem da denúncia"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
          {report.description || "Sem descrição"}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{report.location || "Local não informado"}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {report.created_at ? new Date(report.created_at).toLocaleDateString('pt-BR') : "Data não disponível"}
            </span>
          </div>
        </div>

        {/* Show last update info for recently updated reports */}
        {showUpdateNotification() && report.updated_at && (
          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
            Atualizado em {new Date(report.updated_at).toLocaleDateString('pt-BR')} às {new Date(report.updated_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}

        <div className="pt-2 border-t">
          <Link to={`/report/${reportId}`}>
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
