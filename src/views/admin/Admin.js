import React, { useContext } from "react";
import { DarkModeContext } from "context/DarkModeContext";
import { NavLink, Outlet } from "react-router-dom";
import { FaUniversity } from "react-icons/fa";
import { AiOutlineUser, AiOutlineTable, AiOutlineBorderlessTable, AiFillCaretDown } from "react-icons/ai";
import { GrGroup } from "react-icons/gr";

const Admin = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div>
      <div className={`buttons-carreras ${darkMode ? "dark" : ""}`}>

          <NavLink
            to="users"
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
            <p>Usuarios</p>
          </NavLink>

          <NavLink
            to="careers"
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
            <p>Carreras</p>
          </NavLink>

          <NavLink
            to="auxTables"
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
            <p><AiOutlineTable/></p>
            <p>Tablas Auxiliares</p>
          </NavLink>
          
          <NavLink
            to="searches"
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
            <p><AiFillCaretDown/></p>
            <p>Búsquedas</p>
          </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default Admin;
