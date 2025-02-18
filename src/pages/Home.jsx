import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import CalltoAction from "../components/CalltoAction";
import { ThemeDataContext } from "../context/ThemeContext";

const Home = () => {
  const {darkMode} = useContext(ThemeDataContext)
  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className={`transition-colors duration-200`}>
        <Navbar />
        <Hero />

        <Features />

        <CalltoAction />
      </div>
    </div>
  );
};

export default Home;
