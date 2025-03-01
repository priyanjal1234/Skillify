import { useQuery } from "@tanstack/react-query";
import React from "react";
import analyticsService from "../services/Analytics";
import { useDispatch } from "react-redux";
import {
  setTotalCourses,
  setTotalRevenue,
  setTotalStudents,
} from "../redux/reducers/InstructorReducer";

const InstructorAnalytics = ({ instructorId }) => {
  let dispatch = useDispatch();
  useQuery({
    queryKey: ["fetchInstructorAnalytics"],
    queryFn: async function () {
      try {
        let instructorAnalyticsRes =
          await analyticsService.getInstructorAnalytics(instructorId);
        dispatch(setTotalCourses(instructorAnalyticsRes?.data?.totalCourses));
        dispatch(setTotalStudents(instructorAnalyticsRes?.data?.totalStudents));
        dispatch(setTotalRevenue(instructorAnalyticsRes?.data?.totalRevenue));

        return instructorAnalyticsRes.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return [];
      }
    },
  });

  return (
    <div className="p-3">
      <h1 className="text-3xl font-semibold mb-8">Key Analytics</h1>
    </div>
  );
};

export default InstructorAnalytics;
