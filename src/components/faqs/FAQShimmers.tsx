import React from 'react';

export const CategoryShimmer = () => {
  return (
    <div className="space-y-2 py-3">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="px-5 py-4 border-b border-white/5 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const FAQShimmer = () => {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white animate-pulse"
        >
          <div className="p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-200"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const CategoryHeaderShimmer = () => {
  return (
    <div className="bg-slate-700 text-white p-6 md:p-8 animate-pulse">
      <div className="flex md:flex-row flex-col items-start gap-4">
        <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl"></div>
        <div className="flex-1 space-y-3">
          <div className="h-8 bg-white/20 rounded w-2/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-white/20 rounded w-full"></div>
            <div className="h-4 bg-white/20 rounded w-5/6"></div>
            <div className="h-4 bg-white/20 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
