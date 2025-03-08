import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import enrollmentService from "../services/Enrollment";
import { useDispatch, useSelector } from "react-redux";
import { setEnrolledStudents } from "../redux/reducers/EnrollmentReducer";
import { ThemeDataContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const InstructorStudents = () => {
  const dispatch = useDispatch();
  const { enrolledStudents } = useSelector((state) => state.enrollment);

  let { darkMode } = useContext(ThemeDataContext);
  let navigate = useNavigate();

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
    <div>
      <h1 className="text-3xl font-semibold mb-5">Enrolled Students</h1>

      {Array.isArray(enrolledStudents) && enrolledStudents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* TABLE HEADER */}
            <thead
              className={
                darkMode
                  ? "bg-gray-700/50 text-white"
                  : "bg-gray-50 text-gray-900"
              }
            >
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date Joined
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody
              className={
                darkMode
                  ? "divide-y divide-gray-700 text-white"
                  : "divide-y divide-gray-200 text-gray-900"
              }
            >
              {enrolledStudents.map((student) => (
                <tr
                  key={student._id}
                  className={
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }
                >
                  {/* Student Name & Avatar */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={student?.student?.profileImage}
                        alt={student?.student?.name}
                        className="h-10 w-10 object-cover rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium">
                          {student.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {student?.student?.email}
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                    {student?.student?.role}
                  </td>

                  {/* Verified */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {student?.student?.isVerified ? "Yes" : "No"}
                  </td>

                  {/* Date Joined */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(
                      student?.student?.dateJoined
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No Enrolled Students Yet</p>
      )}
    </div>
  );
};

export default InstructorStudents;
