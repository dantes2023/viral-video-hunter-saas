import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ArrowRight, Edit, Trash, Download, ExternalLink } from 'lucide-react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import VideoResults from "@/components/VideoResults";

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
  channel_age: string | null; // Changed from number to string | null to match DB
  user_id: string;
}

const History = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSearch, setSelectedSearch] = useState<SearchHistoryItem | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSearchHistory();
    }
  }, [user]);

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
        return;
      }
      
      setSearchResults(data);
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
  
  const formatFilters = (searchItem: SearchHistoryItem): string => {
    let filters = [];
    if (searchItem.min_views) filters.push(`Min. Views: ${searchItem.min_views}`);
    if (searchItem.min_subscribers) filters.push(`Min. Subscribers: ${searchItem.min_subscribers}`);
    if (searchItem.country) filters.push(`Country: ${searchItem.country}`);
    if (searchItem.language) filters.push(`Language: ${searchItem.language}`);
    if (searchItem.include_shorts) filters.push("Include Shorts");
    if (searchItem.max_results) filters.push(`Max Results: ${searchItem.max_results}`);
    if (searchItem.channel_age) filters.push(`Channel Age: ${searchItem.channel_age}`);
    
    return filters.join(', ');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="flex-grow container px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Histórico de Buscas</h1>
          <Link to="/dashboard">
            <Button variant="outline" className="flex gap-2 items-center">
              <ArrowRight size={16} className="rotate-180" />
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <Search className="h-10 w-10 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-lg text-gray-500">Carregando histórico...</p>
          </div>
        ) : searchHistory.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Nenhum histórico encontrado</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Suas buscas serão salvas aqui para facilitar o acesso e a referência futura.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {searchHistory.map((item) => (
              <Card key={item.id} className="bg-white dark:bg-gray-800 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.keyword}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewResults(item)}
                      className="text-muted-foreground hover:text-brand-500"
                    >
                      <Search size={16} className="mr-2" />
                      Ver Resultados
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900">
                          <Trash size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Apagar pesquisa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza de que deseja apagar esta pesquisa do seu histórico?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <Button variant="destructive" onClick={() => handleDeleteSearch(item.id)}>Apagar</Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Buscado em: {formatDate(item.created_at)}
                    </p>
                    <p>
                      Filtros: {formatFilters(item)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Dialog to display search results */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-[925px]">
          <DialogHeader>
            <DialogTitle>Resultados da Busca</DialogTitle>
            <DialogDescription>
              Resultados da busca por "{selectedSearch?.keyword}"
            </DialogDescription>
          </DialogHeader>
          {resultsLoading ? (
            <div className="text-center py-10">
              <Search className="h-10 w-10 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-lg text-gray-500">Carregando resultados...</p>
            </div>
          ) : (
            <VideoResults videos={searchResults} isLoading={resultsLoading} keyword={selectedSearch?.keyword} />
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
            <AlertDialogTrigger asChild>
              <Button variant="destructive" onClick={confirmDeleteSearch}>Excluir</Button>
            </AlertDialogTrigger>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default History;
