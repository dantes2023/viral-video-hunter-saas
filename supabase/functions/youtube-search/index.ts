
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
      sortBy,
      channelAge
    } = await req.json();

    if (!keyword) {
      throw new Error("Palavra-chave é obrigatória");
    }

    console.log("Recebendo filtros:", {
      minViews, maxViews, minSubscribers, maxSubscribers, includeShorts, channelAge
    });

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

    // Se tiver filtro de idade do canal, calcula a data máxima de criação
    let channelMaxDate = null;
    if (channelAge) {
      const now = new Date();
      
      // Baseado no valor do channelAge, calcula a data limite
      if (channelAge === "1day") {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        channelMaxDate = yesterday;
      } else if (channelAge === "7days") {
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        channelMaxDate = lastWeek;
      } else if (channelAge === "15days") {
        const twoWeeksAgo = new Date(now);
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 15);
        channelMaxDate = twoWeeksAgo;
      } else if (channelAge === "30days") {
        const monthAgo = new Date(now);
        monthAgo.setDate(monthAgo.getDate() - 30);
        channelMaxDate = monthAgo;
      } else if (channelAge === "2months") {
        const twoMonthsAgo = new Date(now);
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        channelMaxDate = twoMonthsAgo;
      } else if (channelAge === "3months") {
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        channelMaxDate = threeMonthsAgo;
      }
      console.log("Data limite calculada para idade do canal:", channelMaxDate);
    }

    console.log("Buscando vídeos com:", keyword);
    const searchResponse = await fetch(searchUrl.toString());
    
    if (!searchResponse.ok) {
      throw new Error(`Erro na API do YouTube: ${await searchResponse.text()}`);
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      console.log("Nenhum vídeo encontrado na pesquisa inicial");
      return new Response(
        JSON.stringify({ 
          success: true, 
          count: 0,
          results: [] 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }
    
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
    
    if (!videosData.items || videosData.items.length === 0) {
      console.log("Nenhum detalhe de vídeo encontrado");
      return new Response(
        JSON.stringify({ 
          success: true, 
          count: 0,
          results: [] 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    // Para cada vídeo, precisamos buscar as informações do canal
    const channelIds = [...new Set(videosData.items.map((item: any) => item.snippet.channelId))].join(",");
    const channelsUrl = new URL(`${YOUTUBE_API_BASE_URL}/channels`);
    channelsUrl.searchParams.append("part", "snippet,statistics,contentDetails");
    channelsUrl.searchParams.append("id", channelIds);
    channelsUrl.searchParams.append("key", YOUTUBE_API_KEY || "");

    console.log("Buscando informações dos canais");
    const channelsResponse = await fetch(channelsUrl.toString());
    
    if (!channelsResponse.ok) {
      throw new Error(`Erro na API do YouTube: ${await channelsResponse.text()}`);
    }
    
    const channelsData = await channelsResponse.json();
    
    if (!channelsData.items) {
      console.log("Nenhuma informação de canal encontrada");
      return new Response(
        JSON.stringify({ 
          success: true, 
          count: 0,
          results: [] 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }
    
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
      
      // Informações do canal, incluindo data de criação
      const channelPublishedAt = channel?.snippet?.publishedAt;

      return {
        id: video.id,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        channelId: video.snippet.channelId,
        channelPublishedAt: channelPublishedAt,
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

    console.log(`Resultados antes de aplicar filtros: ${results.length}`);
    
    // Log de valores antes da filtragem para ajudar na depuração
    console.log(`Aplicando filtros - Min views: ${minViews}, Max views: ${maxViews}, Min subs: ${minSubscribers}, Max subs: ${maxSubscribers}`);
    
    // Debug: verificar valores convertidos corretamente
    const numMinViews = minViews !== null ? Number(minViews) : null;
    const numMaxViews = maxViews !== null ? Number(maxViews) : null;
    const numMinSubs = minSubscribers !== null ? Number(minSubscribers) : null;
    const numMaxSubs = maxSubscribers !== null ? Number(maxSubscribers) : null;
    
    console.log("Valores convertidos para número:", {
      numMinViews, numMaxViews, numMinSubs, numMaxSubs
    });

    // Aplicar filtros
    if (numMinViews !== null) {
      results = results.filter(video => video.viewCount >= numMinViews);
      console.log(`Após filtro minViews (${numMinViews}): ${results.length} resultados`);
    }
    
    if (numMaxViews !== null) {
      // FIX: Se os valores mínimo e máximo forem iguais, não devemos fazer uma comparação estrita
      if (numMinViews === numMaxViews && numMaxViews !== null) {
        // Para valores iguais, usamos uma faixa pequena em torno do valor para evitar resultados zero
        const tolerance = numMaxViews * 0.1; // 10% de tolerância
        results = results.filter(video => 
          video.viewCount >= numMaxViews - tolerance && 
          video.viewCount <= numMaxViews + tolerance
        );
        console.log(`Após filtro maxViews (igual a minViews com tolerância): ${results.length} resultados`);
      } else {
        // Filtro normal para valores diferentes
        results = results.filter(video => video.viewCount <= numMaxViews);
        console.log(`Após filtro maxViews (${numMaxViews}): ${results.length} resultados`);
      }
    }
    
    if (numMinSubs !== null) {
      results = results.filter(video => video.subscriberCount >= numMinSubs);
      console.log(`Após filtro minSubscribers (${numMinSubs}): ${results.length} resultados`);
    }
    
    if (numMaxSubs !== null) {
      results = results.filter(video => video.subscriberCount <= numMaxSubs);
      console.log(`Após filtro maxSubscribers (${numMaxSubs}): ${results.length} resultados`);
    }
    
    if (includeShorts === false) {
      results = results.filter(video => !video.isShort);
      console.log(`Após filtro includeShorts: ${results.length} resultados`);
    }
    
    // Filtro de idade do canal - FIX: Corrigido para mostrar canais MAIS ANTIGOS que o limite
    if (channelMaxDate) {
      console.log("Aplicando filtro de idade do canal, data limite:", channelMaxDate);
      
      results = results.filter(video => {
        if (!video.channelPublishedAt) return false; // Se não tiver informação, exclui
        
        // CORREÇÃO: Estamos procurando canais MAIS ANTIGOS que a data limite
        // Ou seja, canais criados ANTES da data limite (channelMaxDate)
        const channelDate = new Date(video.channelPublishedAt);
        const isOlderThanLimit = channelDate <= channelMaxDate;
        
        if (!isOlderThanLimit) {
          console.log(`Canal ${video.channelTitle} (${video.channelPublishedAt}) é mais recente que ${channelMaxDate}`);
        } else {
          console.log(`Canal ${video.channelTitle} (${video.channelPublishedAt}) é mais antigo que ${channelMaxDate}`);
        }
        
        return isOlderThanLimit;
      });
      console.log(`Após filtro channelAge: ${results.length} resultados`);
    }

    // Aplicar ordenação conforme solicitado
    if (sortBy === "views") {
      results = results.sort((a, b) => b.viewCount - a.viewCount);
    } else if (sortBy === "subscribers") {
      results = results.sort((a, b) => b.subscriberCount - a.subscriberCount);
    }
    // Se for "relevance", não precisamos ordenar pois a API já retorna em ordem de relevância

    console.log(`Encontrados ${results.length} resultados após filtragem`);

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
