
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar, 
  MapPin, 
  User, 
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { ReportStatus } from "@/types/report";

interface Report {
  id: string;
  title: string;
  category: string;
  location: string;
  status: string;
  created_at: string;
  description: string;
  user_id: string;
  image_url?: string;
}

interface ReportManagementCardProps {
  report: Report;
  onStatusChange: (reportId: string, newStatus: ReportStatus) => void;
  onViewDetails: (reportId: string) => void;
  userName?: string;
}

const ReportManagementCard = ({ 
  report, 
  onStatusChange, 
  onViewDetails,
  userName 
}: ReportManagementCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusChange(report.id, newStatus as ReportStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const getActionButtons = () => {
    if (report.status === 'pending') {
      return (
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => handleStatusChange('in-progress')}
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Clock className="h-4 w-4 mr-1" />
            Analisar
          </Button>
        </div>
      );
    }

    if (report.status === 'in-progress') {
      return (
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => handleStatusChange('resolved')}
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Resolver
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleStatusChange('rejected')}
            disabled={isUpdating}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Rejeitar
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {report.title || "Denúncia sem título"}
            </CardTitle>
            <Badge 
              variant="outline" 
              className={`${getStatusColor(report.status)} font-medium`}
            >
              {getStatusLabel(report.status)}
            </Badge>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            #{report.id.slice(0, 8)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Report Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span>{userName || "Usuário não identificado"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(report.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FileText className="h-4 w-4 mr-2" />
            <span>{report.category}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{report.location}</span>
          </div>
        </div>

        {/* Description Preview */}
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-700 line-clamp-3">
            {report.description}
          </p>
        </div>

        {/* Image Preview */}
        {report.image_url && (
          <div className="flex justify-center">
            <img 
              src={report.image_url} 
              alt="Imagem da denúncia"
              className="max-h-32 rounded-md object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(report.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver Detalhes
          </Button>

          <div className="flex items-center space-x-2">
            {getActionButtons()}
            
            {/* Advanced Status Selector */}
            <Select
              value={report.status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in-progress">Em Análise</SelectItem>
                <SelectItem value="resolved">Resolvido</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportManagementCard;
