import React, { useContext } from "react";
import Header from "./components/Header";
import { ThemeContext } from "./context/ThemeProvider";
import './App.css';
import HeroSection from "./components/HeroSection"

const SeaFreight = () => {
    const { isDarkMode } = useContext(ThemeContext);

    return (
        <div className={`App ${isDarkMode ? "dark" : "light"}`} >
            <Header />
            <div className="padding-top-header">
                <HeroSection />
            </div>

        </div>
    )
}

export default SeaFreight