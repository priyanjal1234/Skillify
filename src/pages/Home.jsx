import React, { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import CalltoAction from "../components/CalltoAction";
import { ThemeDataContext } from "../context/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import userService from "../services/User";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, setLoggedin } from "../redux/reducers/UserReducer";

const Home = () => {
  const { darkMode } = useContext(ThemeDataContext);
  const dispatch = useDispatch();
  const { isLoggedin } = useSelector((state) => state.user);

  useEffect(() => {
    const cookie = document.cookie;
    dispatch(setLoggedin(!!cookie));
  }, [dispatch]);

  const { data: loggedInUser } = useQuery({
    queryKey: ["loggedinUser"],
    queryFn: async () => {
      try {
        const res = await userService.getLoggedinUser();
        if (res.status === 200) {
          dispatch(setCurrentUser(res.data));
          return res.data;
        }
        return {};
      } catch (error) {
        console.log(error?.response?.data?.message);
        return {};
      }
    },
    enabled: isLoggedin,
  });

  const { data: googleUser } = useQuery({
    queryKey: ["getGoogleUser"],
    queryFn: async () => {
      try {
        const res = await userService.getGoogleUser();
        return res.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return {};
      }
    },
    enabled: isLoggedin,
  });

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="transition-colors duration-200">
        <Navbar />
        <Hero />
        <Features />
        <CalltoAction />
      </div>
    </div>
  );
};

export default Home;
