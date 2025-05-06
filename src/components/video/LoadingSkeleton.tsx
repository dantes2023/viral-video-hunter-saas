
import React from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  view: 'grid' | 'list';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ view }) => {
  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(null).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {Array(4).fill(null).map((_, index) => (
        <div key={index} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
          <Skeleton className="w-40 h-24 rounded-lg flex-shrink-0" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
