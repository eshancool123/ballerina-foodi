import React, { useState, useRef, useEffect } from "react";
import { app } from "../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'; // Importing uuid for generating unique IDs
import MapPopup from "../components/MapPopup";
import ScrollIndicator from "../components/ScollIndicator";

export default function AddLocation() {

  const [countOne, setcountOne] = useState(4);
  const [countTwo, setcountTwo] = useState(4);

  const [LocationData, setLocationData] = useState({
    name: "",
    location: "",
    description: "",
    types: [], // Adjusted to 'types'
    city: [],  // Adjusted to 'city'
  });


  // Define the options for types and cities
  const typesOptions = [
    "Fried Snacks",
    "Roti and Bread Dishes",
    "Rice and Curry",
    "Seafood Dishes",
    "Sweets and Desserts",
    "Fresh Fruit and Juices",
  ];

  const cityOptions = [
    "Colombo",
    "Kandy",
    "Galle",
    "Jaffna",
    "Negombo",
  ];

  const [files, setFiles] = useState([]);
  const [fileUploadProgress, setFileUploadProgress] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadInitiated, setIsUploadInitiated] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);


  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (checked) {
        setLocationData({
          ...LocationData,
          [name]: [...LocationData[name], value],
        });
      } else {
        setLocationData({
          ...LocationData,
          [name]: LocationData[name].filter((item) => item !== value),
        });
      }
    } else {
      setLocationData({ ...LocationData, [name]: value });
    }
  }


  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length <= 6) {
      setFiles(selectedFiles);
      setIsUploadInitiated(false);
    } else {
      alert("You can upload a maximum of 6 images");
    }
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, fileIndex) => fileIndex !== index);
    const updatedProgress = fileUploadProgress.filter((_, progressIndex) => progressIndex !== index);
    const updatedUrls = uploadedUrls.filter((_, urlIndex) => urlIndex !== index);
    setFiles(updatedFiles);
    setFileUploadProgress(updatedProgress);
    setUploadedUrls(updatedUrls);
  };



  const uploadFilesToFirebase = () => {
    if (!files.length) return;

    setIsUploading(true);
    setFileUploadProgress([]);
    setUploadedUrls([]);
    setIsUploadInitiated(true);

    // Make sure Firebase app is initialized
    const storage = getStorage(app); // Pass the 'app' here
    let progressArray = [];
    let urlArray = [];

    files.forEach((file, index) => {
      const storageRef = ref(storage, `location_images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressArray[index] = Math.round(progress);
          setFileUploadProgress([...progressArray]);
        },
        (error) => {
          console.error(`Error uploading file ${index + 1}:`, error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            urlArray[index] = downloadURL;
            setUploadedUrls([...urlArray]);
          });
        }
      );
    });
  };


  const renderUploadProgressAndImages = () => {
    if (!isUploadInitiated) return null;

    return files.map((file, index) => (
      <div key={index} className="flex justify-between items-center bg-slate-200 p-2 rounded-lg mb-3 mt-3">
        {uploadedUrls[index] && <img className="w-20 h-16" src={uploadedUrls[index]} alt={`Uploaded Image ${index + 1}`} style={{ width: "100px" }} />}
        <p>{fileUploadProgress[index] === 100 ? 'Uploaded' : `${fileUploadProgress[index] || 0}%`}</p>

        <button
          className="text-red-500 p-2 rounded-lg mx-2"
          onClick={() => removeFile(index)}
        >
          Remove
        </button>
      </div>
    ));
  };

  const checkUserCookie = () => {
    const cookie = document.cookie
      .split(";")
      .find((item) => item.trim().startsWith("username="));
    return cookie ? cookie.split("=")[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setSuccessMsg("");
    setLoading(true);

    const user = checkUserCookie(); // Replace with your actual user retrieval logic

    // Generate a unique ID for the location data
    const locationId = uuidv4();


    const dataToSubmit = {
      uid: locationId,
      user: user, // Cookie user or current session user
      name: LocationData.name,
      location: LocationData.location,
      description: LocationData.description,
      types: LocationData.types, // Updated to use 'types'
      city: LocationData.city,   // Updated to use 'city'
      images: uploadedUrls,      // Use the uploaded image URLs
      mapData: [String(mapLocation.lat), String(mapLocation.lng)] // Adjust this according to your needs
    };


    const url = "http://localhost:9100/crossOriginService/AddLocations";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      if (res.ok) {
        setSuccessMsg("Location added successfully!");
      } else {
        const responseText = await res.text();
        setErrMsg("Request failed: " + responseText);
      }
    } catch (error) {
      setErrMsg("An error occurred during submission");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (mapLocation) {
      setLocationData((prevData) => ({
        ...prevData,
        mapData: [mapLocation.lat, mapLocation.lng],
      }));
    }
  }, [mapLocation]);

  return (

    <div className="max-w-6xl mx-auto p-6 my-10 bg-white shadow-md rounded-lg">
      <h1 className="font-bold text-4xl mb-10 text-center text-gray-700">
        Add Location
      </h1>
      <form className="flex flex-col pt-3 items-start" onSubmit={handleSubmit}>
        {errMsg && <p className="text-red-500">{errMsg}</p>}
        {successMsg && <p className="text-green-500">{successMsg}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
          {/* Left Column: Form Section */}
          <div className="w-full">
            <input
              type="text"
              name="name"
              placeholder="Foodi Name"
              value={LocationData.name}
              onChange={handleInputChange}
              className="bg-gray-200 focus:outline-none w-full p-3 my-3 rounded-lg placeholder-gray-500"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={LocationData.location}
              onChange={handleInputChange}
              className="bg-gray-200 focus:outline-none w-full p-3 my-3 rounded-lg placeholder-gray-500"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={LocationData.description}
              onChange={handleInputChange}
              className="bg-gray-200 focus:outline-none w-full p-3 my-3 rounded-lg placeholder-gray-500"
            />

            {/* Type checkboxes */}
            <p className="font-semibold mb-2">Type:</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {typesOptions.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-warning w-4 h-4"
                    value={type}
                    name="types"
                    onChange={handleInputChange}
                  />
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>

            {/* City checkboxes */}
            <p className="font-semibold mb-2">Outlets:</p>
            <div className="grid grid-cols-3 gap-5 mb-5">
              {cityOptions.map((city) => (
                <div key={city} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-warning w-4 h-4"
                    value={city}
                    name="city"
                    onChange={handleInputChange}
                  />
                  <span className="text-sm">{city}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: File Upload and Map Section */}
          <div className="w-full">
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              ref={fileRef}
              className="my-3 p-3 w-full bg-gray-200 rounded-lg"
            />
            {renderUploadProgressAndImages()}
            <button
              className="btn bg-blue-500 text-white w-full rounded-3xl py-2 mt-2 hover:bg-blue-700"
              onClick={uploadFilesToFirebase}
              disabled={!files.length || isUploading}
              type="button"
            >
              {isUploading ? "Uploading..." : "Upload Images"}
            </button>

            <button
              type="button"
              className="mt-5 py-2 px-3 bg-yellow-400 font-semibold text-white rounded-3xl"
              onClick={() => setShowMap(true)}
            >
              Add Location From Map
            </button>
            {showMap && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-3xl">
                  <MapPopup
                    setShowMap={setShowMap}
                    setMapLocation={setMapLocation}
                    mapLocation={mapLocation}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center w-full">
          <button
            type="submit"
            className="mt-10 w-2/3 p-3 bg-orange-500 font-semibold text-white rounded-3xl"
          >
            {loading ? "Submitting..." : "Submit Location"}
          </button>
        </div>
      </form>
      <ScrollIndicator />
    </div>


  );
}


























