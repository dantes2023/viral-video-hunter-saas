
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChannelAgeFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const ChannelAgeFilter: React.FC<ChannelAgeFilterProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="text-sm font-medium">Idade do canal</label>
      <Select 
        value={value || "null"} 
        onValueChange={(newValue) => onChange(newValue === "null" ? null : newValue)}
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
  );
};

export default ChannelAgeFilter;
