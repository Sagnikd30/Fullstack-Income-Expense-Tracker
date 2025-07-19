import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { validateEmail } from "../../utils/helper";
import CardImage from "../../assets/images/Card2.png";
import ProfilePhotoSelector from "../../components/ProfilePhotoSelector";
import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

export default function SignUp() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.password || !selectedImage) {
      return setError("All fields including profile photo are required.");
    }

    if (!validateEmail(form.email)) return setError("Invalid email format.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");

    setError("");
    try {
      const imgRes = await uploadImage(selectedImage);
      const profileImageUrl = imgRes.imageUrl;

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        ...form,
        profilePic: profileImageUrl,
      });

      const { token, ...user } = response.data;
      localStorage.setItem("token", token);
      updateUser(user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl shadow-lg rounded-lg overflow-hidden">
        <div className="p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-6">Expense Tracker</h1>
          <h2 className="text-xl font-semibold mb-2">Create an Account</h2>
          <p className="text-gray-500 mb-6">Join us today by entering your details below.</p>
          {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

          <div className="flex justify-center mb-4">
            <ProfilePhotoSelector selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              name="fullName"
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md"
              onChange={handleChange}
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md"
                onChange={handleChange}
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md">
              SIGN UP
            </button>
          </form>

          <p className="text-sm mt-6 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-medium hover:underline">
              Login
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
