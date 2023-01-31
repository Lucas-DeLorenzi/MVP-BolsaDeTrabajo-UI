import React, { useContext } from "react";
import { DarkModeContext } from "context/DarkModeContext";
import { NavLink, Outlet } from "react-router-dom";
import { FaUniversity } from "react-icons/fa";
import { AiOutlineUser, AiOutlineTable, AiOutlineBorderlessTable, AiFillCaretDown } from "react-icons/ai";
import { GrGroup } from "react-icons/gr";

const Searches = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div>
      <div className={`buttons-carreras ${darkMode ? "dark" : ""}`}>

          <NavLink
            to="internships"
            className={({ isActive }) =>
            isActive
              ? darkMode
                ? "active-labels-carreras tab dark"
                : "active-labels-carreras tab"
              : darkMode
              ? "labels-carreras dark"
              : "labels-carreras"
          }
          >
            <p><AiOutlineUser/></p>
            <p>Pasantías</p>
          </NavLink>

          <NavLink
            to="jobs"
            className={({ isActive }) =>
            isActive
              ? darkMode
                ? "active-labels-carreras tab dark"
                : "active-labels-carreras tab"
              : darkMode
              ? "labels-carreras dark"
              : "labels-carreras"
          }
          >
            <p><FaUniversity/></p>
            <p>Empleos</p>
          </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default Searches;
