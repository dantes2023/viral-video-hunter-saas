
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
          
          <div>
            <label className="text-sm font-medium">Quantidade de resultados</label>
            <Select 
              value={filters.maxResults.toString()} 
              onValueChange={(value) => onChange('maxResults', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Quantidade de resultados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 vídeos</SelectItem>
                <SelectItem value="20">20 vídeos</SelectItem>
                <SelectItem value="50">50 vídeos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Visualizações</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Mínimo</label>
                <Select 
                  value={filters.minViews ? filters.minViews.toString() : "null"} 
                  onValueChange={(value) => onChange('minViews', value === "null" ? null : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mínimo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Sem mínimo</SelectItem>
                    <SelectItem value="1000">1.000+</SelectItem>
                    <SelectItem value="10000">10.000+</SelectItem>
                    <SelectItem value="100000">100.000+</SelectItem>
                    <SelectItem value="1000000">1.000.000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Máximo</label>
                <Select 
                  value={filters.maxViews ? filters.maxViews.toString() : "null"} 
                  onValueChange={(value) => onChange('maxViews', value === "null" ? null : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Máximo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Sem máximo</SelectItem>
                    <SelectItem value="10000">10.000</SelectItem>
                    <SelectItem value="100000">100.000</SelectItem>
                    <SelectItem value="1000000">1.000.000</SelectItem>
                    <SelectItem value="10000000">10.000.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Inscritos no canal</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Mínimo</label>
                <Select 
                  value={filters.minSubscribers ? filters.minSubscribers.toString() : "null"} 
                  onValueChange={(value) => onChange('minSubscribers', value === "null" ? null : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mínimo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Sem mínimo</SelectItem>
                    <SelectItem value="1000">1.000+</SelectItem>
                    <SelectItem value="10000">10.000+</SelectItem>
                    <SelectItem value="100000">100.000+</SelectItem>
                    <SelectItem value="1000000">1.000.000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Máximo</label>
                <Select 
                  value={filters.maxSubscribers ? filters.maxSubscribers.toString() : "null"} 
                  onValueChange={(value) => onChange('maxSubscribers', value === "null" ? null : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Máximo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Sem máximo</SelectItem>
                    <SelectItem value="10000">10.000</SelectItem>
                    <SelectItem value="100000">100.000</SelectItem>
                    <SelectItem value="1000000">1.000.000</SelectItem>
                    <SelectItem value="10000000">10.000.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
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
          
          <AdvancedFiltersAccordion 
            filters={filters} 
            onChange={onChange} 
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Sub-component for the advanced filters accordion
interface AdvancedFiltersProps {
  filters: SearchFilters;
  onChange: (key: string, value: any) => void;
}

const AdvancedFiltersAccordion: React.FC<AdvancedFiltersProps> = ({ filters, onChange }) => {
  return (
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
  );
};

export default FilterPopover;
