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
import courseService from "../services/Course";
import { setAllCourses } from "../redux/reducers/CourseReducer";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "../socket/socket";

const Home = () => {
  const { darkMode } = useContext(ThemeDataContext);
  const dispatch = useDispatch();
  const { isLoggedin } = useSelector((state) => state.user);
  let navigate = useNavigate();

  useEffect(() => {
    connectSocket();
  }, []);

  // useEffect(() => {
  //   const cookie = document.cookie;
  //   dispatch(setLoggedin(!!cookie));
  // }, [dispatch]);

  useQuery({
    queryKey: ["loggedinUser"],
    queryFn: async function () {
      try {
        const res = await userService.getLoggedinUser();
        if (res.status === 200) {
          dispatch(setCurrentUser(res.data));
          return res.data;
        }
        return {};
      } catch (error) {
        console.log(error?.response?.data?.message);
        if (error?.response?.data?.message === "Token not found") {
          dispatch(setLoggedin(false));
        }
        return {};
      }
    },
  });

  useQuery({
    queryKey: ["getGoogleUser"],
    queryFn: async function () {
      try {
        const res = await userService.getGoogleUser();
        console.log("From Home")
        console.log(res.data)
        if(res.data) dispatch(setLoggedin(true))
        return res.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return {};
      }
    },
  });

  useQuery({
    queryKey: ["getAllCourses"],
    queryFn: async function () {
      try {
        let getAllCoursesRes = await courseService.getAllCourses();
        return dispatch(setAllCourses(getAllCoursesRes.data));
      } catch (error) {
        console.log(error?.response?.data?.message);
        return;
      }
    },
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

        <button
          onClick={() => navigate("/bot")}
          className="fixed bottom-5 right-5 bg-blue-600 text-white py-3 px-6 
                   rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          Ask the Bot
        </button>
      </div>
    </div>
  );
};

export default Home;
