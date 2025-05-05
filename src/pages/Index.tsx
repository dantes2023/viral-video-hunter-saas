
import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Search, BarChart2, FileSpreadsheet, Award, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-hero-pattern py-16 md:py-24 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 space-y-6 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Descubra os vídeos <span className="text-accent2-300">virais</span> antes de todos
              </h1>
              <p className="text-lg md:text-xl text-gray-100 max-w-xl">
                Nossa ferramenta avançada identifica os vídeos com maior potencial de viralização no YouTube, ajudando você a criar conteúdo de sucesso.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="btn-gradient text-lg">
                  <Link to="/register">Começar agora</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Link to="/plans">Ver planos</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative w-full max-w-md">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden dark:bg-gray-800">
                  <div className="p-1">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Search size={20} className="text-brand-500" />
                        <div className="h-6 w-full bg-white dark:bg-gray-600 rounded-md" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="bg-white dark:bg-gray-600 p-2 rounded-lg">
                            <div className="w-full h-20 bg-gray-200 dark:bg-gray-500 rounded mb-2" />
                            <div className="h-3 w-full bg-gray-200 dark:bg-gray-500 rounded mb-1" />
                            <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-500 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-accent2-500 rounded-full opacity-60 blur-xl" />
                <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-brand-500 rounded-full opacity-60 blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 gradient-text">Recursos poderosos</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Ferramentas avançadas para identificar tendências e vídeos virais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="h-12 w-12 bg-brand-100 dark:bg-brand-900 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-brand-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Busca avançada</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Encontre vídeos virais com nossos filtros avançados por visualizações, engajamento, idioma e muito mais.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="h-12 w-12 bg-accent2-100 dark:bg-accent2-900 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-accent2-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Análise de tendências</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Descubra tendências emergentes antes que se tornem populares, garantindo que você esteja sempre à frente.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <FileSpreadsheet className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exportação de dados</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Exporte resultados de pesquisa em formatos CSV e Excel para análises mais detalhadas.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Estatísticas detalhadas</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Veja estatísticas detalhadas sobre performance de vídeos, incluindo views, likes e crescimento.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Filtro de Shorts</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Escolha se quer incluir ou excluir vídeos curtos (Shorts) nos seus resultados de pesquisa.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Filtro de qualidade</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Encontre apenas vídeos de canais com determinado número de inscritos para garantir qualidade.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing CTA */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Planos para todos os perfis</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Escolha o plano perfeito para suas necessidades e comece a descobrir vídeos virais hoje mesmo.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="border rounded-xl p-6 flex flex-col bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Gratuito</h3>
              <div className="text-3xl font-bold mb-1">R$ 0</div>
              <p className="text-sm text-muted-foreground mb-4">Para experimentar</p>
              <ul className="space-y-2 mb-6 flex-grow">
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span> 5 buscas por dia
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span> Resultados limitados (10)
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span> Filtros básicos
                </li>
              </ul>
              <Button variant="outline" asChild>
                <Link to="/register">Começar grátis</Link>
              </Button>
            </div>
            
            <div className="border-2 border-brand-500 rounded-xl p-6 flex flex-col bg-white dark:bg-gray-800 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                MAIS POPULAR
              </div>
              <h3 className="text-xl font-semibold mb-2">Profissional</h3>
              <div className="text-3xl font-bold mb-1">R$ 49<span className="text-lg font-normal">/mês</span></div>
              <p className="text-sm text-muted-foreground mb-4">Para criadores de conteúdo</p>
              <ul className="space-y-2 mb-6 flex-grow">
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span> Buscas ilimitadas
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span> Até 50 resultados por busca
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span> Todos os filtros
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span> Exportação para Excel/CSV
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span> Histórico de buscas
                </li>
              </ul>
              <Button className="bg-brand-500 hover:bg-brand-600" asChild>
                <Link to="/register">Assinar agora</Link>
              </Button>
            </div>
            
            <div className="border rounded-xl p-6 flex flex-col bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold mb-1">R$ 99<span className="text-lg font-normal">/mês</span></div>
              <p className="text-sm text-muted-foreground mb-4">Para agências e empresas</p>
              <ul className="space-y-2 mb-6 flex-grow">
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span> Tudo do plano Profissional
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span> Múltiplos usuários
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span> API de integração
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span> Suporte prioritário
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span> Relatórios avançados
                </li>
              </ul>
              <Button variant="outline" asChild>
                <Link to="/register">Contate-nos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Video className="h-6 w-6 text-brand-500 mr-2" />
              <span className="font-bold text-lg">Caça<span className="text-brand-500">Viral</span></span>
            </div>
            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Termos</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Privacidade</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Suporte</a>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} CaçaViral. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
