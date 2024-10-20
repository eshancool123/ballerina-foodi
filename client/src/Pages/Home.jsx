import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import girlimage from "../Asserts/girl.jfif";
import ImageSlider from "../components/ImageSlider";
import { Menu } from "./Menu";
import { City } from "../components/City";
import { City2 } from "../components/city2";
import ScrollIndicator from "../components/ScollIndicator";




export default function Home() {
  const [countOne, setcountOne] = useState(4);
  const [countTwo, setcountTwo] = useState(4);
  


  return (
    <div>
      <div className="md:flex md:justify-center md:items-center max-w-6xl mx-auto p-3">
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="font-bold text-5xl">
            Your <span className="text-orange-600">Street Food</span>
            <br /> Adventure Starts Here
          </h1>
          <br></br>
          <p className="font-semibold pt-6  text-slate-500 hidden sm:inline">
            Explore the best street food spots shared by fellow foodies. From
            sizzling snacks to local favorites, your next tasty adventure is
            just a tap away!
          </p>
          <div className="sm:flex justify-center md:justify-start ">

            <Link
              to={"/locationResult"}
              className="btn-attractive1 font-semibold m-6 ml-0 sm:justify-center"
            >
              Explore Location
            </Link>



            {/* <button className="bg-orange-500 rounded-3xl p-3 mt-7 mx-4 text-white"> */}
            <Link
              to={"/addlocation"}
              className="btn-attractive font-semibold m-6 sm:justify-center"
            >
              Add Location
            </Link>
          </div>
        </div>

        <div className="mt-7 md:mt-0 md:w-1/2 flex justify-center">
          <img
            src={girlimage}
            alt="Girl Image"
            className="w-6/12 md:w-full object-contain "
          />
        </div>
      </div>


      {/* slider */}

      <div className="items-center justify-center ">
        <header className="App-header ">
          <ImageSlider />
        </header>
      </div>





      <div className="md:justify-center md:items-center max-w-6xl mx-auto px-10 mt-18 ">
        <h1 className="font-bold text-3xl text-orange-600">Colombo Explores</h1>
        <p className="font-bold" onClick={() => setcountOne(100)}>show more</p>
      </div>


      {/* Grid layout for Explore components */}

      <div className="">
        <City />
      </div>



      <div className="md:justify-center md:items-center max-w-6xl mx-auto px-10 mt-3">
        <h1 className="font-bold text-3xl text-orange-600">Galle Explores</h1>
        <p className="font-bold" onClick={() => setcountTwo(100)}>show more</p>
      </div>

      <div>
        {/* Grid layout for Explore components */}

        <div>
          <City2 />
        </div>


      </div>


      <div className="md:flex md:justify-center md:items-center max-w-6xl mx-auto p-3 m-5 mb-16">

      <div className="bg-gray-100 flex items-center justify-center mb-18">
      <div className="bg-white p-8 rounded-lg  flex items-center justify-center">
        <div className="w-1/2">
          <img 
            src="https://storage.googleapis.com/a1aa/image/uVaefoDRyfNRypjKhekU7Bprv5nK88TCGhfym4PYgpx19JFdC.jpg" 
            alt="A laptop and smartphone displaying a street food discovery platform, surrounded by various street food items like burgers, hotdogs, and drinks." 
            className="rounded-3xl shadow-lg"
            width="420"
            height="300"
          />
        </div>
        <div className="w-1/2 pl-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About <span className="text-orange-500">Street Food</span></h1>
          <p className="text-lg font-bold mb-4">Welcome to FoodFind, your ultimate street food discovery platform!</p>
          <p className="text-gray-700">
            At FoodFind,<br/>
            we believe that the best culinary experiences are often found in the most unexpected places on the streets! Our platform connects street food lovers with the best hidden gems in your city and beyond. Whether you re craving something savory, sweet, or spicy, FoodFind helps you discover new flavors and share your own street food experiences with the world.
          </p>
        </div>
      </div>
    </div>






      </div>

      <ScrollIndicator />
    </div>
  );
}
