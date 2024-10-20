import React from "react";
import { useNavigate } from "react-router-dom";
import locationImg from "../Asserts/Location.png";

export default function Explore({
  image,
  name,
  description,
  location,
  type,
  setId,
  index, // Add index to props
}) {
  const navigate = useNavigate(); // Hook for navigation

  function handleExplore() {
    setId(index); // Set the id (or index)
    navigate("/description"); // Navigate to the description page
  }

  return (
    <div className="w-full p-4 bg-slate-100 rounded-2xl">
      {/* Large Image */}
      <img
        src={image}
        className="w-full h-32 md:h-60 object-cover rounded-lg mb-4"
        alt={name}
      />
      <h1 className="text-xl font-bold mb-2">{name}</h1>

      {/* Location with icon */}
      <div className="flex items-center mb-2">
        <img src={locationImg} alt="Location Icon" className="w-5 h-5 mr-2" />
        <h2 className="text-md">Location: {location}</h2>
      </div>

      <h2 className="text-md mb-1">Type: {type}</h2>
      <p className="text-md text-left mb-2">Description: {description}</p>
      <div className="flex justify-center">
        <button
          className="bg-orange-600 text-white p-2 rounded-3xl"
          onClick={handleExplore}
        >
          Explore
        </button>
      </div>
    </div>
  );
}
