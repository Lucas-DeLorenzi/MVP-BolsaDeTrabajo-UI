import React, { useContext } from "react";
import { DarkModeContext } from "context/DarkModeContext";
import "assets/style/DarkModeSwitchBtn.css";
import utnblanco from "../../img/utn-gris-claro.jpg";
import logoutn from '../../img/utn-gris-oscuro.jpg';

const DarkModeSwitchBtn = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  return (
    <div className="switch-button">
      <div className="img-cont">
      <img className="imagenes-logo-utn"
        src={darkMode ? logoutn : utnblanco}
       /*  alt="Darkmode off" */
      />
      </div>
      <div className="switch-button__container">
        <div>Modo Oscuro</div>
        <div className="switch-button__container__inside">
          <input
            type="checkbox"
            name="switch-button"
            id="switch-label"
            className="switch-button__checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          <label
            htmlFor="switch-label"
            className="switch-button__label"
          ></label>
        </div>
      </div>
    </div>
  );
};

export default DarkModeSwitchBtn;
