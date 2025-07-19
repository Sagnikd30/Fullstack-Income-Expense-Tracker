import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../utils/data";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/apiPaths"; 

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handelLogout();
      return;
    }
    navigate(route);
  };

  const handelLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

   console.log("User:", user);

  const profileImageSrc = user?.profilePic
    ? `${BASE_URL}/uploads/${user.profilePic}`
    : "/default-avatar.png"; // fallback image in public/

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center mb-7">
        <img
          src={profileImageSrc}
          alt="Profile"
          className="w-20 h-20 bg-slate-400 rounded-full object-cover mb-2 shadow-md"
        />
        <h5 className="text-gray-950 font-semibold leading-6 text-center">
          {user?.fullName || ""}
        </h5>
      </div>

      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu === item.label
              ? "text-white bg-primary"
              : "text-gray-700"
          } py-3 px-6 rounded-lg mb-3`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;

