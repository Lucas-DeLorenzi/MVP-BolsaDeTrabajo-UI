import React, { useContext } from "react";
import { DarkModeContext } from "context/DarkModeContext";
import { NavLink, Outlet } from "react-router-dom";
import { FaUniversity } from "react-icons/fa";

const Searches = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div>
      <div className={`buttons-carreras ${darkMode ? "dark" : ""}`}>

          <NavLink
            to="personalData"
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
            <p>Datos personales</p>
          </NavLink>

          <NavLink
            to="universityData"
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
            <p>Datos universitarios</p>
          </NavLink>

          <NavLink
            to="otherData"
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
            <p>Otros datos</p>
          </NavLink>

          <NavLink
            to="knowledgements"
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
            <p> Actualizar conocimientos</p>
          </NavLink>


      </div>
      <Outlet />
    </div>
  );
};

export default Searches;
