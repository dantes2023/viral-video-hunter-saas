
import React from 'react';
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

export const formatFilters = (searchItem: SearchHistoryItem): React.ReactNode => {
  const filterBadges = [];
  
  if (searchItem.country) {
    filterBadges.push(
      <span key="country" className="inline-flex items-center mr-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
        {searchItem.country}
      </span>
    );
  }
  
  if (searchItem.min_views) {
    filterBadges.push(
      <span key="views" className="inline-flex items-center mr-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
        +{new Intl.NumberFormat('pt-BR').format(searchItem.min_views)} views
      </span>
    );
  }
  
  return filterBadges;
};
