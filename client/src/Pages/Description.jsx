import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom'; 
import locationImg from '../Asserts/Location.png'; 
import Carousel from 'react-multi-carousel'; 
import 'react-multi-carousel/lib/styles.css'; 
import Showmap from '../components/Showmap'; 
 
const LocationDetails = () => { 
  const { uid } = useParams(); // This retrieves the uid from the URL 
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
 
  const handleLocationClick = () => { 
    setShowMap(true); // Display map popup 
  }; 
  const [showMap, setShowMap] = useState(false); // Track map visibility 
  const [mapLocation, setMapLocation] = useState([6.9271, 79.8612]); 
 
  useEffect(() => { 
    console.log("Fetching data for UID:", uid); // Log the UID being used to fetch data 
 
    const fetchData = async () => { 
      setLoading(true); // Set loading state to true 
      try { 
        const response = await fetch("http://localhost:9100/crossOriginService/location"); 
        if (!response.ok) { 
          throw new Error("Network response was not ok"); 
        } 
        const jsonData = await response.json(); 
 
        // Log the fetched data 
        console.log("Fetched data:", jsonData); 
 
        // Find the location data that matches the uid 
        const foundData = jsonData.find(item => item.uid === String(uid)); 
        if (foundData) {
          setData(foundData);
          const mapLocationData = foundData.mapData.map(coordinate => parseFloat(coordinate));
          setMapLocation(mapLocationData);  
        } else { 
          console.log("Available UIDs:", jsonData.map(item => item.uid)); // Log available UIDs 
          setError("No data found for this UID: " + uid); // Log the error with the uid 
        } 
      } catch (error) { 
        setError(error.message); 
      } finally { 
        setLoading(false); // Always set loading to false in the finally block 
      } 
    }; 
 
    fetchData(); 
  }, [uid]); 
 
 
 
 
 
 
  const responsive = { 
    desktop: { 
      breakpoint: { max: 3000, min: 1024 }, 
      items: 1, 
    }, 
    tablet: { 
      breakpoint: { max: 1024, min: 464 }, 
      items: 1, 
    }, 
    mobile: { 
      breakpoint: { max: 464, min: 0 }, 
      items: 1, 
    }, 
  }; 
 
 
 
 
 
  return ( 
 
    <div> 
      {showMap && ( 
        <Showmap mapLocation={mapLocation} setShowMap={setShowMap} /> 
      )} 
      {loading && <p>Loading...</p>} 
      {error && <p style={{ color: 'red' }}>{error}</p>} 
      {data && ( 
        <div className=" mx-auto p-4 max-w-6xl"> 
          <div className="rounded-lg overflow-hidden shadow-lg m-4"> 
            <Carousel responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={2000}> 
              {data.images.map((image, index) => ( 
                <div key={index}> 
                  <img src={image} alt={`Slide ${index}`} className="w-full max-h-80 object-cover" /> 
                </div> 
              ))} 
            </Carousel> 
          </div> 
          <div className="m-4 "> 
            <h1 className="text-2xl font-semibold">{data.name}</h1> 
 
 
          <p>
            <img 
            src={locationImg} 
            alt="Location Icon" 
            className="w-7 h-7 mr-2 cursor-pointer" 
            onClick={handleLocationClick} // Trigger map popup on click 
          /> {data.location}
          </p>
 
 
 
 
            <div className="flex items-center text-gray-500 mt-2"> 
              <span>Cities:{data.city.join(', ')}</span> 
            </div> 
            <div className="text-gray-500 mt-2"> 
              <span>Types: {data.types.join(', ')}</span> 
            </div> 
            <div className="text-gray-500 mt-2"> 
              <span> 
                Description: {data.description} 
              </span> 
            </div> 
          </div> 
        </div> 
      )} 
    </div> 
 
 
 
 
 
 
 
 
  ); 
}; 
 
export default LocationDetails;