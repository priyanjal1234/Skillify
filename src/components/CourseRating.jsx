import React from "react";
import { useQuery } from "@tanstack/react-query";
import courseService from "../services/Course";

const CourseRating = ({ courseId }) => {
  const { data: rating, isLoading, error } = useQuery({
    queryKey: ["fetchCourseRating", courseId],
    queryFn: async () => {
      const res = await courseService.getCourseRating(courseId);
      if (res.status === 200) {
        return Number(res.data);
      }
      throw new Error("Error fetching course rating");
    },
  });

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>N/A</span>;
  return <span>{rating}</span>;
};

export default CourseRating;
