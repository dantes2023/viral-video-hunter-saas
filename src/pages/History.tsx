import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Download, Clock, Trash2, ExternalLink, AlertTriangle, FileDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import VideoResults from "@/components/VideoResults";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Tipo para o histórico de pesquisa
interface SearchHistoryItem {
  id: string;
  keyword: string;
  created_at: string;
  min_views: number;
  min_subscribers: number;
  country: string;
  language: string;
  include_shorts: boolean;
  max_results: number;
  channel_age?: string | null;
}

// Tipo para o resultado de pesquisa
interface SearchResultItem {
  id: string;
  search_id: string;
  video_id: string;
  title: string;
  channel_id: string;
  channel_name: string;
  thumbnail_url: string;
  video_url: string;
  views: number;
  likes: number;
  comments: number;
  subscribers: number;
  published_at: string;
}

// Formatador de data
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [selectedSearch, setSelectedSearch] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Carregar histórico de pesquisas
  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('searches')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setHistory(data as SearchHistoryItem[]);
        }
      } catch (error: any) {
        console.error('Erro ao buscar histórico:', error);
        toast({
          title: "Erro ao carregar histórico",
          description: error.message || "Não foi possível carregar seu histórico de buscas",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchHistory();
  }, [toast]);

  // Filtrar histórico baseado na busca
  const filteredHistory = history.filter(item => 
    item.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Excluir um item do histórico
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('searches')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Também exclui os resultados relacionados
      const { error: resultsError } = await supabase
        .from('search_results')
        .delete()
        .eq('search_id', id);
        
      if (resultsError) {
        console.error('Erro ao excluir resultados:', resultsError);
      }
      
      setHistory(history.filter(item => item.id !== id));
      toast({
        title: "Item excluído",
        description: "O item foi removido do seu histórico de buscas",
      });
    } catch (error: any) {
      console.error('Erro ao excluir item:', error);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o item",
        variant: "destructive",
      });
    }
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Limpar todo o histórico
  const handleClearAll = async () => {
    try {
      // Primeiro excluir todos os resultados
      const { error: resultsError } = await supabase
        .from('search_results')
        .delete()
        .neq('id', 'dummy'); // Deleta todos os registros
        
      if (resultsError) {
        console.error('Erro ao limpar resultados:', resultsError);
      }
      
      // Depois excluir todas as pesquisas
      const { error } = await supabase
        .from('searches')
        .delete()
        .neq('id', 'dummy'); // Deleta todos os registros
        
      if (error) {
        throw error;
      }
      
      setHistory([]);
      toast({
        title: "Histórico limpo",
        description: "Seu histórico de buscas foi completamente apagado",
      });
    } catch (error: any) {
      console.error('Erro ao limpar histórico:', error);
      toast({
        title: "Erro ao limpar histórico",
        description: error.message || "Não foi possível limpar o histórico",
        variant: "destructive",
      });
    }
    
    setDeleteDialogOpen(false);
  };

  // Repetir a busca
  const handleRepeatSearch = (item: SearchHistoryItem) => {
    // Navegar para o dashboard com os parâmetros da busca
    navigate('/dashboard', { 
      state: { 
        searchParams: {
          keyword: item.keyword,
          minViews: item.min_views,
          minSubscribers: item.min_subscribers,
          country: item.country,
          language: item.language,
          includeShorts: item.include_shorts,
          maxResults: item.max_results,
          channelAge: item.channel_age
        }
      } 
    });
  };
  
  // Função para visualizar resultados salvos
  const handleViewResults = async (searchId: string) => {
    try {
      setSelectedSearch(searchId);
      
      const { data, error } = await supabase
        .from('search_results')
        .select('*')
        .eq('search_id', searchId);
        
      if (error) {
        throw error;
      }
      
      // Formatando os resultados para o formato esperado pelo VideoResults
      const formattedResults = data.map((item: SearchResultItem) => ({
        id: item.video_id,
        title: item.title,
        channelTitle: item.channel_name,
        thumbnail: item.thumbnail_url,
        viewCount: item.views,
        likeCount: item.likes,
        subscriberCount: item.subscribers,
        publishedAt: item.published_at,
      }));
      
      setSearchResults(formattedResults);
      setResultsDialogOpen(true);
      
      if (formattedResults.length === 0) {
        toast({
          title: "Sem resultados salvos",
          description: "Esta pesquisa não tem resultados salvos no banco de dados.",
        });
      }
    } catch (error: any) {
      console.error('Erro ao buscar resultados:', error);
      toast({
        title: "Erro ao buscar resultados",
        description: error.message || "Não foi possível buscar os resultados desta pesquisa",
        variant: "destructive",
      });
    }
  };
  
  // Exportar os resultados de uma pesquisa
  const handleExportResults = async (searchId: string, keyword: string) => {
    try {
      // Buscar os resultados da pesquisa
      const { data, error } = await supabase
        .from('search_results')
        .select('*')
        .eq('search_id', searchId);
        
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        toast({
          title: "Sem dados para exportar",
          description: "Esta pesquisa não tem resultados salvos que possam ser exportados.",
        });
        return;
      }
      
      // Formatar os dados para CSV
      const headers = [
        'Título', 
        'Canal', 
        'Visualizações', 
        'Likes', 
        'Comentários', 
        'Inscritos',
        'Data de Publicação',
        'Link do Vídeo'
      ].join(',');
      
      const rows = data.map((item: SearchResultItem) => [
        `"${item.title.replace(/"/g, '""')}"`, // Escapa aspas duplas para CSV
        `"${item.channel_name}"`,
        item.views,
        item.likes,
        item.comments,
        item.subscribers,
        new Date(item.published_at).toLocaleDateString('pt-BR'),
        `"https://youtube.com/watch?v=${item.video_id}"`
      ].join(','));
      
      const csvContent = [headers, ...rows].join('\n');
      
      // Criar um arquivo para download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Criar link para download
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `resultados_${keyword}_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      
      // Iniciar download e limpar
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Exportação concluída",
        description: "Os resultados foram exportados com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao exportar resultados:', error);
      toast({
        title: "Erro na exportação",
        description: error.message || "Não foi possível exportar os resultados",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="flex-grow container px-4 md:px-6 py-8">
          <h1 className="text-3xl font-bold mb-6">Histórico de Buscas</h1>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="flex-grow container px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Histórico de Buscas</h1>
        
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Buscar no histórico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-1"
                disabled={history.length === 0}
              >
                <Trash2 size={16} />
                <span>Limpar histórico</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Limpar histórico de buscas?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Todo o seu histórico de buscas será excluído permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll} className="bg-red-500 hover:bg-red-600">
                  Limpar histórico
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700">
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="mt-3 text-lg font-medium">Nenhum histórico de busca</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Seu histórico de buscas aparecerá aqui quando você fizer pesquisas.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link to="/dashboard">Ir para o Dashboard</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Palavra-chave</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="hidden md:table-cell">Filtros</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item) => (
                    <TableRow key={item.id} 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => handleViewResults(item.id)}
                    >
                      <TableCell className="font-medium">{item.keyword}</TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs">
                            {item.country}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs">
                            +{item.min_views.toLocaleString()} views
                          </span>
                          {!item.include_shorts && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs">
                              No Shorts
                            </span>
                          )}
                          {item.channel_age && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs">
                              Idade: {item.channel_age}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRepeatSearch(item);
                            }}
                            title="Repetir busca"
                          >
                            <ExternalLink size={14} />
                            <span className="sr-only">Repetir busca</span>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportResults(item.id, item.keyword);
                            }}
                            title="Exportar resultados"
                          >
                            <FileDown size={14} />
                            <span className="sr-only">Exportar</span>
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-500 border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700"
                                onClick={(e) => e.stopPropagation()}
                                title="Excluir"
                              >
                                <Trash2 size={14} />
                                <span className="sr-only">Excluir</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir este item do histórico?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Este item será excluído permanentemente do seu histórico.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredHistory.length === 0 && (
              <div className="p-8 text-center">
                <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500" />
                <h3 className="mt-2 text-sm font-medium">Nenhum resultado encontrado</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tente ajustar seu termo de busca para encontrar o que está procurando.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Dialog para exibir resultados da pesquisa */}
        <Dialog open={resultsDialogOpen} onOpenChange={setResultsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Resultados da pesquisa</DialogTitle>
              <DialogDescription>
                Resultados salvos desta pesquisa.
              </DialogDescription>
            </DialogHeader>
            
            {searchResults.length > 0 ? (
              <VideoResults videos={searchResults} />
            ) : (
              <div className="py-8 text-center">
                <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500" />
                <h3 className="mt-2 text-sm font-medium">Nenhum resultado encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Esta pesquisa não possui resultados salvos.
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default History;
