import React, { useState, memo } from 'react';
import PropTypes from 'prop-types'; 
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import locationImg from '../Asserts/Location.png';

const Cards = ({
  uid,
  user, // Optional if you want to pass user data; otherwise can be removed.
  name,
  location,
  description,
  types = [],
  city = [],
  images = [],
  mapData,
}) => {
  const navigate = useNavigate();
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  // Function to navigate to the description page with uid
  const handleExplore = () => {
    navigate(`/description/${uid}`); // Include uid in the URL
  };

  // Function to toggle heart fill state
  const handleHeartClick = () => {
    setIsHeartFilled(prevState => !prevState);
  };

  return (
    <div className="bg-slate-100 card shadow-md relative my-3 hover:scale-100 scale-95 duration-400 transition-all rounded-xl overflow-hidden w-full h-[410px] flex flex-col">
      <div
        className={`rating gap-1 absolute right-2 top-2 p-2 heartStar bg-green ${isHeartFilled ? "text-rose-500" : "text-white"}`}
        onClick={handleHeartClick}
        role="button"
        aria-label={isHeartFilled ? "Remove from favorites" : "Add to favorites"}
      >
        <FaHeart className="w-5 h-5 cursor-pointer" />
      </div>
      <div onClick={handleExplore}>
        <figure>
          <img
            src={images[0] || "https://via.placeholder.com/100"} // Fallback image if no images are available
            alt={`Image of ${name}`} // Improved alt text for accessibility
            className="w-full h-28 md:h-36 object-cover rounded-lg m-3"
          />
        </figure>
      </div>
      <div className="card-body p-3 flex-grow flex flex-col">
        <div className="mb-3">
          <h2 className="text-lg font-bold mb-1">{name}</h2>
          <div className="flex items-center mb-2">
            <img src={locationImg} alt="Location Icon" className="w-4 h-4 mr-1" />
            <h3 className="text-sm">{location}</h3>
          </div>
          {types.length > 0 && (
            <h3 className="text-sm mb-1">
              <span className="font-semibold">Types:</span> {types.join(', ')}
            </h3>
          )}
          {city.length > 0 && (
            <h3 className="text-sm mb-1">
              <span className="font-semibold">Cities:</span> {city.join(', ')}
            </h3>
          )}

        </div>
        <div className="flex justify-center mt-auto">
          <button 
            className="mb-2 pb-0 bg-orange-400 flex justify-center hover:scale-100 text-white py-2 px-4 text-sm rounded-full hover:bg-orange-600 transition-all w-full h-[40px]"
            onClick={handleExplore}
            aria-label={`Explore ${name}`}
          >
            <span className="font-semibold">Explore</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes for validation
Cards.propTypes = {
  uid: PropTypes.string.isRequired,
  user: PropTypes.string,
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  description: PropTypes.string,
  types: PropTypes.arrayOf(PropTypes.string),
  city: PropTypes.arrayOf(PropTypes.string),
  images: PropTypes.arrayOf(PropTypes.string),
  mapData: PropTypes.object,
};

// Memoize Cards to prevent unnecessary re-renders
export default memo(Cards);
