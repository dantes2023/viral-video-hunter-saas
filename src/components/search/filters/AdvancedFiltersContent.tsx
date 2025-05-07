
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchFilters } from '../FilterPopover';

interface AdvancedFiltersContentProps {
  filters: SearchFilters;
  onChange: (key: string, value: any) => void;
}

const AdvancedFiltersContent: React.FC<AdvancedFiltersContentProps> = ({ 
  filters, 
  onChange 
}) => {
  return (
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
  );
};

export default AdvancedFiltersContent;
