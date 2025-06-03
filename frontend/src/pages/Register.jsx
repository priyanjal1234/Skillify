import React from "react";

import { useParams } from "react-router-dom";
import StudentRegister from "../components/StudentRegister";
import InstructorRegister from "../components/InstructorRegister";

const Register = () => {
  const { name } = useParams();

  if (name === "student") {
    return <StudentRegister />;
  } else if (name === "instructor") {
    return <InstructorRegister />;
  }
};

export default Register;
