import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import React, { useState, useEffect } from "react";
import About from "./Pages/About";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import Description from "./Pages/Description";
import AddLocation from "./Pages/AddLocation";
import LocationResult from "./Pages/LocationResult";
import { Menu } from './Pages/Menu';

export default function App() {
  // Function to check for the username cookie
  const checkUserCookie = () => {
    return document.cookie.split(";").some((item) => item.trim().startsWith("username="));
  };

  const [user, setUser] = useState(checkUserCookie()); // Initialize user based on cookie check
  const [id, setId] = useState(0);
  const [searchResults, setSearchResults] = useState([]);

  // Update user state based on cookie existence
  useEffect(() => {
    const cookieExists = checkUserCookie();
    setUser(cookieExists);
  }, []); // Only run on component mount

  return (
    <BrowserRouter>
      <Header setSearchResults={setSearchResults} user={user} />
      <Routes>
        <Route path="/" element={<Home setId={setId} />} />
        <Route path="/about" element={<About />} />
        <Route 
          path="/register"
          element={<Register setUser={setUser} />}
        />
        <Route path="/profile" element={<Profile setUser={setUser} />} />
        <Route 
          path="/description/:uid" // Using uid from URL params
          element={<Description />} 
        />
        <Route 
          path="/addlocation"
          element={<AddLocation />} 
        />
        <Route path="/locationResult" element={<LocationResult setId={setId} />} />
        <Route path='/menu' element={<Menu />} />
        <Route path="*" element={<NotFound />} /> {/* Not found route */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

// NotFound component for 404 handling
const NotFound = () => {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};
