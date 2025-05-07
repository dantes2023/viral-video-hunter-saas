
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AdvancedFiltersContent from './AdvancedFiltersContent';
import { SearchFilters } from '../FilterPopover';

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
          <AdvancedFiltersContent filters={filters} onChange={onChange} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdvancedFiltersAccordion;
