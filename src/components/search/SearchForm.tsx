
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import FilterPopover, { SearchFilters } from './FilterPopover';
import { searchVideos, saveSearchToHistory, saveSearchResults } from '@/services/SearchService';

interface SearchFormProps {
  onSearch: (filters: any, results: any[], loading: boolean) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<SearchFilters>({
    minViews: 10000,
    maxViews: null,
    maxResults: 20,
    minSubscribers: 1000,
    maxSubscribers: null,
    language: 'pt',
    country: 'BR',
    includeShorts: true,
    sortBy: 'relevance',
    channelAge: null
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      toast({
        title: "Palavra-chave necessária",
        description: "Digite uma palavra-chave para pesquisar vídeos",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    onSearch({ keyword, ...filters }, [], true);
    
    try {
      // Buscar vídeos usando o serviço
      const results = await searchVideos({ keyword, filters });
      
      // Salvar pesquisa no histórico e obter o ID da pesquisa
      console.log("Salvando pesquisa no histórico...");
      const searchId = await saveSearchToHistory(user?.id, keyword, filters);
      console.log("ID da pesquisa:", searchId);
      
      // Salvar resultados da pesquisa se tiver um ID de pesquisa
      if (searchId) {
        console.log(`Tentando salvar ${results.length} resultados para a pesquisa ${searchId}`);
        const saved = await saveSearchResults(searchId, results);
        
        if (!saved) {
          toast({
            title: "Atenção",
            description: "Os resultados foram encontrados mas não puderam ser salvos no histórico.",
            variant: "default",
          });
        } else {
          console.log('Resultados da pesquisa salvos com sucesso!');
          toast({
            title: "Sucesso",
            description: `${results.length} resultados salvos no histórico.`,
          });
        }
      } else {
        console.log("Não foi possível obter um ID de pesquisa válido");
        if (user?.id) {
          toast({
            title: "Atenção",
            description: "Não foi possível salvar a pesquisa no histórico.",
            variant: "default",
          });
        }
      }
      
      // Transformar resultados no formato esperado pelo VideoResults
      const formattedResults = results.map((item: any) => ({
        id: item.id,
        title: item.title,
        channelTitle: item.channelTitle,
        thumbnail: item.thumbnails.medium?.url || item.thumbnails.default?.url,
        viewCount: item.viewCount,
        likeCount: item.likeCount,
        subscriberCount: item.subscriberCount,
        publishedAt: item.publishedAt,
        description: item.description,
        isShort: item.isShort
      }));
      
      // Atualizar os resultados no componente pai
      onSearch({ keyword, ...filters }, formattedResults, false);
      
      if (formattedResults.length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Tente ajustar seus filtros ou usar uma palavra-chave diferente.",
        });
      }
    } catch (error: any) {
      console.error('Erro ao buscar vídeos:', error);
      toast({
        title: "Erro na pesquisa",
        description: error.message || "Ocorreu um erro durante a pesquisa. Tente novamente.",
        variant: "destructive",
      });
      onSearch({ keyword, ...filters }, [], false);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Buscar vídeos virais..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-10 h-12 rounded-lg"
            />
          </div>
          
          <FilterPopover 
            filters={filters}
            onChange={handleFilterChange}
            open={showFilters}
            onOpenChange={setShowFilters}
          />
          
          <Button 
            type="submit" 
            className="h-12 px-6 bg-brand-500 hover:bg-brand-600"
            disabled={isSearching}
          >
            {isSearching ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
