import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SearchForm = ({ onSearch }: { onSearch: (filters: any, results: any[], loading: boolean) => void }) => {
  const [keyword, setKeyword] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState({
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
      // Chamar a função Edge do Supabase para buscar vídeos
      const { data, error } = await supabase.functions.invoke('youtube-search', {
        body: { 
          keyword, 
          minViews: filters.minViews,
          maxViews: filters.maxViews,
          minSubscribers: filters.minSubscribers,
          maxSubscribers: filters.maxSubscribers,
          includeShorts: filters.includeShorts,
          maxResults: filters.maxResults,
          country: filters.country,
          language: filters.language,
          sortBy: filters.sortBy,
          channelAge: filters.channelAge
        }
      });
      
      if (error) {
        console.error('Erro ao buscar vídeos:', error);
        toast({
          title: "Erro na pesquisa",
          description: error.message || "Ocorreu um erro durante a pesquisa. Tente novamente.",
          variant: "destructive",
        });
        onSearch({ keyword, ...filters }, [], false);
        return;
      }
      
      if (data.success) {
        console.log('Resultados da pesquisa:', data.results);
        
        // Salvar pesquisa no histórico
        if (user) {
          const { data: searchData, error: searchError } = await supabase
            .from('searches')
            .insert({
              user_id: user.id,
              keyword,
              min_views: filters.minViews,
              min_subscribers: filters.minSubscribers,
              country: filters.country,
              language: filters.language,
              include_shorts: filters.includeShorts,
              max_results: filters.maxResults,
              channel_age: filters.channelAge
            })
            .select('id')
            .single();
            
          if (searchError) {
            console.error('Erro ao salvar pesquisa no histórico:', searchError);
            // Continue with results even if we couldn't save to history
          } else {
            // Salvar resultados da pesquisa - Guard against null searchData
            const searchId = searchData?.id;
            
            if (searchId) {
              const formattedResults = data.results.map((item: any) => ({
                search_id: searchId,
                video_id: item.id,
                title: item.title,
                channel_id: item.channelId,
                channel_name: item.channelTitle,
                thumbnail_url: item.thumbnails.medium?.url || item.thumbnails.default?.url,
                video_url: `https://youtube.com/watch?v=${item.id}`,
                views: item.viewCount,
                likes: item.likeCount,
                comments: item.commentCount,
                subscribers: item.subscriberCount,
                published_at: item.publishedAt
              }));
              
              // Inserir resultados no banco de dados
              if (formattedResults.length > 0) {
                const { error: resultsError } = await supabase
                  .from('search_results')
                  .insert(formattedResults);
                  
                if (resultsError) {
                  console.error('Erro ao salvar resultados da pesquisa:', resultsError);
                } else {
                  console.log('Resultados da pesquisa salvos com sucesso!');
                }
              }
            }
          }
        }
        
        // Transformar resultados no formato esperado pelo VideoResults
        const formattedResults = data.results.map((item: any) => ({
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
      } else {
        toast({
          title: "Erro na pesquisa",
          description: data.error || "Ocorreu um erro durante a pesquisa. Tente novamente.",
          variant: "destructive",
        });
        onSearch({ keyword, ...filters }, [], false);
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
          
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="h-12 px-4 flex gap-2 items-center"
              >
                <Filter size={18} />
                <span className="hidden sm:inline">Filtros</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96">
              <div className="space-y-4">
                <h3 className="font-medium text-lg mb-2">Filtros Avançados</h3>
                
                <div>
                  <label className="text-sm font-medium">Quantidade de resultados</label>
                  <Select 
                    value={filters.maxResults.toString()} 
                    onValueChange={(value) => handleFilterChange('maxResults', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Quantidade de resultados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 vídeos</SelectItem>
                      <SelectItem value="20">20 vídeos</SelectItem>
                      <SelectItem value="50">50 vídeos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Classificar por</label>
                  <Select 
                    value={filters.sortBy} 
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Classificar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevância</SelectItem>
                      <SelectItem value="views">Visualizações</SelectItem>
                      <SelectItem value="subscribers">Inscritos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Visualizações</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Mínimo</label>
                      <Select 
                        value={filters.minViews ? filters.minViews.toString() : "null"} 
                        onValueChange={(value) => handleFilterChange('minViews', value === "null" ? null : parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Mínimo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="null">Sem mínimo</SelectItem>
                          <SelectItem value="1000">1.000+</SelectItem>
                          <SelectItem value="10000">10.000+</SelectItem>
                          <SelectItem value="100000">100.000+</SelectItem>
                          <SelectItem value="1000000">1.000.000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Máximo</label>
                      <Select 
                        value={filters.maxViews ? filters.maxViews.toString() : "null"} 
                        onValueChange={(value) => handleFilterChange('maxViews', value === "null" ? null : parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Máximo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="null">Sem máximo</SelectItem>
                          <SelectItem value="10000">10.000</SelectItem>
                          <SelectItem value="100000">100.000</SelectItem>
                          <SelectItem value="1000000">1.000.000</SelectItem>
                          <SelectItem value="10000000">10.000.000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Inscritos no canal</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Mínimo</label>
                      <Select 
                        value={filters.minSubscribers ? filters.minSubscribers.toString() : "null"} 
                        onValueChange={(value) => handleFilterChange('minSubscribers', value === "null" ? null : parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Mínimo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="null">Sem mínimo</SelectItem>
                          <SelectItem value="1000">1.000+</SelectItem>
                          <SelectItem value="10000">10.000+</SelectItem>
                          <SelectItem value="100000">100.000+</SelectItem>
                          <SelectItem value="1000000">1.000.000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Máximo</label>
                      <Select 
                        value={filters.maxSubscribers ? filters.maxSubscribers.toString() : "null"} 
                        onValueChange={(value) => handleFilterChange('maxSubscribers', value === "null" ? null : parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Máximo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="null">Sem máximo</SelectItem>
                          <SelectItem value="10000">10.000</SelectItem>
                          <SelectItem value="100000">100.000</SelectItem>
                          <SelectItem value="1000000">1.000.000</SelectItem>
                          <SelectItem value="10000000">10.000.000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Idade do canal</label>
                  <Select 
                    value={filters.channelAge || "null"} 
                    onValueChange={(value) => handleFilterChange('channelAge', value === "null" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer idade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Qualquer idade</SelectItem>
                      <SelectItem value="1day">Último dia</SelectItem>
                      <SelectItem value="7days">Últimos 7 dias</SelectItem>
                      <SelectItem value="15days">Últimos 15 dias</SelectItem>
                      <SelectItem value="30days">Últimos 30 dias</SelectItem>
                      <SelectItem value="2months">Últimos 2 meses</SelectItem>
                      <SelectItem value="3months">Últimos 3 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="advanced-filters">
                    <AccordionTrigger className="text-sm font-medium">
                      Filtros avançados
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="text-sm font-medium">País</label>
                          <Select 
                            value={filters.country} 
                            onValueChange={(value) => handleFilterChange('country', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="País" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BR">Brasil</SelectItem>
                              <SelectItem value="US">Estados Unidos</SelectItem>
                              <SelectItem value="ES">Espanha</SelectItem>
                              <SelectItem value="PT">Portugal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Idioma</label>
                          <Select 
                            value={filters.language} 
                            onValueChange={(value) => handleFilterChange('language', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Idioma" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pt">Português</SelectItem>
                              <SelectItem value="en">Inglês</SelectItem>
                              <SelectItem value="es">Espanhol</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="includeShorts"
                            checked={filters.includeShorts}
                            onChange={(e) => handleFilterChange('includeShorts', e.target.checked)}
                            className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                          />
                          <label htmlFor="includeShorts" className="text-sm">
                            Incluir Shorts
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </PopoverContent>
          </Popover>
          
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
