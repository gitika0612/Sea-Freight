import React, { useContext } from "react";
import logo from "../assets/logo.png";
import "../styles/header.css";
import { ThemeContext } from "../context/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const { user } = useUser();
    const navigate = useNavigate();

    console.log(user, "user")

    return (
        <div className=" header-container d-flex justify-content-between py-3 px-5">
            <div className="d-flex gap-3 align-items-center">
                <img src={logo} alt="logo" className="logo-styling" />
                <span className={`fw-bold ${isDarkMode ? `text-color-dark` : `text-color-light`}`}>SeaFreight</span>
            </div>
            <div className="cursor-pointer gap-4 d-flex align-items-center">
                <div onClick={toggleTheme}>
                    {isDarkMode ? <Sun /> : <Moon />}
                </div>
                {user ? (
                    <>
                        {user?.hasImage === true ? (
                            <img
                                src={user.imageUrl}
                                alt={user.firstName || "User Avatar"}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginRight: "8px",
                                }}
                            />
                        ) : (
                            <span className="fw-bold">{user.firstName || user.emailAddresses[0].emailAddress}</span>
                        )}
                        <SignOutButton>
                            <button className="button">Log Out</button>
                        </SignOutButton>
                    </>
                ) : (
                    <>
                        <button className="button" onClick={() => navigate("/sign-up")}>
                            Sign Up
                        </button>
                        <button className="button" onClick={() => navigate("/sign-in")}>
                            Log In
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default Header