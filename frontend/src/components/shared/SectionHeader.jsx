import React from 'react';

const SectionHeader = ({ 
  badge, 
  title, 
  subtitle, 
  align = "center",
  className = "" 
}) => {
  const isLeft = align === "left";
  return (
    <div className={`${isLeft ? 'text-left' : 'text-center'} mb-16 ${className}`}>
      {badge && (
        <div className="inline-block bg-brand-light text-brand-green text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4">
          {badge}
        </div>
      )}
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-gray-600 max-w-2xl ${isLeft ? '' : 'mx-auto'} text-lg`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
