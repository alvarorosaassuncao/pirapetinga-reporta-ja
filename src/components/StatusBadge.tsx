
import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
};

const statusConfig = {
  'pending': {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  'in-progress': {
    label: 'Em Análise',
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  'resolved': {
    label: 'Resolvido',
    className: 'bg-green-100 text-green-800 border-green-200'
  },
  'rejected': {
    label: 'Rejeitado',
    className: 'bg-red-100 text-red-800 border-red-200'
  }
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  // Make sure status exists and is a valid key in statusConfig
  if (!status || !Object.keys(statusConfig).includes(status)) {
    console.error(`Invalid status provided to StatusBadge: ${status}`);
    // Fallback to pending status if an invalid status is provided
    status = 'pending';
  }
  
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={`${config.className} font-medium px-2.5 py-0.5 rounded text-xs`}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
