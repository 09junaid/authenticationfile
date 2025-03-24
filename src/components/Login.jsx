import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { handleError,handleSuccess } from '../utils';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export const Login = () => {
  const navigate=useNavigate();
  const [loginInput,setLoginInput]=useState({
    email:"",
    password:""
  })
  const handleInput=(e)=>{
    setLoginInput({...loginInput,[e.target.name]:e.target.value})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginInput.email || !loginInput.password) {
      return handleError("Fill all the fields");
    }
    try {
      const url = "http://localhost:1000/api/login";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInput),
      });
  
      const data = await response.json();
      // ✅ Check if response is NOT OK (Means invalid credentials or server error)
      if (!response.ok) {
        if (data.issues && Array.isArray(data.issues)) {
          return handleError(data.issues.map(issue => issue.message).join(", "));
        }
        return handleError(data.message || "Invalid credentials, please try again.");
      }
  
      // ✅ If login is successful
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user.name));
  
      console.log("Login Success:", data);
      handleSuccess("Login Success");
      setLoginInput({ email: "", password: "" });
  
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
  
    } catch (error) {
      handleError("Something went wrong. Please try again.");
      console.error("Login Error:", error);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster
      gutter={8}
      />
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-gray-300">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name='email'
            value={loginInput.email}
            onChange={handleInput}
            placeholder="Enter your email"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name='password'
            value={loginInput.password}
            onChange={handleInput}
            placeholder="Enter your password"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type='submit' className="w-full bg-blue-500 text-white py-3 rounded-xl cursor-pointer hover:bg-blue-600 transition">
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-blue-500 font-bold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};