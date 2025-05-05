
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Download, Clock, Trash2, ExternalLink, AlertTriangle, FileDown } from 'lucide-react';
import Navigation from "@/components/Navigation";
import VideoResults from "@/components/VideoResults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VideoData } from '@/components/VideoResults';

// Tipo para o histórico de pesquisa
interface SearchHistoryItem {
  id: string;
  user_id: string;
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
interface SearchResult {
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

const History = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<SearchHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearchId, setCurrentSearchId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openResultsDialog, setOpenResultsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedSearchKeyword, setSelectedSearchKeyword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Buscar histórico de pesquisas
  useEffect(() => {
    const fetchHistory = async () => {
      try {
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
          description: error.message || "Não foi possível carregar seu histórico de pesquisas.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, [toast]);
  
  // Filtrar histórico com base na pesquisa
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter(item => 
        item.keyword.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  }, [searchQuery, history]);
  
  // Buscar resultados de uma pesquisa específica
  const fetchSearchResults = async (searchId: string, keyword: string) => {
    setIsLoading(true);
    setSelectedSearchKeyword(keyword);
    
    try {
      const { data, error } = await supabase
        .from('search_results')
        .select('*')
        .eq('search_id', searchId);
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transformar resultados no formato esperado pelo VideoResults
        const formattedResults = data.map((item: SearchResult) => ({
          id: item.video_id,
          title: item.title,
          channelTitle: item.channel_name,
          thumbnail: item.thumbnail_url,
          viewCount: item.views,
          likeCount: item.likes,
          subscriberCount: item.subscribers,
          publishedAt: item.published_at,
          description: '', // Não temos isso salvo
          isShort: false // Não temos isso salvo
        }));
        
        setSearchResults(formattedResults);
        setCurrentSearchId(searchId);
        setOpenResultsDialog(true);
      }
    } catch (error: any) {
      console.error('Erro ao buscar resultados:', error);
      toast({
        title: "Erro ao carregar resultados",
        description: error.message || "Não foi possível carregar os resultados desta pesquisa.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Deletar uma pesquisa
  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      // Primeiro excluir resultados relacionados
      const { error: resultsError } = await supabase
        .from('search_results')
        .delete()
        .eq('search_id', deleteId);
        
      if (resultsError) {
        throw resultsError;
      }
      
      // Depois excluir a pesquisa
      const { error } = await supabase
        .from('searches')
        .delete()
        .eq('id', deleteId);
        
      if (error) {
        throw error;
      }
      
      // Atualizar o estado para remover o item excluído
      setHistory(prev => prev.filter(item => item.id !== deleteId));
      
      toast({
        title: "Pesquisa excluída",
        description: "A pesquisa foi excluída com sucesso do seu histórico.",
      });
    } catch (error: any) {
      console.error('Erro ao excluir pesquisa:', error);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir esta pesquisa.",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
      setOpenDeleteDialog(false);
    }
  };
  
  // Abrir o diálogo de confirmação de exclusão
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };
  
  // Repetir uma pesquisa
  const repeatSearch = (item: SearchHistoryItem) => {
    navigate('/dashboard', { 
      state: { 
        keyword: item.keyword,
        filters: {
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
  
  // Exportar resultados para CSV
  const exportToCSV = async (searchId: string, keyword: string) => {
    try {
      const { data, error } = await supabase
        .from('search_results')
        .select('*')
        .eq('search_id', searchId);
        
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        toast({
          title: "Nenhum resultado para exportar",
          description: "Esta pesquisa não possui resultados salvos para exportação.",
        });
        return;
      }
      
      // Função para formatar números com separadores de milhares
      const formatNumber = (num: number) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      };
      
      // Criar cabeçalho do CSV
      const csvHeader = "Título,Canal,Views,Likes,Comentários,Inscritos,Data de Publicação,Link\n";
      
      // Criar linhas do CSV
      const csvRows = data.map((item: SearchResult) => {
        const title = item.title.replace(/,/g, ' '); // Remover vírgulas do título
        const channelName = item.channel_name.replace(/,/g, ' '); // Remover vírgulas do nome do canal
        const views = formatNumber(item.views);
        const likes = formatNumber(item.likes);
        const comments = formatNumber(item.comments);
        const subscribers = formatNumber(item.subscribers);
        const publishDate = format(new Date(item.published_at), 'dd/MM/yyyy', { locale: ptBR });
        
        return `"${title}","${channelName}",${views},${likes},${comments},${subscribers},${publishDate},${item.video_url}`;
      }).join('\n');
      
      // Combinar cabeçalho e linhas
      const csvContent = csvHeader + csvRows;
      
      // Criar blob e link para download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Configurar e clicar no link
      link.setAttribute('href', url);
      link.setAttribute('download', `resultados_${keyword.replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Exportação concluída",
        description: "Os resultados foram exportados com sucesso para CSV.",
      });
    } catch (error: any) {
      console.error('Erro ao exportar resultados:', error);
      toast({
        title: "Erro na exportação",
        description: error.message || "Não foi possível exportar os resultados desta pesquisa.",
        variant: "destructive",
      });
    }
  };
  
  // Formatar data
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  };
  
  // Exibir mensagem de carregamento
  if (isLoading && history.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="flex-grow container px-4 md:px-6 py-8">
          <h1 className="text-3xl font-bold mb-6">Histórico de Buscas</h1>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-lg text-muted-foreground">Carregando histórico...</p>
            </div>
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
        
        {/* Barra de pesquisa */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input 
              type="text" 
              placeholder="Filtrar histórico por palavra-chave..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-lg"
            />
          </div>
        </div>
        
        {/* Tabela de histórico */}
        {filteredHistory.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Palavra-chave</TableHead>
                    <TableHead className="hidden md:table-cell">Data</TableHead>
                    <TableHead className="hidden lg:table-cell">Filtros</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <button 
                          onClick={() => fetchSearchResults(item.id, item.keyword)}
                          className="text-left hover:text-brand-500 hover:underline transition-colors"
                        >
                          {item.keyword}
                        </button>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {formatDate(item.created_at)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {item.min_views > 0 && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800">
                              {item.min_views.toLocaleString()}+ views
                            </span>
                          )}
                          {item.min_subscribers > 0 && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800">
                              {item.min_subscribers.toLocaleString()}+ inscritos
                            </span>
                          )}
                          {item.channel_age && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800">
                              {(() => {
                                switch(item.channel_age) {
                                  case '1day': return 'Último dia';
                                  case '7days': return 'Últimos 7 dias';
                                  case '15days': return 'Últimos 15 dias';
                                  case '30days': return 'Último mês';
                                  case '2months': return 'Últimos 2 meses';
                                  case '3months': return 'Últimos 3 meses';
                                  default: return item.channel_age;
                                }
                              })()}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => fetchSearchResults(item.id, item.keyword)}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Ver resultados
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => repeatSearch(item)}>
                              <Search className="mr-2 h-4 w-4" />
                              Repetir busca
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportToCSV(item.id, item.keyword)}>
                              <FileDown className="mr-2 h-4 w-4" />
                              Exportar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => confirmDelete(item.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Clock className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              {searchQuery ? "Nenhum resultado encontrado" : "Histórico vazio"}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {searchQuery 
                ? "Tente um termo de busca diferente ou limpe o filtro para ver todo o histórico." 
                : "Você ainda não realizou nenhuma busca. Vá para o Dashboard e comece a buscar vídeos."}
            </p>
            <Button asChild>
              <Link to="/dashboard">Ir para o Dashboard</Link>
            </Button>
          </div>
        )}
      </main>
      
      {/* Modal para exibir resultados */}
      <Dialog open={openResultsDialog} onOpenChange={setOpenResultsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resultados: {selectedSearchKeyword}</DialogTitle>
            <DialogDescription>
              Visualizando os resultados salvos desta pesquisa
            </DialogDescription>
          </DialogHeader>
            
          {searchResults.length > 0 ? (
            <VideoResults videos={searchResults} keyword={selectedSearchKeyword} />
          ) : (
            <div className="py-8 text-center">
              <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500" />
              <h3 className="mt-4 text-lg font-medium">Nenhum resultado salvo</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Não foram encontrados resultados salvos para esta pesquisa.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir esta pesquisa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá excluir permanentemente esta pesquisa e todos os seus resultados salvos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default History;
