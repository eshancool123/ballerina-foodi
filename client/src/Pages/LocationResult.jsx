import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import Cards from '../components/Cards';
import { useSearchParams } from 'react-router-dom';
import ScrollIndicator from '../components/ScollIndicator';

// eslint-disable-next-line react/prop-types
export default function LocationResult({ setId }) {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';


  const [countOne, setcountOne] = useState(4);
  const [countTwo, setcountTwo] = useState(4);

  // State for fetching data based on URL search
  const [menu, setMenu] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [sortOrder, setSortOrder] = useState("A-Z");

  // Local search term for additional filtering within the page
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const searchTerm = initialSearch;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:9100/crossOriginService/location?search=${searchTerm}`);
        const data = await response.json();
        setMenu(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch menu items. " + error.message);
      }
    };
    fetchData();
  }, [searchTerm]);

  useEffect(() => {
    let items = [...menu];

    // Filtering logic
    if (searchTerm) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (localSearchTerm) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(localSearchTerm.toLowerCase())
      );
    }

    if (selectedTypes.length > 0) {
      items = items.filter(item =>
        selectedTypes.some(type => item.types.includes(type))
      );
    }

    if (selectedCities.length > 0) {
      items = items.filter(item =>
        selectedCities.some(city => item.city.includes(city))
      );
    }

    if (sortOrder === "A-Z") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      items.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredItems(items);
  }, [searchTerm, localSearchTerm, selectedTypes, selectedCities, sortOrder, menu]);

  const handleTypeChange = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleCityChange = (city) => {
    setSelectedCities(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const handleSelectId = (id) => {
    setId(id);
  };

  return (
    <div className="md:flex md:justify-start md:items-start max-w-6xl mx-auto p-3">
      <div className="flex">
        {/* Fixed filters container */}
        <div className="w-1/4 h-screen overflow-y-auto bg-white shadow-lg flex-auto sticky top-0" style={{ minWidth: '250px' }}>
          {/* Local Search Bar */}
          <div className="flex items-center mb-8 mt-10 w-4/5">
            <input
              type="text"
              placeholder="Search within results..."
              className="p-2 border rounded-l-full w-64"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
            <button
              className="p-2 bg-gray-200 rounded-r-full"
              onClick={() => setLocalSearchTerm('')}
            >
              <span className='text-orange-600'>Clear</span>
            </button>
          </div>
          {/* Type Filters */}
          <div className="mb-6">
            <h2 className="font-bold mb-2">Type:</h2>
            {["Fried Snacks", "Roti and Bread", "Rice and Curry", "Seafood Dishes", "Sweets and Desserts", "Fresh Fruit and Juices"].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={type.toLowerCase().replace(/ /g, '-')}
                  className="checkbox checkbox-warning w-4 h-4 m-1"
                  onChange={() => handleTypeChange(type)}
                  checked={selectedTypes.includes(type)}
                />
                <label htmlFor={type.toLowerCase().replace(/ /g, '-')} className="text-sm">{type}</label>
              </div>
            ))}
          </div>

          {/* City Filters */}
          <div className="mb-6">
            <h2 className="font-bold mb-2">Outlets:</h2>
            {["Colombo", "Kandy", "Galle", "Jaffna", "Negombo"].map((city) => (
              <div key={city} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={city.toLowerCase()}
                  className="checkbox checkbox-warning w-4 h-4 m-1"
                  onChange={() => handleCityChange(city)}
                  checked={selectedCities.includes(city)}
                />
                <label htmlFor={city.toLowerCase()} className="text-sm">{city}</label>
              </div>
            ))}
          </div>

          {/* Sort Options */}
          <div>
            <h2 className="font-bold mb-3">Sort:</h2>
            <button
              className={`p-2 bg-gray-200 rounded-full  mr-2 font-semibold ${sortOrder === "A-Z" ? "bg-orange-400" : ""}`}
              onClick={() => setSortOrder("A-Z")}
            >
              A-Z
            </button>
            <button
              className={`p-2 bg-gray-200  rounded-full font-semibold ${sortOrder === "Z-A" ? "bg-orange-400" : ""}`}
              onClick={() => setSortOrder("Z-A")}
            >
              Z-A
            </button>
          </div>
        </div>

        {/* Display Cards */}
        <div className="w-3/4 min-w-3/4 m-5">
          <h2 className="font-bold text-xl mb-4">Location Result:</h2>
          {filteredItems.length === 0 ? (
            <p className="text-lg text-gray-500">No results found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <Cards
                  key={item.uid}
                  id={item.uid}
                  user={item.user}
                  name={item.name}
                  location={item.location}
                  description={item.description}
                  types={item.types}
                  city={item.city}
                  images={item.images}
                  mapData={item.mapData}
                  setId={handleSelectId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <ScrollIndicator />
    </div>
  );
}