
import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const Plans = () => {
  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: 'para sempre',
      description: 'Para experimentar a plataforma',
      features: [
        '5 buscas por dia',
        'Resultados limitados (10)',
        'Filtros básicos',
        'Sem exportação'
      ],
      cta: 'Começar grátis',
      popular: false
    },
    {
      name: 'Profissional',
      price: 'R$ 49',
      period: '/mês',
      description: 'Para criadores de conteúdo',
      features: [
        'Buscas ilimitadas',
        'Até 50 resultados por busca',
        'Todos os filtros',
        'Exportação para Excel/CSV',
        'Histórico de buscas',
        'Estatísticas detalhadas',
        'Suporte por e-mail'
      ],
      cta: 'Assinar agora',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'R$ 99',
      period: '/mês',
      description: 'Para agências e empresas',
      features: [
        'Tudo do plano Profissional',
        'Múltiplos usuários',
        'API de integração',
        'Suporte prioritário',
        'Relatórios avançados',
        'Análise de tendências',
        'Treinamento personalizado'
      ],
      cta: 'Contate-nos',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="flex-grow py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Escolha seu plano</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Encontre o plano perfeito para suas necessidades de busca de vídeos virais
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`rounded-xl overflow-hidden ${
                  plan.popular 
                    ? 'border-2 border-brand-500 relative bg-white dark:bg-gray-800 shadow-xl' 
                    : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold uppercase py-1 px-3 rounded-bl">
                    Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="ml-1 text-xl text-gray-500">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">{plan.description}</p>
                  
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <span className="ml-3 text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8">
                    <Button
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-brand-500 hover:bg-brand-600' 
                          : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
                      }`}
                      asChild
                    >
                      <Link to="/register">{plan.cta}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Como funciona a busca de vídeos virais?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Nossa plataforma utiliza algoritmos avançados e integração com a API do YouTube para encontrar vídeos com alto potencial de viralização com base nos critérios que você definir.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Posso fazer downgrade ou upgrade do meu plano?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sim, você pode mudar de plano a qualquer momento. Se fizer upgrade, a diferença será cobrada proporcionalmente ao tempo restante da sua assinatura atual. Para downgrade, a mudança ocorre no próximo ciclo de cobrança.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Como posso cancelar minha assinatura?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Você pode cancelar sua assinatura a qualquer momento através da página de configurações da sua conta. O acesso aos recursos premium continuará disponível até o final do período pago.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Vocês oferecem teste gratuito?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sim! Nosso plano gratuito permite que você experimente as funcionalidades básicas da plataforma. Você pode fazer até 5 buscas por dia e visualizar até 10 resultados por busca.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Plans;
