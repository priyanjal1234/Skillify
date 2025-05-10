import { useQuery } from "@tanstack/react-query";
import React from "react";
import analyticsService from "../services/Analytics";
import { useDispatch, useSelector } from "react-redux";
import {
  setTotalCourses,
  setTotalRevenue,
  setTotalStudents,
} from "../redux/reducers/InstructorReducer";
import AnalyticCard from "../components/AnalyticCard";
import { BookOpen, IndianRupee, Users } from "lucide-react";

const InstructorAnalytics = ({ instructorId }) => {
  let dispatch = useDispatch();

  let { totalCourses, totalStudents, totalRevenue } = useSelector((state) => state.instructor);

  useQuery({
    queryKey: ["fetchInstructorAnalytics"],
    queryFn: async function () {
      try {
        let instructorAnalyticsRes = await analyticsService.getInstructorAnalytics(instructorId);
        dispatch(setTotalCourses(instructorAnalyticsRes?.data?.totalCourses));
        dispatch(setTotalStudents(instructorAnalyticsRes?.data?.totalStudents?.length));
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
      <div className="flex flex-wrap gap-6">
        <AnalyticCard
          heading="Total Courses"
          icon={BookOpen}
          value={totalCourses?.length}
        />
        <AnalyticCard
          heading="Total Students"
          icon={Users}
          value={totalStudents}
        />
        <AnalyticCard
          heading="Total Revenue"
          icon={IndianRupee}
          value={`₹ ${totalRevenue}`}
        />
      </div>
    </div>
  );
};

export default InstructorAnalytics;