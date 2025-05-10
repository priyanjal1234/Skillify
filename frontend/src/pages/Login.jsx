import React from 'react'
import { useParams } from 'react-router-dom'
import StudentLogin from '../components/StudentLogin'
import InstructorLogin from '../components/InstructorLogin'

const Login = () => {
    let { name } = useParams()
    if(name === "student") {
        return <StudentLogin />
    }
    else if(name === "instructor") {
        return <InstructorLogin />
    }
} 

export default Login