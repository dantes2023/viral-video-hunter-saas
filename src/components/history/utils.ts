
import { SearchHistoryItem } from './types';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// This function returns filter data that will be transformed to badges in the component
export const getFilterData = (searchItem: SearchHistoryItem): {id: string, label: string}[] => {
  const filters = [];
  
  if (searchItem.country) {
    filters.push({
      id: 'country',
      label: searchItem.country
    });
  }
  
  if (searchItem.min_views) {
    filters.push({
      id: 'views',
      label: `+${new Intl.NumberFormat('pt-BR').format(searchItem.min_views)} views`
    });
  }
  
  return filters;
};
