
import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface EmptyHistoryProps {
  searchTerm: string;
}

const EmptyHistory: React.FC<EmptyHistoryProps> = ({ searchTerm }) => {
  return (
    <div className="text-center py-20">
      <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Nenhum histórico encontrado</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        {searchTerm ? "Nenhum resultado encontrado para sua busca." : "Suas buscas serão salvas aqui para facilitar o acesso e a referência futura."}
      </p>
    </div>
  );
};

export default EmptyHistory;
