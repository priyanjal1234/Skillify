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

  /* ---------------- SOCKET ---------------- */
  useEffect(() => {
    connectSocket();
  }, []);

  /* ---------------- QUERIES ---------------- */
  useQuery({
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
        if (error?.response?.data?.message === "Token not found") {
          dispatch(setLoggedin(false));
        }
        return {};
      }
    },
  });

  useQuery({
    queryKey: ["getGoogleUser"],
    queryFn: async () => {
      try {
        const res = await userService.getGoogleUser();
        if (res.data) dispatch(setLoggedin(true));
        return res.data;
      } catch (error) {
        return {};
      }
    },
  });

  useQuery({
    queryKey: ["getAllCourses"],
    queryFn: async () => {
      try {
        let getAllCoursesRes = await courseService.getAllCourses();
        return dispatch(setAllCourses(getAllCoursesRes.data));
      } catch {
        return;
      }
    },
  });

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Wrapper is needed so that footer (if you add one later) can stick to bottom */}
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <CalltoAction />
      </main>
      {/* Floating Bot Button */}
      <button
        onClick={() => navigate("/bot")}
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        Ask the Bot
      </button>
    </div>
  );
};

export default Home;