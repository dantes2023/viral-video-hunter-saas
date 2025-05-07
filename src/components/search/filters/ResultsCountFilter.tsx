
import React from 'react';
import FilterSelect from './FilterSelect';

interface ResultsCountFilterProps {
  maxResults: number;
  onChange: (value: number | null) => void;
  customValue: string;
  setCustomValue: (value: string) => void;
}

const ResultsCountFilter: React.FC<ResultsCountFilterProps> = ({
  maxResults,
  onChange,
  customValue,
  setCustomValue
}) => {
  const options = [
    { value: '10', label: '10 vídeos' },
    { value: '20', label: '20 vídeos' },
    { value: '50', label: '50 vídeos' }
  ];

  return (
    <FilterSelect
      label="Quantidade de resultados"
      value={maxResults}
      onChange={(value) => onChange(value as number)}
      options={options}
      customValue={customValue}
      setCustomValue={setCustomValue}
      customValuePlaceholder="Digite a quantidade de resultados"
    />
  );
};

export default ResultsCountFilter;
