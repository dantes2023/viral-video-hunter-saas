
import { useState } from 'react';

export interface CustomValuesState {
  minViews: string;
  maxViews: string;
  minSubscribers: string;
  maxSubscribers: string;
  maxResults: string;
}

export const useCustomValues = () => {
  const [customValues, setCustomValues] = useState<CustomValuesState>({
    minViews: '',
    maxViews: '',
    minSubscribers: '',
    maxSubscribers: '',
    maxResults: '',
  });

  const handleCustomValueChange = (key: keyof CustomValuesState, value: string) => {
    // Permitir apenas números
    if (value === '' || /^\d+$/.test(value)) {
      setCustomValues(prev => ({
        ...prev,
        [key]: value
      }));
      
      // Retorna o valor numérico ou null para uso externo
      return value === '' ? null : parseInt(value);
    }
    return null;
  };

  const setCustomValue = (key: keyof CustomValuesState, value: string) => {
    setCustomValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return {
    customValues,
    handleCustomValueChange,
    setCustomValue
  };
};
