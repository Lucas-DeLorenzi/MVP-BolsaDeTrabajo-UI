import "./style/StudentForm.css";
import { DarkModeContext } from "context/DarkModeContext";
import React, { useContext } from "react";
import { CgWorkAlt } from "react-icons/cg";
import { BiHistory } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";

import { NavLink, Outlet } from "react-router-dom";

const StudentForm = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div>
      <div className={`buttons-carreras ${darkMode ? "dark" : ""}`}>

        <NavLink
          to="offers"
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
          <p><CgWorkAlt/></p>
          <p>Ofertas laborales</p>
        </NavLink>

        <NavLink
          to="history"
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
          <p><BiHistory/></p>
            <p>Historial</p>
        </NavLink>

        <NavLink
          to="profile"
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
            <p>Mi perfil</p>
        </NavLink>
      </div>
      <Outlet/>
    </div>
  );
};

export default StudentForm;
