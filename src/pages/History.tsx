
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Trash, Download, Search as SearchIcon, ArrowUpRight } from 'lucide-react';
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import VideoResults from "@/components/VideoResults";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Define the interface for search history items
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
  channel_age: string | null; // String | null to match DB
  user_id: string;
}

const History = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSearch, setSelectedSearch] = useState<SearchHistoryItem | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSearchHistory();
    }
  }, [user]);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHistory(searchHistory);
    } else {
      setFilteredHistory(
        searchHistory.filter(item => 
          item.keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, searchHistory]);

  const fetchSearchHistory = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('searches')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching search history:', error);
        toast({
          title: "Erro ao carregar histórico",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Type assertion to ensure data conforms to SearchHistoryItem[]
      const typedData = data as unknown as SearchHistoryItem[];
      setSearchHistory(typedData);
      setFilteredHistory(typedData);
    } catch (error: any) {
      console.error('Error fetching search history:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewResults = async (searchItem: SearchHistoryItem) => {
    setSelectedSearch(searchItem);
    setShowResults(true);
    setResultsLoading(true);
    
    try {
      console.log('Fetching results for search ID:', searchItem.id);
      
      // Verificar se o ID da busca é válido
      if (!searchItem.id) {
        console.error('ID da busca é inválido:', searchItem.id);
        toast({
          title: "Erro ao carregar resultados",
          description: "ID da busca inválido",
          variant: "destructive",
        });
        setSearchResults([]);
        setResultsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('search_results')
        .select('*')
        .eq('search_id', searchItem.id);
        
      if (error) {
        console.error('Error fetching search results:', error);
        toast({
          title: "Erro ao carregar resultados",
          description: error.message,
          variant: "destructive",
        });
        setSearchResults([]);
        setResultsLoading(false);
        return;
      }
      
      console.log('Search results data:', data);
      
      if (!data || data.length === 0) {
        console.log('Nenhum resultado encontrado para esta busca');
        toast({
          title: "Sem resultados",
          description: "Nenhum resultado encontrado para esta busca",
        });
        setSearchResults([]);
        setResultsLoading(false);
        return;
      }
      
      // Transform the data to match VideoData format expected by VideoResults component
      const formattedResults = data.map(item => ({
        id: item.video_id || `video-${Math.random().toString(36).substr(2, 9)}`,
        title: item.title || "Sem título",
        channelTitle: item.channel_name || "Canal desconhecido",
        thumbnail: item.thumbnail_url || "https://via.placeholder.com/480x360",
        viewCount: item.views || 0,
        likeCount: item.likes || 0,
        subscriberCount: item.subscribers || 0,
        publishedAt: item.published_at || new Date().toISOString(),
        description: '',
        isShort: false
      }));
      
      console.log('Formatted results:', formattedResults);
      setSearchResults(formattedResults);
    } catch (error: any) {
      console.error('Error fetching search results:', error);
      toast({
        title: "Erro ao carregar resultados",
        description: error.message,
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setResultsLoading(false);
    }
  };

  const handleDeleteSearch = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSearch = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('searches')
        .delete()
        .eq('id', deleteId);

      if (error) {
        console.error('Error deleting search:', error);
        toast({
          title: "Erro ao apagar pesquisa",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setSearchHistory(prevHistory => prevHistory.filter(item => item.id !== deleteId));
      toast({
        title: "Pesquisa apagada",
        description: "A pesquisa foi removida do seu histórico.",
      });
    } catch (error: any) {
      console.error('Error deleting search:', error);
      toast({
        title: "Erro ao apagar pesquisa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleClearHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('searches')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing search history:', error);
        toast({
          title: "Erro ao limpar histórico",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setSearchHistory([]);
      setFilteredHistory([]);
      toast({
        title: "Histórico limpo",
        description: "Todas as pesquisas foram removidas do seu histórico."
      });
    } catch (error: any) {
      console.error('Error clearing search history:', error);
      toast({
        title: "Erro ao limpar histórico",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsBulkDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const formatFilters = (searchItem: SearchHistoryItem): React.ReactNode => {
    const filterBadges = [];
    
    if (searchItem.country) {
      filterBadges.push(
        <span key="country" className="inline-flex items-center mr-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
          {searchItem.country}
        </span>
      );
    }
    
    if (searchItem.min_views) {
      filterBadges.push(
        <span key="views" className="inline-flex items-center mr-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
          +{new Intl.NumberFormat('pt-BR').format(searchItem.min_views)} views
        </span>
      );
    }
    
    return filterBadges;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="flex-grow container px-4 md:px-6 py-8">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Histórico de Buscas</h1>
            <Link to="/dashboard">
              <Button variant="outline" className="flex gap-2 items-center">
                <ArrowRight size={16} className="rotate-180" />
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>

          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="relative w-full max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar no histórico..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="text-white">
                  Limpar histórico
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Limpar histórico de buscas</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja apagar todo o histórico de buscas? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory}>Limpar histórico</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <SearchIcon className="h-10 w-10 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-lg text-gray-500">Carregando histórico...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-20">
              <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Nenhum histórico encontrado</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm ? "Nenhum resultado encontrado para sua busca." : "Suas buscas serão salvas aqui para facilitar o acesso e a referência futura."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Palavra-chave</TableHead>
                    <TableHead className="w-1/4">Data</TableHead>
                    <TableHead className="w-1/4">Filtros</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell 
                        className="font-medium cursor-pointer hover:text-brand-500 transition-colors"
                        onClick={() => handleViewResults(item)}
                      >
                        {item.keyword}
                      </TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
                      <TableCell>{formatFilters(item)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewResults(item)}
                            className="h-8 w-8"
                            title="Ver resultados"
                          >
                            <ArrowUpRight size={18} />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteSearch(item.id)}
                            title="Apagar busca"
                          >
                            <Trash size={18} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>

      {/* Dialog to display search results */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Resultados da Busca</DialogTitle>
            <DialogDescription>
              Resultados da busca por "{selectedSearch?.keyword}"
            </DialogDescription>
          </DialogHeader>
          {resultsLoading ? (
            <div className="text-center py-10">
              <SearchIcon className="h-10 w-10 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-lg text-gray-500">Carregando resultados...</p>
            </div>
          ) : (
            <VideoResults 
              videos={searchResults} 
              isLoading={resultsLoading} 
              keyword={selectedSearch?.keyword} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir esta pesquisa do histórico?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSearch}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default History;
