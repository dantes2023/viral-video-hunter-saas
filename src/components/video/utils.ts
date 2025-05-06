
// Formatador de números
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Mock de dados para simulação
export const mockVideos = Array(12).fill(null).map((_, index) => ({
  id: `video-${index}`,
  title: `Vídeo viral ${index + 1}: Como fazer sucesso no YouTube rapidamente`,
  channelTitle: `Canal Criativo ${index + 1}`,
  thumbnail: `https://picsum.photos/seed/${index + 1}/640/360`,
  viewCount: Math.floor(Math.random() * 1000000) + 10000,
  likeCount: Math.floor(Math.random() * 50000) + 1000,
  subscriberCount: Math.floor(Math.random() * 1000000) + 10000,
  publishedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
  description: 'Uma descrição interessante sobre o conteúdo deste vídeo viral que está fazendo sucesso.',
  isShort: index % 3 === 0
}));
