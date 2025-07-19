import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import CardImage from "../../assets/images/Card2.png";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("All fields are required.");
    if (!validateEmail(email)) return setError("Invalid email format.");
    setError("");

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      const { token, ...user } = res.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl shadow-lg rounded-lg overflow-hidden">
        <div className="p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-6">Expense Tracker</h1>
          <h2 className="text-xl font-semibold mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-6">Please enter your details to log in</p>
          {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-2.5 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md">
              LOGIN
            </button>
          </form>
          <p className="text-sm mt-6 text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-purple-600 font-medium hover:underline">
              SignUp
            </Link>
          </p>
        </div>
        <div className="hidden md:flex flex-col bg-[#f5f3ff] items-center justify-center p-10 rounded-r-lg">
          <div className="bg-white p-4 rounded-xl shadow mb-6">
            <p className="text-sm text-gray-500">Track Your Income & Expenses</p>
            <h2 className="text-2xl font-bold mt-1 text-gray-800">$430,000</h2>
          </div>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <img src={CardImage} alt="Chart Preview" className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

