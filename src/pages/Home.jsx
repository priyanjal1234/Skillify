import React, { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import CalltoAction from "../components/CalltoAction";
import { ThemeDataContext } from "../context/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import userService from "../services/User";
import { useDispatch } from "react-redux";
import { setCurrentUser, setLoggedin } from "../redux/reducers/UserReducer";

const Home = () => {
  const { darkMode } = useContext(ThemeDataContext);
  let dispatch = useDispatch();

  async function fetchLoggedinUser() {
    try {
      let fetchLoggedinUserRes = await userService.getLoggedinUser();
      dispatch(
        setCurrentUser(
          fetchLoggedinUserRes.status === 200 ? fetchLoggedinUserRes.data : {}
        )
      );
      return fetchLoggedinUserRes.data;
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  }

  async function fetchGoogleLoggedinUser() {
    try {
      let googleUserRes = await userService.getGoogleUser();
      return googleUserRes.data;
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  }

  const query1 = useQuery({
    queryKey: ["loggedinUser"],
    queryFn: fetchLoggedinUser,
  });

  const {data} = useQuery({
    queryKey: ["getGoogleUser"],
    queryFn: fetchGoogleLoggedinUser,
  });


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
