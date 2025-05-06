
import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-10">
      <SearchIcon className="h-10 w-10 text-gray-400 mx-auto mb-4 animate-pulse" />
      <p className="text-lg text-gray-500">Carregando histórico...</p>
    </div>
  );
};

export default LoadingState;
