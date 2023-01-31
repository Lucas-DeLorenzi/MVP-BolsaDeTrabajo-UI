import { DarkModeContext } from "context/DarkModeContext";
import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./Pasantia.css";
import Multiselect from "multiselect-react-dropdown";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { createInternshipSchema } from "validationModels/createInternshipSchema";
import { toast } from "react-toastify";
import { customFetchWithBody, getAuxData, handleServerError, customFetch } from "utils/helpers";
import { useAuth, useAuthDispatch } from "context/AuthContextProvider";
import Errors from "components/Errors";

const Pasantia = () => {
  const dispatch = useAuthDispatch();
  const auth = useAuth();
  const { darkMode } = useContext(DarkModeContext);
  const [count, setCount] = useState(0);
  const loadingOption = [{ id: "", name: "Cargando..." }];
  const [degrees, setDegrees] = useState([{ degreeId: "loading", name: "Cargando..." }]);
  const [selectedDegrees, setSelectedDegrees] = useState([]);
  const [selectedKnowledge, setSelectedKnowledge] = useState([]);
  const [knowledgeTypes, setKnowledgeTypes] = useState(loadingOption);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ mode: "all", resolver: joiResolver(createInternshipSchema) });

  const onSubmit = (formValues) => {
    const idSelectedDegrees = selectedDegrees.map((d) => { return d.id })
    const idSelectedKnowledge = selectedKnowledge.map((k) => { return k.id })
    createInternship({ ...formValues, degreesId: idSelectedDegrees, knowledgementTypeId: idSelectedKnowledge });
  };
  const onError = (errors, e) => console.log(errors, e);

  const createInternship = (internship) => {
    customFetchWithBody("POST", "/searches/internship", internship, auth.token)
      .then((res) => {
        const error = handleServerError(dispatch, res);
        if (error) {
          return;
        }
        toast.success("Se ha registrado exitosamente.")
        setCount(0);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Ocurrió un error inesperado");
      });
  };

  // const startDate = "2023-01-02";
  // const dateFrom = "2022-11-20";
  // const dateUntil = "2022-12-20";
  const getDegrees = () => {
    customFetch("GET", "/degrees", auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        return response.json();
      })
      .then((body) => {
        setDegrees(body.map((d) => { return { name: d.degreeTitle, id: d.degreeId } }));
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      })
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(undefined);
      // { 
      // durationInMonths: 4, 
      // vacancies: 10, 
      // startDate, 
      // dateFrom, 
      // dateUntil, 
      // searchTitle: "Título", 
      // searchDescription: "Descripción"
      // });
    }
  }, [isSubmitSuccessful])

  useEffect(() => {
    getAuxData('KnowledgesTypes', setKnowledgeTypes, auth, dispatch);
    getDegrees();
  }, [])

  return (
    <div className="pasantia-container">
      <p className={`observacion-ofertas ${darkMode ? "dark" : ""}`}>
        OBSERVACIÓN: El régimen de pasantías está enmarcado por la Ley 26427. El
        horario no deberá superar las 4hs diarias y las 20hs semanales de
        lunes a viernes. A todos los fines debe firmarse un convenio marco y
        luego un acuerdo individual por cada pasante.
      </p>

      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        className={`form-empresa-company ${darkMode ? "dark" : ""}`}
      >
        {/* <Form.Group className="mb-3 inputs-pasantias">
          <Form.Label>
          ¿La empresa tiene un convenio marco firmado con la UTN Rosario?
          Observacion: si la empresa no tiene un convenio marco vigente, la
          publicacion de la busqueda se realizará una vez se haya logrado la
            firma de dicho convenio
          </Form.Label>
          <Form.Check 
          className="checkbox-pasantia" 
            name="group1" 
            value={true}
            type="radio" 
            label="Si" />
          <Form.Check 
          className="checkbox-pasantia" 
          name="group1" 
          value={false} 
          type="radio" 
          label="No" />
        </Form.Group> */}

        <Form.Group className="inputs-pasantias">
          <Form.Label>Nombre del puesto</Form.Label>
          <Form.Control type="text" {...register("searchTitle")} />
          <Errors errorMsg={errors.searchTitle?.message} />
        </Form.Group>

        <Form.Group className="inputs-pasantias">
          <Form.Label>
            Cantidad de vacantes
          </Form.Label>
          <Form.Control type="number" {...register("vacancies")} />
          <Errors errorMsg={errors.vacancies?.message} />
        </Form.Group>

        <Form.Group className="inputs-pasantias">
          <Form.Label>Fecha inicio postulación</Form.Label>
          <Form.Control type="date" {...register("dateFrom")} />
          <Errors errorMsg={errors.dateFrom?.message} />
        </Form.Group>

        <Form.Group className="inputs-pasantias">
          <Form.Label>Fecha fin postulación</Form.Label>
          <Form.Control type="date" {...register("dateUntil")} />
          <Errors errorMsg={errors.startDate?.message} />
        </Form.Group>

        <Form.Group className="inputs-pasantias">
          <Form.Label>Fecha tentativa de inicio de la pasantía</Form.Label>
          <Form.Control type="date" {...register("startDate")} />
          <Errors errorMsg={errors.startDate?.message} />
        </Form.Group>

        <Form.Group className="inputs-pasantias">
          <Form.Label>
            Duración de la pasantía en meses
          </Form.Label>
          <Form.Control type="number" {...register("durationInMonths")} />
          <Errors errorMsg={errors.durationInMonths?.message} />
        </Form.Group>

        <Form.Group className={`inputs-pasantias ${darkMode ? "dark" : ""}`}>
          <Form.Label>Carreras en UTN Rosario</Form.Label>
          <Multiselect
            className={`multiselect ${darkMode ? "dark" : ""}`}
            options={degrees}
            displayValue="name"
            showArrow
            onSelect={setSelectedDegrees} />
          <Errors errorMsg={errors.degreeId?.message} />
        </Form.Group>
        <div className="align-self-start d-flex flex-column">
          <Form.Group className="mb-3">
            <Form.Label>Seleccione un conocimiento</Form.Label>
            <Multiselect
              className="multiselect"
              options={knowledgeTypes}
              displayValue="name"
              showArrow
              onSelect={setSelectedKnowledge} />
          </Form.Group>
        </div>

        <Form.Group className="inputs-pasantias">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            {...register("searchDescription")}
            onChange={e => setCount(e.target.value.length)}
          />
          <span>{count}/1000</span>
          <Errors errorMsg={errors.searchDescription?.message} />
        </Form.Group>
        <Button type="submit" className={`labels-company ${darkMode ? "dark" : ""}`}>
          PUBLICAR
        </Button>

      </Form>
    </div>
  );
};

export default Pasantia;
