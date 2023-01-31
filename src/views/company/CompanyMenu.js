import React, { useContext } from "react";
import "./CompanyMenu.css";
import { NavLink, Outlet } from "react-router-dom";

import { DarkModeContext } from "context/DarkModeContext";

import { FaShoppingBag } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { BsPlusLg } from "react-icons/bs";

const Ofertas = () => {
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
          <p><BsPlusLg/></p>
          <p>Crear oferta</p>
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
          <p><FaShoppingBag /></p>
          <p>Historial ofertas</p>
        </NavLink>

        <NavLink
          to="companyprofile"
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
          <AiOutlineUser />
          <p>Mi perfil</p>
        </NavLink>
      </div>

      <Outlet/>

    </div>
  );
};

export default Ofertas;
