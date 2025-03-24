import React, { useState } from "react";
import { Link } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const navigate=useNavigate();
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInput=(e)=>{
    const {name,value}=e.target;
    setUserInput((prev)=>({...prev,[name]:value}));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Input validation
    if (!userInput.name || !userInput.email || !userInput.password) {
      return handleError("Fill all the fields");
    }
  
    try {
      const url = "http://localhost:1000/api/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInput),
      });
  
      // Parse JSON response
      const data = await response.json();
  
      // Handle response errors
      if(!response.ok){
        if (data.issues && Array.isArray(data.issues)) {
          return handleError(data.issues.map(issue => issue.message).join(", ")); 
        }
         return handleError(data.message || "Invalid credentials, please try again.");
      }
     
      
  
      // Success case
      console.log("Signup Success:", data);
      handleSuccess("User registered successfully");
  
      // Redirect after a delay to show success message
      setTimeout(() => {
        navigate("/login");
      }, 2000); // 1.5 second delay
  
    } catch (error) {
      handleError(error.message || "Something went wrong");
    }
  };
  
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster/>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-gray-300">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={userInput.name}
            onChange={handleInput}
            placeholder="Enter your full name"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={userInput.email}
            onChange={handleInput}
            placeholder="Enter your email"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={userInput.password}
            onChange={handleInput}
            placeholder="Enter your password"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-3 cursor-pointer rounded-xl hover:bg-blue-600 transition">
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to={"/"} className="text-blue-500 font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};



export default Signup;
