import React from 'react';

const FeatureCard = ({ 
  emoji, 
  title, 
  description, 
  iconBg = "bg-green-50", 
  iconBorder = "border-green-100",
  className = ""
}) => {
  return (
    <div className={`bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-5 text-2xl border ${iconBorder}`}>
        {emoji}
      </div>
      <h4 className="font-bold text-xl text-brand-dark mb-3">{title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
