
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      keyword, 
      minViews, 
      maxViews, 
      minSubscribers, 
      maxSubscribers, 
      includeShorts, 
      maxResults, 
      country, 
      language,
      sortBy 
    } = await req.json();

    if (!keyword) {
      throw new Error("Palavra-chave é obrigatória");
    }

    // Primeiro, busca por vídeos com a palavra-chave
    const searchUrl = new URL(`${YOUTUBE_API_BASE_URL}/search`);
    searchUrl.searchParams.append("part", "snippet");
    searchUrl.searchParams.append("q", keyword);
    searchUrl.searchParams.append("type", "video");
    searchUrl.searchParams.append("maxResults", (maxResults || 20).toString());
    searchUrl.searchParams.append("key", YOUTUBE_API_KEY || "");
    
    if (country) {
      searchUrl.searchParams.append("regionCode", country);
    }
    
    if (language) {
      searchUrl.searchParams.append("relevanceLanguage", language);
    }

    console.log("Buscando vídeos com:", keyword);
    const searchResponse = await fetch(searchUrl.toString());
    
    if (!searchResponse.ok) {
      throw new Error(`Erro na API do YouTube: ${await searchResponse.text()}`);
    }
    
    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",");

    // Em seguida, busca estatísticas detalhadas para os vídeos encontrados
    const videosUrl = new URL(`${YOUTUBE_API_BASE_URL}/videos`);
    videosUrl.searchParams.append("part", "snippet,statistics,contentDetails");
    videosUrl.searchParams.append("id", videoIds);
    videosUrl.searchParams.append("key", YOUTUBE_API_KEY || "");

    console.log("Buscando detalhes dos vídeos");
    const videosResponse = await fetch(videosUrl.toString());
    
    if (!videosResponse.ok) {
      throw new Error(`Erro na API do YouTube: ${await videosResponse.text()}`);
    }
    
    const videosData = await videosResponse.json();

    // Para cada vídeo, precisamos buscar as informações do canal
    const channelIds = [...new Set(videosData.items.map((item: any) => item.snippet.channelId))].join(",");
    const channelsUrl = new URL(`${YOUTUBE_API_BASE_URL}/channels`);
    channelsUrl.searchParams.append("part", "snippet,statistics");
    channelsUrl.searchParams.append("id", channelIds);
    channelsUrl.searchParams.append("key", YOUTUBE_API_KEY || "");

    console.log("Buscando informações dos canais");
    const channelsResponse = await fetch(channelsUrl.toString());
    
    if (!channelsResponse.ok) {
      throw new Error(`Erro na API do YouTube: ${await channelsResponse.text()}`);
    }
    
    const channelsData = await channelsResponse.json();
    
    // Criar um mapa de canais para fácil acesso
    const channelsMap = channelsData.items.reduce((acc: any, channel: any) => {
      acc[channel.id] = channel;
      return acc;
    }, {});

    // Processar os resultados
    let results = videosData.items.map((video: any) => {
      const channel = channelsMap[video.snippet.channelId];
      const duration = video.contentDetails.duration;
      const isShort = isDurationShort(duration); // Verifica se é um Short (menos de 60 segundos)
      
      const viewCount = parseInt(video.statistics.viewCount || "0", 10);
      const subscriberCount = parseInt(channel?.statistics?.subscriberCount || "0", 10);

      return {
        id: video.id,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        channelId: video.snippet.channelId,
        thumbnails: video.snippet.thumbnails,
        publishedAt: video.snippet.publishedAt,
        viewCount: viewCount,
        likeCount: parseInt(video.statistics.likeCount || "0", 10),
        commentCount: parseInt(video.statistics.commentCount || "0", 10),
        subscriberCount: subscriberCount,
        description: video.snippet.description,
        isShort: isShort,
        duration: duration
      };
    });

    // Aplicar filtros
    if (minViews) {
      results = results.filter(video => video.viewCount >= minViews);
    }
    
    if (maxViews) {
      results = results.filter(video => video.viewCount <= maxViews);
    }
    
    if (minSubscribers) {
      results = results.filter(video => video.subscriberCount >= minSubscribers);
    }
    
    if (maxSubscribers) {
      results = results.filter(video => video.subscriberCount <= maxSubscribers);
    }
    
    if (includeShorts === false) {
      results = results.filter(video => !video.isShort);
    }

    // Aplicar ordenação conforme solicitado
    if (sortBy === "views") {
      results = results.sort((a, b) => b.viewCount - a.viewCount);
    } else if (sortBy === "subscribers") {
      results = results.sort((a, b) => b.subscriberCount - a.subscriberCount);
    }
    // Se for "relevance", não precisamos ordenar pois a API já retorna em ordem de relevância

    console.log(`Encontrados ${results.length} resultados após filtragem`);

    // Salvar a pesquisa e resultados no banco de dados (opcional)
    // Isso pode ser implementado posteriormente

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: results.length,
        results 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Erro na função youtube-search:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});

// Função auxiliar para verificar se a duração é de um Short (menos de 60 segundos)
function isDurationShort(isoDuration: string) {
  // Formato: PT#H#M#S
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) return false;
  
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds <= 60;
}
