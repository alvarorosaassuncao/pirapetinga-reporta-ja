
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { ReportStatus } from "@/types/report";

interface Report {
  id: string;
  title: string;
  category: string;
  location: string;
  status: string;
  created_at: string;
  description: string;
}

interface AdminTableProps {
  reports: Report[];
  isLoading: boolean;
  activeTab: string;
  searchTerm: string;
  updateReportStatus: (reportId: string, newStatus: ReportStatus) => void;
  refetch: () => void;
}

const AdminTable = ({ 
  reports, 
  isLoading, 
  activeTab, 
  searchTerm, 
  updateReportStatus, 
  refetch 
}: AdminTableProps) => {
  
  const filterReports = () => {
    if (!reports) return [];
    
    let filtered = [...reports];
    
    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter(report => report.status === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(report => 
        report.title?.toLowerCase().includes(term) || 
        report.description?.toLowerCase().includes(term) ||
        report.location?.toLowerCase().includes(term) ||
        report.category?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Carregando denúncias...</p>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Nenhuma denúncia encontrada.</p>
      </div>
    );
  }

  const filteredReports = filterReports();

  if (filteredReports.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Nenhuma denúncia encontrada com os filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Título</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">
                <a 
                  href={`/report/${report.id}`} 
                  className="hover:text-primary"
                  title="Ver detalhes da denúncia"
                >
                  {report.title || "Sem título"}
                </a>
              </TableCell>
              <TableCell>{report.category}</TableCell>
              <TableCell>{report.location}</TableCell>
              <TableCell>
                {new Date(report.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                <StatusBadge status={report.status as ReportStatus} />
              </TableCell>
              <TableCell className="text-right">
                <Select
                  value={report.status}
                  onValueChange={(value) => updateReportStatus(report.id, value as ReportStatus)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Alterar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in-progress">Em Análise</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminTable;
