
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortByFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const SortByFilter: React.FC<SortByFilterProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="text-sm font-medium">Classificar por</label>
      <Select 
        value={value} 
        onValueChange={onChange}
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
  );
};

export default SortByFilter;
