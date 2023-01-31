import React, { useContext } from "react";
import NavbarCustomized from "views/navbar/Navbar";
import { NavLink, Outlet } from "react-router-dom";
import { DarkModeContext } from "context/DarkModeContext";
import "assets/style/MainMenu.css";
import Navbar from 'react-bootstrap/Navbar';
import { useAuth, useAuthDispatch } from "context/AuthContextProvider";



const MainMenu = () => {
  const auth = useAuth();
  const dispatch = useAuthDispatch();
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div className="main-container">
      <NavbarCustomized />
      <div className={`mainmenu-container ${darkMode ? "dark" : ""}`}>
        <Outlet /> 
  
      </div>
    </div>
  );
};

export default MainMenu;
