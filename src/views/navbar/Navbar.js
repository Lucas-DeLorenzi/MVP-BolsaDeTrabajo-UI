import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  useAuth,
  useAuthDispatch,
  useCapitalizeName,
} from "context/AuthContextProvider";
import { DarkModeContext } from "context/DarkModeContext";
import DarkModeSwitchBtn from "views/navbar/DarkModeSwitchBtn";
import "assets/style/Navbar.css";
import Navbar from "react-bootstrap/Navbar";

const NavbarCustom = () => {
  const auth = useAuth();
  const dispatch = useAuthDispatch();
  const { darkMode } = useContext(DarkModeContext);

  return (
    <Navbar className={`navbar-route ${darkMode ? "dark" : ""}`}>
      <DarkModeSwitchBtn />
      <div className="div-name-logout">
        {/*  <img className="logoutn" src={logoutn}></img> */}
        <span>
          Hola,{" "}
          <span className="user-name">
            {useCapitalizeName(auth.currentUser?.name)}{" "}
          </span>
          <Link to="/">
            <button
              className="logout-btn"
              onClick={() => {
                dispatch.logout();
              }}
            >
              CERRAR SESION
            </button>
          </Link>
        </span>
      </div>
    </Navbar>
  );
};

export default NavbarCustom;
