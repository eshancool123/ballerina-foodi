import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Showmap({ mapLocation, setShowMap }) {
  const handleClose = () => {
    setShowMap(false); // Close the map popup
  };

  return (
    <div className="absolute inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg relative">
        {/* Close button */}
        
        {/* Map display */}
        <MapContainer center={mapLocation} zoom={13} className="w-96 h-96">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={mapLocation} />
        </MapContainer>

        <button
          className=" bg-red-500 text-white p-1 rounded m-4"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
      
    </div>
  );
}