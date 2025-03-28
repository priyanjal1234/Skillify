import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import enrollmentService from "../services/Enrollment";
import { useDispatch, useSelector } from "react-redux";
import { setEnrolledStudents } from "../redux/reducers/EnrollmentReducer";
import { ThemeDataContext } from "../context/ThemeContext";

const InstructorStudents = () => {
  const dispatch = useDispatch();
  const { enrolledStudents } = useSelector((state) => state.enrollment);
  const { darkMode } = useContext(ThemeDataContext);

  useQuery({
    queryKey: ["fetchEnrolledStudents"],
    queryFn: async () => {
      try {
        const enrolledStudentsRes =
          await enrollmentService.getEnrolledStudents();
        dispatch(setEnrolledStudents(enrolledStudentsRes.data));
        return enrolledStudentsRes.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return [];
      }
    },
  });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-5 text-center">
        Enrolled Students
      </h1>

      {Array.isArray(enrolledStudents) && enrolledStudents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            {/* TABLE HEADER */}
            <thead
              className={`${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              <tr className="text-sm md:text-base">
                <th className="px-4 py-2 md:px-6 md:py-3 border">Student</th>
                <th className="px-4 py-2 md:px-6 md:py-3 border">Email</th>
                <th className="px-4 py-2 md:px-6 md:py-3 border">Role</th>
                <th className="px-4 py-2 md:px-6 md:py-3 border">Verified</th>
                <th className="px-4 py-2 md:px-6 md:py-3 border">Date Joined</th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody
              className={`divide-y ${
                darkMode ? "divide-gray-700 text-white" : "divide-gray-200 text-gray-900"
              }`}
            >
              {enrolledStudents.map((student) => (
                <tr
                  key={student._id}
                  className={`text-sm md:text-base ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  {/* Student Name & Avatar */}
                  <td className="px-4 py-2 md:px-6 md:py-4 border flex items-center space-x-3">
                    <img
                      src={student?.student?.profileImage}
                      alt={student?.student?.name}
                      className="h-8 w-8 md:h-10 md:w-10 object-cover rounded-full"
                    />
                    <span className="truncate">{student?.student?.name}</span>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-2 md:px-6 md:py-4 border truncate">
                    {student?.student?.email}
                  </td>

                  {/* Role */}
                  <td className="px-4 py-2 md:px-6 md:py-4 border capitalize">
                    {student?.student?.role}
                  </td>

                  {/* Verified */}
                  <td className="px-4 py-2 md:px-6 md:py-4 border">
                    {student?.student?.isVerified ? "Yes" : "No"}
                  </td>

                  {/* Date Joined */}
                  <td className="px-4 py-2 md:px-6 md:py-4 border">
                    {new Date(student?.student?.dateJoined).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-lg mt-6">No Enrolled Students Yet</p>
      )}
    </div>
  );
};

export default InstructorStudents;
