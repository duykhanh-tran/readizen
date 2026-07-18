import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col animate-pulse">
      {/* Image Block Placeholder */}
      <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden" />

      {/* Details Placeholder */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Title Placeholder */}
          <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-3" />
          
          {/* Subtitle / Pages info Placeholder */}
          <div className="flex items-center gap-2 mt-1">
            <div className="w-4 h-4 bg-gray-200 rounded-full" />
            <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
          </div>
        </div>

        {/* Button Placeholder */}
        <div className="mt-6 h-10 bg-gray-200 rounded-xl w-full" />
      </div>
    </div>
  );
}
