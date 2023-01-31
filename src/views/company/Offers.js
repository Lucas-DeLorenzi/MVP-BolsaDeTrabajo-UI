import React, { useContext } from "react";
import "./Offers.css";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "context/AuthContextProvider";

import { DarkModeContext } from "context/DarkModeContext";
import { BsPlusLg } from "react-icons/bs";

const Offers = () => {
  const auth = useAuth();
  const { darkMode } = useContext(DarkModeContext);

  return <div className="buttons-ofertas">
      {
          auth?.currentUser?.validated === 'False' && (
          <div className="w-100 text-bg-danger text-center h6 p-3 mb-3">
            Usted no está validado. Puede crear la ofertas, pero no serán visibles. Un administrador verificará sus datos. Ante cualquier consulta, póngase en contacto con <strong>admin@admin.admin</strong>.
          </div>
          )
        }
     <div className={`buttons-company ${darkMode ? "dark" : ""}`}>
      <NavLink
          className={({ isActive }) =>
            isActive
              ? darkMode
                ? "active-labels-carreras tab dark"
                : "active-labels-carreras tab"
              : darkMode
              ? "labels-carreras dark"
              : "labels-carreras"
          }
          to="internship"
        >
          <p><BsPlusLg/></p>
          <p>Pasantía</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive
              ? darkMode
                ? "active-labels-carreras tab dark"
                : "active-labels-carreras tab"
              : darkMode
              ? "labels-carreras dark"
              : "labels-carreras"
          }
          to="job"
        >
          <p><BsPlusLg /></p>
          <p>Relación de dependencia</p>
        </NavLink>
      </div>
      <Outlet/>
  </div>;
};

export default Offers;
