import React, { useState, useEffect } from 'react';

const ScrollIndicator = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed right-5 top-1/2 transform -translate-y-1/2">
      <div className="bg-orange-500 rounded-full p-2 shadow-lg transition-all duration-300">
        <div 
          className="w-4 h-16 bg-white rounded-full transition-all duration-300"
          style={{
            transform: `translateY(${scrollPosition / 20}px)`,
            maxHeight: '64px'
          }}
        ></div>
      </div>
    </div>
  );
};

export default ScrollIndicator;