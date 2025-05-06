
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmptyStateProps {
  keyword?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ keyword }) => {
  return (
    <Alert className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Nenhum resultado encontrado para "{keyword}". Verifique se os resultados foram salvos corretamente durante a pesquisa.
      </AlertDescription>
    </Alert>
  );
};

export default EmptyState;
