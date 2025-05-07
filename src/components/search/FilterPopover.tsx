
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Importando os componentes de filtro refatorados
import { useCustomValues } from './filters/CustomValueHandler';
import ResultsCountFilter from './filters/ResultsCountFilter';
import SortByFilter from './filters/SortByFilter';
import NumericRangeFilter from './filters/NumericRangeFilter';
import ChannelAgeFilter from './filters/ChannelAgeFilter';
import AdvancedFiltersAccordion from './filters/AdvancedFiltersAccordion';

export interface SearchFilters {
  minViews: number | null;
  maxViews: number | null;
  maxResults: number;
  minSubscribers: number | null;
  maxSubscribers: number | null;
  language: string;
  country: string;
  includeShorts: boolean;
  sortBy: string;
  channelAge: string | null;
}

interface FilterPopoverProps {
  filters: SearchFilters;
  onChange: (key: string, value: any) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({ 
  filters, 
  onChange, 
  open, 
  onOpenChange 
}) => {
  // Usando o hook customizado para gerenciar os valores personalizados
  const { customValues, setCustomValue } = useCustomValues();
  
  // Opções para os filtros de visualizações
  const viewsMinOptions = [
    { value: 'null', label: 'Sem mínimo' },
    { value: '1000', label: '1.000+' },
    { value: '10000', label: '10.000+' },
    { value: '100000', label: '100.000+' },
    { value: '1000000', label: '1.000.000+' }
  ];
  
  const viewsMaxOptions = [
    { value: 'null', label: 'Sem máximo' },
    { value: '10000', label: '10.000' },
    { value: '100000', label: '100.000' },
    { value: '1000000', label: '1.000.000' },
    { value: '10000000', label: '10.000.000' }
  ];
  
  // Opções para os filtros de inscritos
  const subscribersMinOptions = [
    { value: 'null', label: 'Sem mínimo' },
    { value: '1000', label: '1.000+' },
    { value: '10000', label: '10.000+' },
    { value: '100000', label: '100.000+' },
    { value: '1000000', label: '1.000.000+' }
  ];
  
  const subscribersMaxOptions = [
    { value: 'null', label: 'Sem máximo' },
    { value: '10000', label: '10.000' },
    { value: '100000', label: '100.000' },
    { value: '1000000', label: '1.000.000' },
    { value: '10000000', label: '10.000.000' }
  ];

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          className="h-12 px-4 flex gap-2 items-center"
        >
          <Filter size={18} />
          <span className="hidden sm:inline">Filtros</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96">
        <div className="space-y-4">
          <h3 className="font-medium text-lg mb-2">Filtros Avançados</h3>
          
          {/* Quantidade de resultados */}
          <ResultsCountFilter
            maxResults={filters.maxResults}
            onChange={(value) => onChange('maxResults', value || 20)}
            customValue={customValues.maxResults}
            setCustomValue={(value) => setCustomValue('maxResults', value)}
          />
          
          {/* Classificação */}
          <SortByFilter 
            value={filters.sortBy} 
            onChange={(value) => onChange('sortBy', value)}
          />
          
          {/* Filtro de visualizações */}
          <NumericRangeFilter
            label="Visualizações"
            minValue={filters.minViews}
            maxValue={filters.maxViews}
            onMinChange={(value) => onChange('minViews', value)}
            onMaxChange={(value) => onChange('maxViews', value)}
            minOptions={viewsMinOptions}
            maxOptions={viewsMaxOptions}
            customMinValue={customValues.minViews}
            customMaxValue={customValues.maxViews}
            setCustomMinValue={(value) => setCustomValue('minViews', value)}
            setCustomMaxValue={(value) => setCustomValue('maxViews', value)}
          />
          
          {/* Filtro de inscritos */}
          <NumericRangeFilter
            label="Inscritos no canal"
            minValue={filters.minSubscribers}
            maxValue={filters.maxSubscribers}
            onMinChange={(value) => onChange('minSubscribers', value)}
            onMaxChange={(value) => onChange('maxSubscribers', value)}
            minOptions={subscribersMinOptions}
            maxOptions={subscribersMaxOptions}
            customMinValue={customValues.minSubscribers}
            customMaxValue={customValues.maxSubscribers}
            setCustomMinValue={(value) => setCustomValue('minSubscribers', value)}
            setCustomMaxValue={(value) => setCustomValue('maxSubscribers', value)}
          />
          
          {/* Idade do canal */}
          <ChannelAgeFilter
            value={filters.channelAge}
            onChange={(value) => onChange('channelAge', value)}
          />
          
          {/* Filtros avançados */}
          <AdvancedFiltersAccordion 
            filters={filters} 
            onChange={onChange} 
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
