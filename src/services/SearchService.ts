
import { supabase } from '@/integrations/supabase/client';
import { SearchFilters } from '@/components/search/FilterPopover';

interface SearchPayload {
  keyword: string;
  filters: SearchFilters;
}

interface SearchResult {
  id: string;
  title: string;
  channelId: string;
  channelTitle: string;
  thumbnails: {
    default?: { url: string };
    medium?: { url: string };
  };
  viewCount: number;
  likeCount: number;
  commentCount: number;
  subscriberCount: number;
  publishedAt: string;
  description: string;
  isShort: boolean;
}

export const searchVideos = async (
  { keyword, filters }: SearchPayload
): Promise<SearchResult[]> => {
  const { data, error } = await supabase.functions.invoke('youtube-search', {
    body: { 
      keyword, 
      minViews: filters.minViews ? Number(filters.minViews) : null,
      maxViews: filters.maxViews ? Number(filters.maxViews) : null,
      minSubscribers: filters.minSubscribers ? Number(filters.minSubscribers) : null,
      maxSubscribers: filters.maxSubscribers ? Number(filters.maxSubscribers) : null,
      includeShorts: filters.includeShorts,
      maxResults: filters.maxResults ? Number(filters.maxResults) : null,
      country: filters.country,
      language: filters.language,
      sortBy: filters.sortBy,
      channelAge: filters.channelAge
    }
  });

  if (error) {
    throw new Error(error.message || 'Erro ao buscar vídeos');
  }

  if (!data.success) {
    throw new Error(data.error || 'Erro ao buscar vídeos');
  }

  return data.results;
};

export const saveSearchToHistory = async (
  userId: string | undefined, 
  keyword: string, 
  filters: SearchFilters
): Promise<string | null> => {
  if (!userId) return null;
  
  try {
    // Corrigindo conversão de tipos para que correspondam aos tipos na tabela
    const { data, error } = await supabase
      .from('searches')
      .insert({
        user_id: userId,
        keyword,
        min_views: filters.minViews ? Number(filters.minViews) : null,
        min_subscribers: filters.minSubscribers ? Number(filters.minSubscribers) : null,
        country: filters.country || null,
        language: filters.language || null,
        include_shorts: filters.includeShorts !== undefined ? filters.includeShorts : null,
        max_results: filters.maxResults ? Number(filters.maxResults) : null,
        channel_age: filters.channelAge ? Number(filters.channelAge.replace(/\D/g, '')) : null
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Erro ao salvar pesquisa no histórico:', error);
      return null;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error('Erro ao inserir pesquisa:', error);
    return null;
  }
};

export const saveSearchResults = async (
  searchId: string | null, 
  results: SearchResult[]
): Promise<boolean> => {
  if (!searchId || !results || results.length === 0) {
    console.log("Nenhum resultado para salvar ou searchId não disponível");
    return false;
  }
  
  try {
    // Criando lotes de 100 resultados para evitar problemas com tamanho de payload
    const batchSize = 100;
    const batches = [];

    // Dividir os resultados em lotes
    for (let i = 0; i < results.length; i += batchSize) {
      batches.push(results.slice(i, i + batchSize));
    }

    console.log(`Salvando ${results.length} resultados em ${batches.length} lotes`);
    
    // Processar cada lote separadamente
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const formattedResults = batch.map(item => ({
        search_id: searchId,
        video_id: item.id || '',
        title: item.title || 'Sem título',
        channel_id: item.channelId || '',
        channel_name: item.channelTitle || 'Canal desconhecido',
        thumbnail_url: item.thumbnails?.medium?.url || item.thumbnails?.default?.url || null,
        video_url: item.id ? `https://youtube.com/watch?v=${item.id}` : null,
        views: item.viewCount || 0,
        likes: item.likeCount || 0,
        comments: item.commentCount || 0,
        subscribers: item.subscriberCount || 0,
        published_at: item.publishedAt || null
      }));
      
      const { error } = await supabase
        .from('search_results')
        .insert(formattedResults);
        
      if (error) {
        console.error(`Erro ao salvar lote ${batchIndex + 1}:`, error);
        return false;
      }

      console.log(`Lote ${batchIndex + 1} salvo com sucesso`);
    }
    
    console.log('Todos os resultados foram salvos com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao formatar/inserir resultados:', error);
    return false;
  }
};
