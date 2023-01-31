import { DarkModeContext } from "context/DarkModeContext";
import React, { useState, useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Multiselect from "multiselect-react-dropdown";
import "./RelacionDependencia.css";
import {
  customFetch,
  customFetchWithBody,
  handleServerError,
  getAuxData
} from "utils/helpers";
import { useAuthDispatch, useAuth } from "context/AuthContextProvider";
import { toast } from "react-toastify";


import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { createJobSchema } from "validationModels/createJobSchema";
import Errors from "components/Errors";


const RelacionDependencia = () => {
  const { darkMode } = useContext(DarkModeContext);

  const dispatch = useAuthDispatch();
  const auth = useAuth();

  const loadingOption = [{ id: "loading", name: "Cargando..." }];
  const [workDayTypes, setWorkDayTypes] = useState(loadingOption);
  const [degrees, setDegrees] = useState([{ degreeId: "loading", name: "Cargando..." }]);
  const [count, setCount] = useState(0);
  const [selectedDegrees, setSelectedDegrees] = useState([]);
  const [selectedKnowledge, setSelectedKnowledge] = useState([]);
  const [knowledgeTypes, setKnowledgeTypes] = useState(loadingOption);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ mode: "all", resolver: joiResolver(createJobSchema) });

  const onSubmit = (formValues) => {
    const idSelectedDegrees = selectedDegrees.map((d) => { return d.id })
    const idSelectedKnowledge = selectedKnowledge.map((k) => { return k.id })
    createJob({ ...formValues, degreesId: idSelectedDegrees, knowledgementTypeId: idSelectedKnowledge });
  };
  const onError = (errors, e) => console.log(errors, e);

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
    getAuxData('KnowledgesTypes', setKnowledgeTypes, auth, dispatch);
    getAuxData("WorkdayTypes", setWorkDayTypes, auth, dispatch);
    getDegrees();
  }, [])

  const createJob = (job) => {
    customFetchWithBody("POST", "/searches/job", job, auth.token)
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

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(undefined);
    }
  }, [isSubmitSuccessful])




  return (
    <div className="relacion-dep">
      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        className={`form-empresa-relacion ${darkMode ? "dark" : ""}`}
      >
        <Form.Group className="input-rel-dep">
          <Form.Label>Nombre del puesto</Form.Label>
          <Form.Control type="text" {...register("searchTitle")} />
          <Errors errorMsg={errors.searchTitle?.message} />
        </Form.Group>

        <Form.Group className="input-rel-dep">
          <Form.Label>
            Cantidad de vacantes
          </Form.Label>
          <Form.Control type="number" {...register("vacancies")} />
          <Errors errorMsg={errors.vacancies?.message} />
        </Form.Group>

        <Form.Group className="input-rel-dep">
          <Form.Label>Fecha inicio postulación</Form.Label>
          <Form.Control type="date" {...register("dateFrom")} />
          <Errors errorMsg={errors.dateFrom?.message} />
        </Form.Group>

        <Form.Group className="input-rel-dep">
          <Form.Label>Fecha fin postulación</Form.Label>
          <Form.Control type="date" {...register("dateUntil")} />
          <Errors errorMsg={errors.dateUntil?.message} />
        </Form.Group>


        <Form.Group className="input-rel-dep">
          <Form.Label>Jornada laboral</Form.Label>
          <Form.Select {...register("workdayTypeId")}>
            <option value={''}>Seleccione una opción</option>
            {workDayTypes?.length ? (
              workDayTypes.map((wdt) => {
                return <option key={wdt.id} value={wdt.id}>{wdt.name}</option>
              })
            ) : (
              <option key={1}>Lista vacía</option>
            )}
          </Form.Select>
          <Errors errorMsg={errors.workdayTypeId?.message} />
        </Form.Group>

        <Form.Group className="input-rel-dep">
          <Form.Label>Carreras en UTN Rosario</Form.Label>
          <Multiselect
            className="multiselect"
            options={degrees}
            displayValue="name"
            showArrow
            onSelect={setSelectedDegrees} />
          <Errors errorMsg={errors.degreeId?.message} />
        </Form.Group>

        <div className="align-self-start d-flex flex-column">
          <Form.Group className="mb-3 input-rel-dep">
            <Form.Label>Seleccione un conocimiento</Form.Label>
            <Multiselect
              className="multiselect"
              options={knowledgeTypes}
              displayValue="name"
              showArrow
              onSelect={setSelectedKnowledge} />
              
          </Form.Group>
          <button className={`labels-company-reldep ${darkMode ? "dark" : ""}`}>PUBLICAR</button>
        </div>

        <Form.Group className="input-rel-dep">
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
        
      </Form>
    </div>
  );
};

export default RelacionDependencia;
