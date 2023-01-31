import React, { useContext } from 'react'
import Form from "react-bootstrap/Form";
import { DarkModeContext } from "context/DarkModeContext";

const ReadInternship = ({internship}) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div><Form
    className={`w-100 form-empresa-company ${darkMode ? "dark" : ""}`}
  >
    <Form.Group className="mb-3 inputs-pasantias">
      <Form.Label>Nombre del puesto</Form.Label>
      <Form.Control
        disabled
        type="text"
        value={internship.searchTitle}
      />
    </Form.Group>

    <Form.Group className="mb-3 inputs-pasantias">
      <Form.Label>
        Cantidad de vacantes
      </Form.Label>
      <Form.Control
        value={internship.vacancies}
        disabled
        type="number"/>
    </Form.Group>

    <Form.Group className="mb-3 inputs-pasantias">
      <Form.Label>Fecha inicio postulación</Form.Label>
      <Form.Control
        value={internship.dateFrom.slice(0,10)}
        disabled
        type="date"/>
    </Form.Group>

    <Form.Group className="mb-3 inputs-pasantias">
      <Form.Label>Fecha fin Postulación</Form.Label>
      <Form.Control
        value={internship.dateUntil.slice(0,10)}
        disabled
        type="date"/>
    </Form.Group>

    <Form.Group className="mb-3 inputs-pasantias">
      <Form.Label>Fecha tentativa de inicio de la pasantía</Form.Label>
      <Form.Control
        value={internship.startDate.slice(0,10)}
        disabled
        type="date"/>
    </Form.Group>

    <Form.Group className="mb-3 inputs-pasantias">
      <Form.Label>
        Duración de la pasantía en meses
      </Form.Label>
      <Form.Control
        value={internship.durationInMonths}
        disabled
        type="number"/>
    </Form.Group>

    <Form.Group className="mb-3 inputs-pasantias align-self-start">
      <Form.Label>
        Postulados
      </Form.Label>
      <Form.Control
        value={internship.postulations.length}
        disabled
        type="number"/>
    </Form.Group>

    <Form.Group className="w-100 mb-3 inputs-pasantias">
      <Form.Label>Descripción</Form.Label>
      <Form.Control 
        as="textarea"
        disabled
        value={internship.searchDescription}
        rows={10}
      />
    </Form.Group>
  </Form></div>
  )
}

export default ReadInternship