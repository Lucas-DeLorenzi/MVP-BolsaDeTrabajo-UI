import React, { useState, useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./style/StudentForm.css";
import { DarkModeContext } from "context/DarkModeContext";
import { toast } from "react-toastify";
import Loading from "components/Loading";
import Modal from "components/Modal";
import Errors from "components/Errors";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { updUniversityData } from "validationModels/updUniversityDataSchema";
import { customFetch, customFetchWithBody, handleServerError } from "utils/helpers";
import { useAuth, useAuthDispatch } from "context/AuthContextProvider";

const DatosUniversitarios = () => {
  const { darkMode } = useContext(DarkModeContext);
  const auth = useAuth();
  const dispatch = useAuthDispatch();

  const [degrees, setDegrees] = useState();
  const [loading, setLoading] = useState(false);
  const [universityDataToUpd, setUniversityDataToUpd] = useState();
  const [show, setShow] = useState(false);
  const [response, setResponse] = useState({ success: false, msg: "" });

  const courseYears = [1, 2, 3, 4, 5];
  const courseShift = ["Mañana", "Tarde", "Noche"];

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({ mode: "all", resolver: joiResolver(updUniversityData) });

  const onSubmit = (formValues) => {
    for (const value in formValues) {
      formValues[value] = formValues[value].toString();
    }
    setUniversityDataToUpd(formValues);
    setShow(true);
  };

  const confirmSubmit = () => {
    setShow(false);
    setLoading(true);
    customFetchWithBody('PUT', '/student/updateUniversityData', universityDataToUpd, auth.token)
      .then((res) => {
        if (res.status === 200) {
          setResponse({
            ...response, success: true,
            msg: "Sus datos se han actualizado correctamente!"
          });
        } else {
          setResponse({
            ...response, success: false,
            msg: "Ocurrió un error"
          })
        }
      })
      .catch(() => setResponse({
        ...response, success: false,
        msg: "Ocurrió un error"
      }))
      .finally(() => setLoading(false))
  }

  const getData = (path, setter) => {
    customFetch('GET', path, auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        if (response.status === 204) {
          return {}
        }
        return response.json();
      })
      .then((body) => {
        if (path === "/student/GetCurrentUniversityData") {
          delete body.id
          reset(body)
        } else {
          setter(body);
        }
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    getData("/degrees", setDegrees);
    setLoading(true);
    getData("/student/GetCurrentUniversityData", "");
  }, [])

  useEffect(() => {
    if (response.msg !== "") {
      response.success
        ? toast.success(response.msg)
        : toast.error(response.msg);
      setResponse({ ...response, success: false, msg: "" });
    }
  }, [response]);


  return (
    <div>
      {<div className="container-alumno">
          {loading ? <Loading /> :
            <Form
              onSubmit={handleSubmit(onSubmit)}
              className={`form-alumno ${darkMode ? "dark" : ""}`}
              noValidate
            >
              <Form.Group className="mb-3 form-datos-personales">
                <Form.Label>Especialidad</Form.Label>
                <Form.Select {...register("degreeId")}>
                  {degrees ? (
                    degrees.map((status) => {
                      return <option key={status.degreeId} value={status.degreeId}>{status.degreeTitle}</option>;
                    })
                  ) : (
                    <option>Lista Vacía</option>
                  )}
                </Form.Select>
                <Errors errorMsg={errors.degreeId?.message} />
              </Form.Group>

              <Form.Group className="mb-3 form-datos-personales">
                <Form.Label>Cantidad de Materias Aprobadas</Form.Label>
                <Form.Control type="number" {...register("approvedSubjects")} />
                <Errors errorMsg={errors.approvedSubjects?.message} />
              </Form.Group>

              <Form.Group className="mb-3 form-datos-personales">
                <Form.Label>Plan Especialidad</Form.Label>
                <Form.Control type="number" {...register("degreePlanYear")} />
                <Errors errorMsg={errors.degreePlanYear?.message} />
              </Form.Group>

              <Form.Group className="mb-3 form-datos-personales">
                <Form.Label>Año que cursa</Form.Label>
                <Form.Select {...register("currentCourseYear")}>
                <option value={''}>Seleccione una opción</option>
                  {courseYears.map((year) => {
                    return <option key={year} value={year.toString()}>{year}</option>
                  })
                  }
                </Form.Select>
                <Errors errorMsg={errors.currentCourseYear?.message} />
              </Form.Group>

              <Form.Group className="mb-3 form-datos-personales">
                <Form.Label>Turno que cursa</Form.Label>
                <Form.Select {...register("courseShift")}>
                  <option value={''}>Seleccione una opción</option>
                  {courseShift.map((shift) => {
                    return <option key={shift} value={shift}>{shift}</option>
                  })
                  }
                </Form.Select>
                <Errors errorMsg={errors.courseShift?.message} />
              </Form.Group>

              <Form.Group className="mb-3 form-datos-personales">
                <Form.Label>Promedio con aplazos</Form.Label>
                <Form.Control type="number" {...register("averageWithHeldBacks")} />
                <Errors errorMsg={errors.averageWithHeldBacks?.message} />
              </Form.Group>

              <Form.Group className="mb-3 form-datos-personales">
                <Form.Label>Promedio sin aplazos</Form.Label>
                <Form.Control type="number" {...register("averageWithoutHeldBacks")} />
                <Errors errorMsg={errors.averageWithoutHeldBacks?.message} />
              </Form.Group>

              <Form.Group className="mb-3 form-datos-personales">
                <Button variant="primary" type="submit" className={`boton-univ ${darkMode ? "dark" : ""}`}>
                  Guardar
                </Button>
              </Form.Group>
            </Form>
          }
          <Modal
            title={'Atención!'}
            children={'¿Está seguro de que quiere actualizar sus datos universitarios?'}
            onClose={() => {
              setShow(false);
            }}
            onConfirm={() => {
              confirmSubmit();
            }}
            show={show}
          ></Modal>
        </div>
      }</div>
  );
};

export default DatosUniversitarios;
