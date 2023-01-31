import React, { useContext } from 'react'
import Form from "react-bootstrap/Form";
import { DarkModeContext } from "context/DarkModeContext";

const ReadJob = ({job}) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div>
      <Form
        className={`w-100 form-empresa-company ${darkMode ? "dark" : ""}`}
      >
        <Form.Group className="mb-3 inputs-pasantias">
          <Form.Label>Nombre del puesto</Form.Label>
          <Form.Control
            disabled
            type="text"
            value={job.searchTitle}
          />
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias">
          <Form.Label>
            Cantidad de vacantes
          </Form.Label>
          <Form.Control
            value={job.vacancies}
            disabled
            type="number"/>
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias align-self-start">
          <Form.Label>Jornada laboral</Form.Label>
          <Form.Control
            disabled
            type="text"
            value={job.workdayType.name}
          />
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias">
          <Form.Label>Fecha inicio postulación</Form.Label>
          <Form.Control
            value={job.dateFrom.slice(0,10)}
            disabled
            type="date"/>
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias">
          <Form.Label>Fecha fin Postulación</Form.Label>
          <Form.Control
            value={job.dateUntil.slice(0,10)}
            disabled
            type="date"/>
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias">
          <Form.Label>Postulados</Form.Label>
          <Form.Control
            value={job.postulations.length}
            disabled
            type="text"/>
        </Form.Group>

        <Form.Group className="w-100 mb-3 inputs-pasantias">
          <Form.Label>Descripción</Form.Label>
          <Form.Control 
            as="textarea"
            disabled
            value={job.searchDescription}
            rows={10}
          />
        </Form.Group>
      </Form>
    </div>
  )
}

export default ReadJob