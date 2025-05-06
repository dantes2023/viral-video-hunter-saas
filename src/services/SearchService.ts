
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
    // Fix: Convert minViews and minSubscribers to numbers
    const { data, error } = await supabase
      .from('searches')
      .insert({
        user_id: userId,
        keyword,
        min_views: filters.minViews ? Number(filters.minViews) : null,
        min_subscribers: filters.minSubscribers ? Number(filters.minSubscribers) : null,
        country: filters.country,
        language: filters.language,
        include_shorts: filters.includeShorts,
        max_results: filters.maxResults ? Number(filters.maxResults) : null,
        channel_age: filters.channelAge ? Number(filters.channelAge) : null
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
    return false;
  }
  
  try {
    const formattedResults = results.map(item => ({
      search_id: searchId,
      video_id: item.id || null,
      title: item.title || 'Sem título',
      channel_id: item.channelId || null,
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
      console.error('Erro ao salvar resultados da pesquisa:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao formatar/inserir resultados:', error);
    return false;
  }
};
