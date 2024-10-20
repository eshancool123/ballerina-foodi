import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Asserts/Logo.png";
import twiter from "../Asserts/twiter.png";
import facebook from "../Asserts/facebook.png";
import youtube from "../Asserts/youtube.png";

export default function Footer() {
  return (
    <div>
      {/* Main Footer Section */}
      <div className="sm:flex sm:justify-between sm:items-center max-w-6xl mx-auto p-3 text-center sm:text-left">
        <img src={Logo} alt="Logo" className="mx-auto sm:mx-0 w-1/5" />

        <div className="mt-5 sm:mt-0 sm:w-1/5">
          <p className="text-slate-500">Useful links</p>
          <Link to="/about" className="block">About us</Link>
          <Link to="/" className="block">Events</Link>
          <Link to="/" className="block">Blogs</Link>
          <Link to="/" className="block">FAQ</Link>
        </div>

        <div className="mt-5 sm:mt-0 sm:w-1/5">
          <p className="text-slate-500">Main Menu</p>
          <Link to="/" className="block">Home</Link>
          <Link to="/" className="block">OffersMenus</Link>
          <Link to="/" className="block">Reservation</Link>
        </div>

        <div className="mt-5 sm:mt-0 sm:w-1/5">
          <p className="text-slate-500">Contact Us</p>
          <Link to="/" className="block">foodiefinds@email.com</Link>
          <Link to="/" className="block">+64 958 248 966</Link>
          <Link to="/" className="block">Social media</Link>
        </div>
      </div>

      {/* Social Media & Copyright Section */}
      <div className="sm:flex sm:justify-between items-center max-w-6xl mx-auto p-3 text-center">
        <p className="text-slate-500">Copyright © 2024 - All right reserved</p>
        <div className="flex justify-center sm:justify-end mt-5 sm:mt-0">
          <img src={twiter} alt="twiter" className="w-8 h-8 mx-2" />
          <img src={facebook} alt="facebook" className="w-8 h-8 mx-2" />
          <img src={youtube} alt="youtube" className="w-8 h-8 mx-2" />
        </div>
      </div>
    </div>
  );
}
