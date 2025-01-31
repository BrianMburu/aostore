import React from "react";
import HeroImage from "./../../../public/aostorelogo.png"; // Replace with an Arweave/Aostore-themed image
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const Home = () => {
  return (
    <div
      name="home"
      className="h-screen w-full bg-gradient-to-b from-black via-gray-900 to-gray-800"
    >
      <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row items-center justify-center h-full px-4">
        {/* Left Content */}
        <div className="flex flex-col justify-center h-full md:w-1/2">
          <h2 className="text-4xl sm:text-6xl font-bold text-white">
            Welcome to <span className="text-cyan-500">Aostore</span>
          </h2>

          <p className="text-gray-400 py-4 max-w-md text-lg">
            <h6 className="text-3xl font-bold">
              Aostore is the Arweave and aocomputer playstore.
            </h6>
            Discover,collaborate, and build reputation on the Permaweb. Earn
            rewards for meaningful contributions and help shape the future of
            decentralized applications.
          </p>

          <div></div>
        </div>

        {/* Right Content - Image */}
        <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
          <img
            src={HeroImage}
            alt="Aostore Platform"
            className="rounded-2xl mx-auto w-1/2 md:w-full hover:scale-105 transform transition duration-300 shadow-lg shadow-cyan-500/50"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
