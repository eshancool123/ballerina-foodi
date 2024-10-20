import { FaSearch } from "react-icons/fa";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import Logo from "../Asserts/Logo.png";

// eslint-disable-next-line react/prop-types
export default function Header({ setSearchResults, user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    // Navigates to the LocationResult page with the search term in the query parameter
    navigate(`/locationResult?search=${searchTerm}`);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <a href="/" className="w-40 md:w-40 lg:w-40">
          <img src={Logo} alt="Logo" className="w-full h-auto" />
        </a>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="bg-slate-100 p-3 rounded-3xl flex items-center"
        >
          <input
            type="text"
            placeholder="Search Location..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-orange-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-orange-600 font-bold" : "text-slate-700"
            }
          >
            <li className="hidden sm:inline">Home</li>
          </NavLink>


          <NavLink
            to="/locationResult"
            className={({ isActive }) =>
              isActive ? "text-orange-600 font-bold" : "text-slate-700"
            }
          >
            <li className=" hidden sm:inline ">Locations</li>
          </NavLink>



          {user ? (
            <NavLink
              to="/addlocation"
              className={({ isActive }) =>
                isActive ? "text-orange-600 font-bold" : "text-slate-700"
              }
            >
              <li className=" hidden sm:inline ">Add Location</li>
            </NavLink>
          ) : ("")
          }


          {user ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "text-orange-600 font-bold" : "text-slate-700"
              }
            >
              <li className=" hidden sm:inline ">Profile</li>
            </NavLink>
          ) : (
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? "text-orange-600 font-bold" : "text-slate-700"
              }
            >
              <li className=" hidden sm:inline ">Sign in</li>
            </NavLink>
          )}


        </ul>
      </div>
    </header>
  );
}