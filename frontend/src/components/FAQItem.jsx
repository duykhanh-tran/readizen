import { ChevronDown } from 'lucide-react';

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 text-left flex justify-between items-center bg-white hover:bg-gray-50/50 transition duration-200 focus:outline-none"
      >
        <span className="font-bold text-gray-900">{question}</span>
        <div className={`w-6 h-6 rounded bg-[#E6F0EB] text-[#106734] flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown size={16} strokeWidth={3} />
        </div>
      </button>
      
      {/* Hiệu ứng trượt mượt mà (smooth slide) của React Tailwind */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5 pt-1 text-gray-600 text-sm leading-relaxed bg-white">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default FAQItem;