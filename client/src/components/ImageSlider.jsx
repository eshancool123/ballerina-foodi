import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const images = [
  'https://firebasestorage.googleapis.com/v0/b/image-store-8ddb7.appspot.com/o/location_images%2FS1.png?alt=media&token=b609ff4f-abdb-4682-a134-41b86ae3f7c5',
  'https://firebasestorage.googleapis.com/v0/b/image-store-8ddb7.appspot.com/o/location_images%2Fs2.webp?alt=media&token=55086ed8-9708-4555-8955-c4cc18a779ec',
  'https://firebasestorage.googleapis.com/v0/b/image-store-8ddb7.appspot.com/o/location_images%2Fs3.webp?alt=media&token=dd7cd1cb-41b4-4007-a84b-b8241c4c3ee8',
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderHeight, setSliderHeight] = useState(400); // Initial height in pixels

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentIndex]);

  return (
    <div className="relative w-3/5 mx-auto rounded-2xl overflow-hidden m-10 mb-12 " style={{ height: `${sliderHeight}px` }}>
      <div className="relative h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={image} alt={`Slide ${index}`} className="w-full h-full object-cover shadow-xl" />
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full shadow-lg hover:scale-150 scale-125  "
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-white font-extrabold" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full shadow-lg hover:scale-150 scale-125"
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-white font-extrabold " />
      </button>
    </div>
  );
};

export default ImageSlider;
