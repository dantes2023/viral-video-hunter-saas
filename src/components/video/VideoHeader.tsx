
import React from 'react';
import { Download, Grid, List } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface VideoHeaderProps {
  videoCount: number;
  keyword?: string;
  view: 'grid' | 'list';
  setView: (view: 'grid' | 'list') => void;
  onExport: () => void;
}

const VideoHeader: React.FC<VideoHeaderProps> = ({ 
  videoCount, 
  keyword, 
  view, 
  setView, 
  onExport 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h2 className="text-xl font-semibold">
          {keyword ? `Resultados para "${keyword}"` : 'Vídeos virais recentes'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {videoCount} vídeos encontrados
        </p>
      </div>
      
      <div className="flex gap-2">
        <div className="bg-muted rounded-lg p-1 flex">
          <Button
            variant="ghost"
            size="sm"
            className={`px-3 ${view === 'grid' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}
            onClick={() => setView('grid')}
          >
            <Grid size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`px-3 ${view === 'list' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}
            onClick={() => setView('list')}
          >
            <List size={16} />
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExport}
          className="flex gap-1 items-center"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Exportar</span>
        </Button>
      </div>
    </div>
  );
};

export default VideoHeader;
