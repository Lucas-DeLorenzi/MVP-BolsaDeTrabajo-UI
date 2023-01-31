import React, { useContext } from 'react'
import Form from "react-bootstrap/Form";
import { DarkModeContext } from "context/DarkModeContext";
import { displayDate } from 'utils/helpers';

const ReadStudent = ({ student }) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div>
      <Form
        className={`w-100 form-empresa-company rounded pt-2 ${darkMode ? "dark" : ""}`}
      >
        <Form.Group className="mb-3 inputs-pasantias">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            disabled
            type="text"
            value={student.name}
          />
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias">
          <Form.Label>
            Legajo
          </Form.Label>
          <Form.Control
            value={student.fileNumber || "Sin datos" }
            disabled
            type="text"/>
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias align-self-start">
          <Form.Label>Tipo documento</Form.Label>
          <Form.Control
            disabled
            type="text"
            value={student.documentType?.name || "Sin datos" }
          />
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias">
          <Form.Label>Documento</Form.Label>
          <Form.Control
            value={student.documentNumber || "Sin datos" }
            disabled
            type="text"/>
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias">
          <Form.Label>Fecha de nacimiento</Form.Label>
          <Form.Control
            value={student.birthday === "0001-01-01"? "Sin completar" : displayDate(student.birthday) }
            disabled
            type="text"/>
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={student.email}
            disabled
            type="text"/>
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias align-self-start">
          <Form.Label>Archivo CV</Form.Label>
          <Form.Control
            value={student.otherData?.fileName ? "Con archivo" : "Sin archivo"}
            disabled
            type="text"/>
        </Form.Group>

        <Form.Group className="w-100 mb-3 inputs-pasantias">
          <Form.Label>Descripción</Form.Label>
          <Form.Control 
            as="textarea"
            disabled
            value={student.otherData?.observations || "Sin datos" }
            rows={5}
          />
        </Form.Group>
      </Form>
    </div>
  )
}

export default ReadStudent