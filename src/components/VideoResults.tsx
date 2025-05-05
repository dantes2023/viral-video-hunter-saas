
import React, { useState } from 'react';
import { 
  Eye, 
  User, 
  Calendar, 
  ThumbsUp, 
  BarChart2, 
  List, 
  Grid,
  Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Tipos para os dados do vídeo
export interface VideoData {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  subscriberCount: number;
  publishedAt: string;
  description: string;
  isShort: boolean;
}

// Mock de dados para simulação
const mockVideos: VideoData[] = Array(12).fill(null).map((_, index) => ({
  id: `video-${index}`,
  title: `Vídeo viral ${index + 1}: Como fazer sucesso no YouTube rapidamente`,
  channelTitle: `Canal Criativo ${index + 1}`,
  thumbnail: `https://picsum.photos/seed/${index + 1}/640/360`,
  viewCount: Math.floor(Math.random() * 1000000) + 10000,
  likeCount: Math.floor(Math.random() * 50000) + 1000,
  subscriberCount: Math.floor(Math.random() * 1000000) + 10000,
  publishedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
  description: 'Uma descrição interessante sobre o conteúdo deste vídeo viral que está fazendo sucesso.',
  isShort: index % 3 === 0
}));

// Formatador de números
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

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

  const handleExport = () => {
    alert('Exportando dados para CSV/Excel...');
    // Funcionalidade de exportação seria implementada aqui
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            {keyword ? `Resultados para "${keyword}"` : 'Vídeos virais recentes'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {videos.length} vídeos encontrados
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
            onClick={handleExport}
            className="flex gap-1 items-center"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        </div>
      </div>

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

// Componente de card para visualização em grade
const VideoCard = ({ video }: { video: VideoData }) => {
  return (
    <Card className="video-card card-hover">
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full aspect-video object-cover"
        />
        {video.isShort && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Short
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-base line-clamp-2 mb-1">{video.title}</h3>
        <p className="text-muted-foreground text-sm mb-3">{video.channelTitle}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Eye size={14} />
            <span>{formatNumber(video.viewCount)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ThumbsUp size={14} />
            <span>{formatNumber(video.likeCount)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User size={14} />
            <span>{formatNumber(video.subscriberCount)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar size={14} />
            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Componente para visualização em lista
const VideoListItem = ({ video }: { video: VideoData }) => {
  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <img 
        src={video.thumbnail} 
        alt={video.title} 
        className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex flex-col flex-grow overflow-hidden">
        <div className="flex justify-between">
          <h3 className="font-medium line-clamp-1">{video.title}</h3>
          {video.isShort && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              Short
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-2">{video.channelTitle}</p>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{video.description}</p>
        
        <div className="flex gap-4 text-sm mt-auto">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye size={14} />
            <span>{formatNumber(video.viewCount)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <ThumbsUp size={14} />
            <span>{formatNumber(video.likeCount)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <User size={14} />
            <span>{formatNumber(video.subscriberCount)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar size={14} />
            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Esqueleto de carregamento
const LoadingSkeleton = ({ view }: { view: 'grid' | 'list' }) => {
  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(null).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {Array(4).fill(null).map((_, index) => (
        <div key={index} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
          <Skeleton className="w-40 h-24 rounded-lg flex-shrink-0" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoResults;
