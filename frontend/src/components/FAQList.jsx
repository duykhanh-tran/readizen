import React, { useState } from 'react';
import FAQItem from './FAQItem.jsx';

function FAQList({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="text-left space-y-4">
      {items.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
        />
      ))}
    </div>
  );
}

export default FAQList;