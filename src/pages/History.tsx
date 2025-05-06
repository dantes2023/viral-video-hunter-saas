import React, { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Search as SearchIcon } from 'lucide-react';
import VideoResults from "@/components/VideoResults";
import SearchTable from "@/components/history/SearchTable";
import EmptyHistory from "@/components/history/EmptyHistory";
import HistoryHeader from "@/components/history/HistoryHeader";
import LoadingState from "@/components/history/LoadingState";
import { SearchHistoryItem } from "@/components/history/types";
import { formatDate, getFilterData } from "@/components/history/utils";
import { AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import VersionBadge from '@/components/VersionBadge';

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="flex-grow container px-4 md:px-6 py-8">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <HistoryHeader 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isBulkDeleteDialogOpen={isBulkDeleteDialogOpen}
              setIsBulkDeleteDialogOpen={setIsBulkDeleteDialogOpen}
              onClearHistory={handleClearHistory}
            />
            <VersionBadge className="ml-2" />
          </div>

          {isLoading ? (
            <LoadingState />
          ) : filteredHistory.length === 0 ? (
            <EmptyHistory searchTerm={searchTerm} />
          ) : (
            <SearchTable 
              items={filteredHistory}
              onViewResults={handleViewResults}
              onDeleteSearch={handleDeleteSearch}
              formatDate={formatDate}
              getFilterData={getFilterData}
            />
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
