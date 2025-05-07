
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  // Estado para os valores personalizados nos campos de input
  const [customValues, setCustomValues] = React.useState({
    minViews: '',
    maxViews: '',
    minSubscribers: '',
    maxSubscribers: '',
    maxResults: '',
  });
  
  // Handler para inputs personalizados
  const handleCustomValueChange = (key: string, value: string) => {
    // Permitir apenas números
    if (value === '' || /^\d+$/.test(value)) {
      setCustomValues(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };
  
  // Opções para os filtros de visualizações
  const viewsMinOptions = [
    { value: 'null', label: 'Sem mínimo' },
    { value: '1000', label: '1.000+' },
    { value: '10000', label: '10.000+' },
    { value: '100000', label: '100.000+' },
    { value: '1000000', label: '1.000.000+' },
    { value: 'custom', label: 'Valor personalizado' }
  ];
  
  const viewsMaxOptions = [
    { value: 'null', label: 'Sem máximo' },
    { value: '10000', label: '10.000' },
    { value: '100000', label: '100.000' },
    { value: '1000000', label: '1.000.000' },
    { value: '10000000', label: '10.000.000' },
    { value: 'custom', label: 'Valor personalizado' }
  ];
  
  // Opções para os filtros de inscritos
  const subscribersMinOptions = [
    { value: 'null', label: 'Sem mínimo' },
    { value: '1000', label: '1.000+' },
    { value: '10000', label: '10.000+' },
    { value: '100000', label: '100.000+' },
    { value: '1000000', label: '1.000.000+' },
    { value: 'custom', label: 'Valor personalizado' }
  ];
  
  const subscribersMaxOptions = [
    { value: 'null', label: 'Sem máximo' },
    { value: '10000', label: '10.000' },
    { value: '100000', label: '100.000' },
    { value: '1000000', label: '1.000.000' },
    { value: '10000000', label: '10.000.000' },
    { value: 'custom', label: 'Valor personalizado' }
  ];
  
  const resultCountOptions = [
    { value: '10', label: '10 vídeos' },
    { value: '20', label: '20 vídeos' },
    { value: '50', label: '50 vídeos' },
    { value: 'custom', label: 'Valor personalizado' }
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
          <div>
            <label className="text-sm font-medium">Quantidade de resultados</label>
            <Select 
              value={
                customValues.maxResults === 'custom'
                  ? 'custom'
                  : filters.maxResults ? String(filters.maxResults) : '20'
              } 
              onValueChange={(value) => {
                if (value === 'custom') {
                  handleCustomValueChange('maxResults', 'custom');
                } else {
                  handleCustomValueChange('maxResults', '');
                  onChange('maxResults', parseInt(value));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Quantidade de resultados" />
              </SelectTrigger>
              <SelectContent>
                {resultCountOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {customValues.maxResults === 'custom' && (
              <Input
                type="text"
                placeholder="Digite a quantidade de resultados"
                value={typeof customValues.maxResults === 'string' && customValues.maxResults !== 'custom' ? customValues.maxResults : ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue === '' || /^\d+$/.test(newValue)) {
                    handleCustomValueChange('maxResults', newValue);
                    onChange('maxResults', newValue === '' ? 20 : parseInt(newValue));
                  }
                }}
                className="mt-1"
              />
            )}
          </div>
          
          {/* Classificação */}
          <div>
            <label className="text-sm font-medium">Classificar por</label>
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => onChange('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Classificar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="views">Visualizações</SelectItem>
                <SelectItem value="subscribers">Inscritos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Filtro de visualizações */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Visualizações</label>
            <div className="grid grid-cols-2 gap-2">
              {/* Visualizações mínimas */}
              <div>
                <Select 
                  value={customValues.minViews === 'custom' ? 'custom' : filters.minViews ? String(filters.minViews) : 'null'} 
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      handleCustomValueChange('minViews', 'custom');
                    } else {
                      handleCustomValueChange('minViews', '');
                      onChange('minViews', value === 'null' ? null : parseInt(value));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mínimo" />
                  </SelectTrigger>
                  <SelectContent>
                    {viewsMinOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {customValues.minViews === 'custom' && (
                  <Input
                    type="text"
                    placeholder="Digite o valor mínimo"
                    value={typeof customValues.minViews === 'string' && customValues.minViews !== 'custom' ? customValues.minViews : ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue === '' || /^\d+$/.test(newValue)) {
                        handleCustomValueChange('minViews', newValue);
                        onChange('minViews', newValue === '' ? null : parseInt(newValue));
                      }
                    }}
                    className="mt-1"
                  />
                )}
              </div>
              
              {/* Visualizações máximas */}
              <div>
                <Select 
                  value={customValues.maxViews === 'custom' ? 'custom' : filters.maxViews ? String(filters.maxViews) : 'null'} 
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      handleCustomValueChange('maxViews', 'custom');
                    } else {
                      handleCustomValueChange('maxViews', '');
                      onChange('maxViews', value === 'null' ? null : parseInt(value));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Máximo" />
                  </SelectTrigger>
                  <SelectContent>
                    {viewsMaxOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {customValues.maxViews === 'custom' && (
                  <Input
                    type="text"
                    placeholder="Digite o valor máximo"
                    value={typeof customValues.maxViews === 'string' && customValues.maxViews !== 'custom' ? customValues.maxViews : ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue === '' || /^\d+$/.test(newValue)) {
                        handleCustomValueChange('maxViews', newValue);
                        onChange('maxViews', newValue === '' ? null : parseInt(newValue));
                      }
                    }}
                    className="mt-1"
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Filtro de inscritos */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Inscritos no canal</label>
            <div className="grid grid-cols-2 gap-2">
              {/* Inscritos mínimos */}
              <div>
                <Select 
                  value={customValues.minSubscribers === 'custom' ? 'custom' : filters.minSubscribers ? String(filters.minSubscribers) : 'null'} 
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      handleCustomValueChange('minSubscribers', 'custom');
                    } else {
                      handleCustomValueChange('minSubscribers', '');
                      onChange('minSubscribers', value === 'null' ? null : parseInt(value));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mínimo" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscribersMinOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {customValues.minSubscribers === 'custom' && (
                  <Input
                    type="text"
                    placeholder="Digite o valor mínimo"
                    value={typeof customValues.minSubscribers === 'string' && customValues.minSubscribers !== 'custom' ? customValues.minSubscribers : ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue === '' || /^\d+$/.test(newValue)) {
                        handleCustomValueChange('minSubscribers', newValue);
                        onChange('minSubscribers', newValue === '' ? null : parseInt(newValue));
                      }
                    }}
                    className="mt-1"
                  />
                )}
              </div>
              
              {/* Inscritos máximos */}
              <div>
                <Select 
                  value={customValues.maxSubscribers === 'custom' ? 'custom' : filters.maxSubscribers ? String(filters.maxSubscribers) : 'null'} 
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      handleCustomValueChange('maxSubscribers', 'custom');
                    } else {
                      handleCustomValueChange('maxSubscribers', '');
                      onChange('maxSubscribers', value === 'null' ? null : parseInt(value));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Máximo" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscribersMaxOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {customValues.maxSubscribers === 'custom' && (
                  <Input
                    type="text"
                    placeholder="Digite o valor máximo"
                    value={typeof customValues.maxSubscribers === 'string' && customValues.maxSubscribers !== 'custom' ? customValues.maxSubscribers : ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue === '' || /^\d+$/.test(newValue)) {
                        handleCustomValueChange('maxSubscribers', newValue);
                        onChange('maxSubscribers', newValue === '' ? null : parseInt(newValue));
                      }
                    }}
                    className="mt-1"
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Idade do canal */}
          <div>
            <label className="text-sm font-medium">Idade do canal</label>
            <Select 
              value={filters.channelAge || "null"} 
              onValueChange={(value) => onChange('channelAge', value === "null" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Qualquer idade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">Qualquer idade</SelectItem>
                <SelectItem value="1day">Último dia</SelectItem>
                <SelectItem value="7days">Últimos 7 dias</SelectItem>
                <SelectItem value="15days">Últimos 15 dias</SelectItem>
                <SelectItem value="30days">Últimos 30 dias</SelectItem>
                <SelectItem value="2months">Últimos 2 meses</SelectItem>
                <SelectItem value="3months">Últimos 3 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Filtros avançados */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="advanced-filters">
              <AccordionTrigger className="text-sm font-medium">
                Filtros avançados
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-sm font-medium">País</label>
                    <Select 
                      value={filters.country} 
                      onValueChange={(value) => onChange('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="País" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BR">Brasil</SelectItem>
                        <SelectItem value="US">Estados Unidos</SelectItem>
                        <SelectItem value="ES">Espanha</SelectItem>
                        <SelectItem value="PT">Portugal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Idioma</label>
                    <Select 
                      value={filters.language} 
                      onValueChange={(value) => onChange('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt">Português</SelectItem>
                        <SelectItem value="en">Inglês</SelectItem>
                        <SelectItem value="es">Espanhol</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeShorts"
                      checked={filters.includeShorts}
                      onChange={(e) => onChange('includeShorts', e.target.checked)}
                      className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <label htmlFor="includeShorts" className="text-sm">
                      Incluir Shorts
                    </label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
