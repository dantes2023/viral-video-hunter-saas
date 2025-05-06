
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getVersionString, getFullVersionString } from '@/constants/version';

interface VersionBadgeProps {
  showFull?: boolean;
  className?: string;
}

const VersionBadge = ({ showFull = false, className = '' }: VersionBadgeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`text-xs ${className}`}>
            {showFull ? getFullVersionString() : getVersionString()}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Versão completa: {getFullVersionString()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VersionBadge;
