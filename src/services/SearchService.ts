
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
  console.log("Enviando filtros para API:", JSON.stringify(filters, null, 2));
  
  const { data, error } = await supabase.functions.invoke('youtube-search', {
    body: { 
      keyword, 
      minViews: filters.minViews,  // Já é número ou null
      maxViews: filters.maxViews,  // Já é número ou null
      minSubscribers: filters.minSubscribers, // Já é número ou null
      maxSubscribers: filters.maxSubscribers, // Já é número ou null
      includeShorts: filters.includeShorts,
      maxResults: filters.maxResults ? Number(filters.maxResults) : null,
      country: filters.country,
      language: filters.language,
      sortBy: filters.sortBy,
      channelAge: filters.channelAge
    }
  });

  if (error) {
    console.error('Erro ao buscar vídeos:', error);
    throw new Error(error.message || 'Erro ao buscar vídeos');
  }

  if (!data.success) {
    console.error('Erro na resposta da API:', data.error);
    throw new Error(data.error || 'Erro ao buscar vídeos');
  }

  return data.results;
};

export const saveSearchToHistory = async (
  userId: string | undefined, 
  keyword: string, 
  filters: SearchFilters
): Promise<string | null> => {
  if (!userId) {
    console.log("Usuário não está autenticado, não será salvo no histórico");
    return null;
  }
  
  try {
    console.log("Iniciando salvamento no histórico para usuário:", userId);
    console.log("Filtros recebidos:", filters);
    
    // Preparando dados para inserção
    const searchData = {
      user_id: userId,
      keyword,
      min_views: filters.minViews ? Number(filters.minViews) : null,
      min_subscribers: filters.minSubscribers ? Number(filters.minSubscribers) : null,
      country: filters.country || null,
      language: filters.language || null,
      include_shorts: filters.includeShorts !== undefined ? filters.includeShorts : null,
      max_results: filters.maxResults ? Number(filters.maxResults) : null,
      // Converter channel_age para número se não for nulo
      channel_age: filters.channelAge ? 
        Number(filters.channelAge.replace(/\D/g, '')) : null
    };
    
    console.log("Dados preparados para inserção:", searchData);
    
    const { data, error } = await supabase
      .from('searches')
      .insert(searchData)
      .select('id')
      .single();
      
    if (error) {
      console.error('Erro ao salvar pesquisa no histórico:', error);
      return null;
    }
    
    console.log("Pesquisa salva com sucesso, ID:", data?.id);
    return data?.id || null;
  } catch (error) {
    console.error('Exceção ao inserir pesquisa:', error);
    return null;
  }
};

export const saveSearchResults = async (
  searchId: string | null, 
  results: SearchResult[]
): Promise<boolean> => {
  if (!searchId) {
    console.log("ID de pesquisa não disponível, resultados não serão salvos");
    return false;
  }
  
  if (!results || results.length === 0) {
    console.log("Nenhum resultado para salvar");
    return false;
  }
  
  try {
    console.log(`Tentando salvar ${results.length} resultados para a pesquisa ${searchId}`);
    
    // Verificando a estrutura dos resultados
    console.log("Amostra do primeiro resultado:", JSON.stringify(results[0], null, 2));
    
    // Criando lotes de 50 resultados para evitar problemas com tamanho de payload
    const batchSize = 50;
    const batches = [];

    // Dividir os resultados em lotes
    for (let i = 0; i < results.length; i += batchSize) {
      batches.push(results.slice(i, i + batchSize));
    }

    console.log(`Dividindo ${results.length} resultados em ${batches.length} lotes de até ${batchSize} itens`);
    
    // Processar cada lote separadamente
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`Processando lote ${batchIndex + 1} com ${batch.length} resultados`);
      
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
      
      console.log(`Lote ${batchIndex + 1} formatado, exemplo:`, JSON.stringify(formattedResults[0], null, 2));
      
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
