import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Make sure to include leaflet CSS

export default function MapPopup({ setShowMap, mapLocation, setMapLocation }) {
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setMapLocation(e.latlng); // Set latitude and longitude when clicked
      },
    });
    return mapLocation === null ? null : <Marker position={mapLocation} />;
  }

  function CloseMap() {
    setMapLocation(null);
    setShowMap(false);
  }
  // [6.9271, 79.8612]
  return (
    <div>
      <MapContainer center={[6.9271, 79.8612]} zoom={13} className="w-96 h-96">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
      </MapContainer>

      {mapLocation && (
        <div className="mt-4 text-center">
          <p>Selected Location:</p>
          <p className="font-bold">Latitude: {mapLocation.lat}</p>
          <p className="font-bold">Longitude: {mapLocation.lng}</p>
        </div>
      )}

      <button onClick={CloseMap} className="bg-red-500 text-white p-2 mt-2">
        Close Map
      </button>
      <button onClick={() => setShowMap(false)} className="bg-green-500 text-white p-2 m-2">
        Select
      </button>
    </div>
  );
}


