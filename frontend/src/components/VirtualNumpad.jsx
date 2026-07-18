import React from 'react';
import { Delete, X } from 'lucide-react';

export default function VirtualNumpad({ onKeyPress }) {
    const keys = [
        '1', '2', '3',
        '4', '5', '6',
        '7', '8', '9',
        'close', '0', 'backspace'
    ];

    const handleKeyClick = (key) => {
        onKeyPress(key);
    };

    return (
        <div className="grid grid-cols-3 gap-2.5 max-w-full mx-auto select-none mt-4">
            {keys.map((key, idx) => {
                let content;
                let btnStyle = "bg-white hover:bg-gray-50 text-gray-800 border border-gray-100 shadow-sm active:bg-gray-100";

                if (key === 'backspace') {
                    content = <Delete className="w-5 h-5 text-red-500" />;
                    btnStyle = "bg-red-50 hover:bg-red-100 text-red-600 border border-red-100/50 active:bg-red-200";
                } else if (key === 'close') {
                    content = <X className="w-5 h-5 text-gray-400" />;
                    btnStyle = "bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-150 active:bg-gray-200";
                } else {
                    content = <span className="text-lg font-black text-brand-green">{key}</span>;
                }

                return (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => handleKeyClick(key)}
                        className={`min-w-[44px] min-h-[44px] sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer outline-none ${btnStyle}`}
                    >
                        {content}
                    </button>
                );
            })}
        </div>
    );
}
