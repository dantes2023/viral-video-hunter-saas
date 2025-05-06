
import React from 'react';
import { ArrowUpRight, Trash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SearchHistoryItem } from './types';
import { Badge } from '@/components/ui/badge';

interface SearchTableProps {
  items: SearchHistoryItem[];
  onViewResults: (item: SearchHistoryItem) => void;
  onDeleteSearch: (id: string) => void;
  formatDate: (date: string) => string;
  getFilterData: (item: SearchHistoryItem) => {id: string, label: string}[];
}

const SearchTable: React.FC<SearchTableProps> = ({
  items,
  onViewResults,
  onDeleteSearch,
  formatDate,
  getFilterData
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Palavra-chave</TableHead>
            <TableHead className="w-1/4">Data</TableHead>
            <TableHead className="w-1/4">Filtros</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell 
                className="font-medium cursor-pointer hover:text-brand-500 transition-colors"
                onClick={() => onViewResults(item)}
              >
                {item.keyword}
              </TableCell>
              <TableCell>{formatDate(item.created_at)}</TableCell>
              <TableCell>
                {getFilterData(item).map(filter => (
                  <Badge 
                    key={filter.id}
                    variant="secondary" 
                    className="mr-2 bg-gray-100 text-gray-800 hover:bg-gray-100"
                  >
                    {filter.label}
                  </Badge>
                ))}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onViewResults(item)}
                    className="h-8 w-8"
                    title="Ver resultados"
                  >
                    <ArrowUpRight size={18} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDeleteSearch(item.id)}
                    title="Apagar busca"
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SearchTable;
