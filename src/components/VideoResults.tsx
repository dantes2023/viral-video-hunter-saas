
import React, { useState } from 'react';
import VideoCard from './video/VideoCard';
import VideoListItem from './video/VideoListItem';
import LoadingSkeleton from './video/LoadingSkeleton';
import EmptyState from './video/EmptyState';
import VideoHeader from './video/VideoHeader';
import { VideoData } from './video/types';
import { mockVideos } from './video/utils';

// Componente principal de resultados
const VideoResults = ({ 
  isLoading = false, 
  videos = mockVideos,
  keyword = ''
}: { 
  isLoading?: boolean; 
  videos?: VideoData[];
  keyword?: string;
}) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return <LoadingSkeleton view={view} />;
  }
  
  if (!videos || videos.length === 0) {
    return <EmptyState keyword={keyword} />;
  }

  const handleExport = () => {
    alert('Exportando dados para CSV/Excel...');
    // Funcionalidade de exportação seria implementada aqui
  };

  return (
    <div>
      <VideoHeader 
        videoCount={videos.length}
        keyword={keyword}
        view={view}
        setView={setView}
        onExport={handleExport}
      />

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <VideoListItem key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoResults;
