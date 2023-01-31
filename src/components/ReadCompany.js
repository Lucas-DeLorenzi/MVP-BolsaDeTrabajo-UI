import React, { useContext } from 'react'
import Form from "react-bootstrap/Form";
import { DarkModeContext } from "context/DarkModeContext";
import { displayDate } from 'utils/helpers';

const ReadCompany = ({ company }) => {
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
            value={company.name}
          />
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias">
          <Form.Label>
            CUIT
          </Form.Label>
          <Form.Control
            value={company.cuilCuit || "Sin datos" }
            disabled
            type="text"/>
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias">
          <Form.Label>Localidad</Form.Label>
          <Form.Control
            value={company.address?.city || "Sin datos" }
            disabled
            type="text"/>
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias align-self-start">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            disabled
            type="text"
            value={company.address?.street? `${company.address.street} ${company.address.streetNumber }` : "Sin datos" }
          />
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={company.email || "Sin datos"}
            disabled
            type="text"/>
        </Form.Group>

        <Form.Group className="mb-3 inputs-pasantias align-self-start">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            value={company.phoneNumber || "Sin datos" }
            disabled
            type="text"/>
        </Form.Group>

      </Form>
    </div>
  )
}

export default ReadCompany