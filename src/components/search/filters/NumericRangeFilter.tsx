
import React from 'react';
import FilterSelect from './FilterSelect';

interface NumericRangeFilterProps {
  label: string;
  minValue: number | null;
  maxValue: number | null;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
  minOptions: Array<{value: string; label: string}>;
  maxOptions: Array<{value: string; label: string}>;
  customMinValue: string;
  customMaxValue: string;
  setCustomMinValue: (value: string) => void;
  setCustomMaxValue: (value: string) => void;
}

const NumericRangeFilter: React.FC<NumericRangeFilterProps> = ({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minOptions,
  maxOptions,
  customMinValue,
  customMaxValue,
  setCustomMinValue,
  setCustomMaxValue
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <FilterSelect
          label="Mínimo"
          value={minValue}
          onChange={onMinChange}
          options={minOptions}
          customValue={customMinValue}
          setCustomValue={setCustomMinValue}
          placeholder="Mínimo"
          customValuePlaceholder="Digite o valor mínimo"
          className="w-full"
        />
        <FilterSelect
          label="Máximo"
          value={maxValue}
          onChange={onMaxChange}
          options={maxOptions}
          customValue={customMaxValue}
          setCustomValue={setCustomMaxValue}
          placeholder="Máximo"
          customValuePlaceholder="Digite o valor máximo"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default NumericRangeFilter;
