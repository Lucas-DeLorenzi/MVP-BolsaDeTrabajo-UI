import React, { useState, useContext } from "react";
import "assets/style/Careers.css";
import Table from 'react-bootstrap/Table';
import Buttons from "./Buttons";
import './style/Student.css';
import { DarkModeContext } from "context/DarkModeContext";

const Student = () => {
    const [show, setShow] = useState(false);
    const { darkMode } = useContext(DarkModeContext);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  return (
    <Table className={`test ${darkMode ? "dark" : ""} `} striped bordered hover>
    <thead>
      <tr className="check">
        <th>Empresa</th>
        <th>Descripcion</th>
        <th>Estado</th>
        <th >Opciones</th>
      </tr>
    </thead>
    <tbody className="align-baseline">
      <tr>
        <td>Sony</td>
        <td>Desarollador</td>
        <td>Activa</td>
        <td className="check"><Buttons/></td>
      </tr>
      <tr>
        <td>Sony</td>
        <td>Desarollador</td>
        <td>Activa</td>
        <td className="check"><Buttons/></td>
      </tr>
      <tr>
        <td>Sony</td>
        <td>Desarollador</td>
        <td>Activa</td>
        <td className="check"><Buttons/></td>
      </tr>
    </tbody>
  </Table>
  )
}

export default Student