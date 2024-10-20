import React, { useEffect, useState, useCallback } from 'react';
import Cards from '../components/Cards';

export const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:9100/crossOriginService/location");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMenu(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch menu items. " + error.message);
      }
    };
    fetchData();
  }, []);

  const handleSelectId = useCallback((id) => setSelectedId(id), []); // Memoized function to avoid unnecessary re-renders

  return (
    <div className="md:flex md:justify-center md:items-center max-w-6xl mx-auto p-3 m-2">
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          {filteredItems.map((item) => (
            <Cards
              key={item.id}
              {...item} // Spread operator to pass all props
              setId={handleSelectId}
            />
          ))}
        </div>
      ) : (
        <p>No menu items available.</p>
      )}
    </div>
  );
};
