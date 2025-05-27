import React, { useContext, useState } from "react";
import logo from "../assets/logo.png";
import "../styles/header.css";
import { ThemeContext } from "../context/ThemeProvider";
import { Moon, Sun, LogOut } from "lucide-react"; // Import logout icon
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user } = useUser();
  const navigate = useNavigate();

  // State to toggle mobile logout menu
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  // Helper function to toggle menu
  const toggleLogoutMenu = () => {
    setShowLogoutMenu((prev) => !prev);
  };

  return (
    <div className="header-container d-flex justify-content-between align-items-center py-3 px-4 px-md-5">
      <div className="d-flex gap-3 align-items-center">
        <img src={logo} alt="logo" className="logo-styling" />
        <span className={`fw-bold ${isDarkMode ? "text-color-dark" : "text-color-light"}`}>
          SeaFreight
        </span>
      </div>

      <div className="d-flex align-items-center gap-3 position-relative">
        <div onClick={toggleTheme} className="theme-toggle cursor-pointer">
          {isDarkMode ? <Sun /> : <Moon />}
        </div>

        {user ? (
          <>
            {/* User info visible only on md+ */}
            <div className="user-info d-none d-md-flex align-items-center gap-2">
              {user?.hasImage ? (
                <img
                  src={user.imageUrl}
                  alt={user.firstName || "User Avatar"}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span className="fw-bold">{user.firstName || user.emailAddresses[0].emailAddress}</span>
              )}
            </div>

            {/* Desktop logout button */}
            <SignOutButton>
              <button className="button d-none d-md-inline-block">Log Out</button>
            </SignOutButton>

            {/* Mobile: show avatar or logout icon that toggles logout menu */}
            <div className="d-md-none">
              <div onClick={toggleLogoutMenu} style={{ cursor: "pointer" }}>
                {user?.hasImage ? (
                  <img
                    src={user.imageUrl}
                    alt={user.firstName || "User Avatar"}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <LogOut size={24} />
                )}
              </div>

              {showLogoutMenu && (
                <div className="logout-menu">
                  <SignOutButton>
                    <button className="button">Log Out</button>
                  </SignOutButton>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="auth-buttons d-none d-md-flex gap-2">
            <button className="button" onClick={() => navigate("/sign-up")}>
              Sign Up
            </button>
            <button className="button" onClick={() => navigate("/sign-in")}>
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
