
import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSelectProps {
  label: string;
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  options: Array<{value: string; label: string}>;
  customValue: string;
  setCustomValue: (value: string) => void;
  placeholder?: string;
  customValuePlaceholder?: string;
  hideCustomOption?: boolean;
  className?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  onChange,
  options,
  customValue,
  setCustomValue,
  placeholder = "Selecione",
  customValuePlaceholder = "Digite um valor",
  hideCustomOption = false,
  className,
}) => {
  // Determinar o valor para exibição no select
  const displayValue = value && !customValue 
    ? value.toString() 
    : customValue === "custom" 
      ? "custom" 
      : value?.toString() || "null";

  const handleChange = (newValue: string) => {
    if (newValue === "custom") {
      setCustomValue("custom");
    } else {
      setCustomValue('');
      onChange(newValue === "null" ? null : parseInt(newValue));
    }
  };

  return (
    <div className={className}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <Select 
        value={displayValue} 
        onValueChange={handleChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          {!hideCustomOption && (
            <SelectItem value="custom">Valor personalizado</SelectItem>
          )}
        </SelectContent>
      </Select>
      
      {value === null && customValue === "custom" && (
        <Input
          type="text"
          placeholder={customValuePlaceholder}
          value={typeof customValue === 'string' && customValue !== 'custom' ? customValue : ''}
          onChange={(e) => {
            const newValue = e.target.value;
            // Permitir apenas números ou campo vazio
            if (newValue === '' || /^\d+$/.test(newValue)) {
              setCustomValue(newValue);
              onChange(newValue === '' ? null : parseInt(newValue));
            }
          }}
          className="mt-1"
        />
      )}
    </div>
  );
};

export default FilterSelect;
