
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Clock, Trash2, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Tipo para o histórico de pesquisa
interface SearchHistoryItem {
  id: string;
  keyword: string;
  date: string;
  filters: {
    country: string;
    language: string;
    minViews: number;
    minSubscribers: number;
    includeShorts: boolean;
  };
  resultsCount: number;
}

// Mock de dados para simulação
const mockHistory: SearchHistoryItem[] = [
  {
    id: 'search-1',
    keyword: 'receitas saudáveis',
    date: '2024-05-01T10:30:00Z',
    filters: {
      country: 'BR',
      language: 'pt',
      minViews: 10000,
      minSubscribers: 1000,
      includeShorts: true
    },
    resultsCount: 42
  },
  {
    id: 'search-2',
    keyword: 'dicas de moda',
    date: '2024-04-28T14:15:00Z',
    filters: {
      country: 'BR',
      language: 'pt',
      minViews: 50000,
      minSubscribers: 5000,
      includeShorts: false
    },
    resultsCount: 26
  },
  {
    id: 'search-3',
    keyword: 'unboxing iphone',
    date: '2024-04-25T09:45:00Z',
    filters: {
      country: 'US',
      language: 'en',
      minViews: 100000,
      minSubscribers: 10000,
      includeShorts: true
    },
    resultsCount: 38
  },
  {
    id: 'search-4',
    keyword: 'jogos indie',
    date: '2024-04-22T16:20:00Z',
    filters: {
      country: 'BR',
      language: 'pt',
      minViews: 5000,
      minSubscribers: 1000,
      includeShorts: true
    },
    resultsCount: 19
  },
  {
    id: 'search-5',
    keyword: 'viagem europa',
    date: '2024-04-15T11:10:00Z',
    filters: {
      country: 'BR',
      language: 'pt',
      minViews: 20000,
      minSubscribers: 5000,
      includeShorts: false
    },
    resultsCount: 31
  }
];

// Formatador de data
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState<SearchHistoryItem[]>(mockHistory);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Filtrar histórico baseado na busca
  const filteredHistory = history.filter(item => 
    item.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Excluir um item do histórico
  const handleDelete = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Limpar todo o histórico
  const handleClearAll = () => {
    setHistory([]);
    setDeleteDialogOpen(false);
  };

  // Repetir a busca (simulação)
  const handleRepeatSearch = (keyword: string, filters: any) => {
    console.log(`Repetindo busca: ${keyword}`, filters);
    // Aqui seria implementada a lógica para redirecionar para o dashboard com os filtros preenchidos
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="flex-grow container px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Histórico de Buscas</h1>
        
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Buscar no histórico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex items-center gap-1">
                <Trash2 size={16} />
                <span>Limpar histórico</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Limpar histórico de buscas?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Todo o seu histórico de buscas será excluído permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll} className="bg-red-500 hover:bg-red-600">
                  Limpar histórico
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700">
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="mt-3 text-lg font-medium">Nenhum histórico de busca</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Seu histórico de buscas aparecerá aqui quando você fizer pesquisas.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link to="/dashboard">Ir para o Dashboard</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Palavra-chave</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="hidden md:table-cell">Resultados</TableHead>
                    <TableHead className="hidden lg:table-cell">Filtros</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.keyword}</TableCell>
                      <TableCell>{formatDate(item.date)}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.resultsCount} vídeos</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs">
                            {item.filters.country}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs">
                            +{item.filters.minViews.toLocaleString()} views
                          </span>
                          {!item.filters.includeShorts && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs">
                              No Shorts
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleRepeatSearch(item.keyword, item.filters)}
                          >
                            <ExternalLink size={14} />
                            <span className="sr-only">Repetir busca</span>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                          >
                            <Download size={14} />
                            <span className="sr-only">Exportar resultados</span>
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-500 border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700"
                              >
                                <Trash2 size={14} />
                                <span className="sr-only">Excluir</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir este item do histórico?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Este item será excluído permanentemente do seu histórico.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredHistory.length === 0 && (
              <div className="p-8 text-center">
                <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500" />
                <h3 className="mt-2 text-sm font-medium">Nenhum resultado encontrado</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tente ajustar seu termo de busca para encontrar o que está procurando.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
