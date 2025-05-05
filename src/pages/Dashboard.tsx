
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, TrendingUp, BarChart2, Clock } from 'lucide-react';
import Navigation from "@/components/Navigation";
import SearchForm from "@/components/SearchForm";
import VideoResults, { VideoData } from "@/components/VideoResults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [keyword, setKeyword] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Manipula a busca
  const handleSearch = (filters: any) => {
    console.log('Searching with filters:', filters);
    setKeyword(filters.keyword);
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulação de chamada de API
    setTimeout(() => {
      setVideos(mockVideos);
      setIsLoading(false);
    }, 1500);
  };

  // Cálculo das estatísticas de resumo (baseado nos dados mock)
  const stats = {
    totalViews: mockVideos.reduce((sum, video) => sum + video.viewCount, 0),
    avgLikes: Math.round(mockVideos.reduce((sum, video) => sum + video.likeCount, 0) / mockVideos.length),
    avgSubscribers: Math.round(mockVideos.reduce((sum, video) => sum + video.subscriberCount, 0) / mockVideos.length),
    totalShorts: mockVideos.filter(v => v.isShort).length
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="flex-grow container px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {/* Status Cards */}
        {hasSearched && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Visualizações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{formatNumber(stats.totalViews)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Média de Likes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{formatNumber(stats.avgLikes)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Média de Inscritos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart2 className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{formatNumber(stats.avgSubscribers)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Shorts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{stats.totalShorts}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Search Form */}
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} />
        </div>
        
        {/* Results or Initial State */}
        {hasSearched ? (
          <VideoResults 
            isLoading={isLoading} 
            videos={videos} 
            keyword={keyword}
          />
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Search className="h-10 w-10 text-brand-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Comece uma busca</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Use o formulário acima para buscar vídeos virais por palavra-chave e filtros avançados
            </p>
            <div className="inline-flex items-center text-sm text-brand-500 hover:text-brand-600">
              <Link to="/history">Ver histórico de buscas</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
