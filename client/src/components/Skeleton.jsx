import React from 'react';

const Skeleton = ({ className = "" }) => {
  return <div className={`skeleton ${className}`}></div>;
};

export const DashboardSkeleton = () => (
  <div className="p-6 space-y-8 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-32 rounded-3xl" />
      <Skeleton className="h-32 rounded-3xl" />
      <Skeleton className="h-32 rounded-3xl" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Skeleton className="h-[400px] rounded-[3rem]" />
      <Skeleton className="h-[400px] rounded-[3rem]" />
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="p-8 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] space-y-4">
    <Skeleton className="w-16 h-16 rounded-2xl" />
    <Skeleton className="w-3/4 h-8" />
    <Skeleton className="w-full h-4" />
    <Skeleton className="w-full h-4" />
    <div className="flex gap-2 pt-4">
      <Skeleton className="w-24 h-10 rounded-xl" />
      <Skeleton className="w-24 h-10 rounded-xl" />
    </div>
  </div>
);

export default Skeleton;
