import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./style/OtrosDatos.css";
import { DarkModeContext } from "context/DarkModeContext";
import React, { useState, useContext, useEffect } from "react";
import { useAuthDispatch, useAuth } from "context/AuthContextProvider";
import { baseUrl } from "utils/constants";
import { toast } from "react-toastify";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { otherDataSchema } from "validationModels/otherDataSchema";
import { customFetch, handleServerError } from "utils/helpers";
import Errors from "components/Errors";

const OtrosDatos = () => {
  const auth = useAuth();
  const dispatch = useAuthDispatch();
  const { darkMode } = useContext(DarkModeContext);
  const [file, setFile] = useState(undefined);
  const [count, setCount] = useState(0);
  const [fileKey, setFileKey] = useState(0);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ mode: "all", resolver: joiResolver(otherDataSchema) });
  const onError = (errors, e) => console.log(errors, e);

  const onSubmit = (data) => {
    sendData(data)
      .then((res) => {
        const error = handleServerError(dispatch, res);
        if (error) {
          return;
        }
        return res.json();
      })
      .then((body) => {
        if (body) {
          toast.success("Se actualizaron los datos");
          getCurrentData();
          return;
        }
        toast.error("Algo falló");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Ocurrió un error");
      });
  };

  const getCurrentData = () => {
    customFetch('GET', '/student/GetCurrentOtherData', auth.token)
    .then((response) => {
      const error = handleServerError(dispatch, response);
      if (error) {
        return;
      }
      if (response.status !== 204) {
        return response.json();
      }

    })
    .then((body) => {
      if (body) {
        delete body.id
        if (body.fileName === null) {
          body.fileName = "Ningún archivo en base de datos"
        }
      } else {
        body = { 
          fileName: "Ningún archivo en base de datos", 
          highSchoolDegree: null, 
          observations:null, 
        };
      }
      reset({
        ...body
      })
    })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      });
  };

  useEffect(() => {
    getCurrentData();
  }, []);

  const sendData = (formValues) => {
    const { highSchoolDegree, observations } = formValues;
    const dataToSend = { highSchoolDegree, observations, curriculum: file };
    var form_data = new FormData();

    for ( var key in dataToSend ) {
      if (dataToSend[key]) {
        form_data.append(key, dataToSend[key]);
      }
    }

    return fetch(baseUrl + "/student/updateOtherData", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + auth.token,
      },
      body: form_data,
    });
  };

  return (
    <div className="container-alumno">
      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        className={`form-alumno-otros-datos ${darkMode ? "dark" : ""}`}
      >
        <Form.Group className="input-alumno">
          <Form.Label>Título Secundario</Form.Label>
          <Form.Control type="text" {...register("highSchoolDegree")} />
          <Errors errorMsg={errors.highSchoolDegree?.message} />
        </Form.Group>
        <Form.Group className="input-alumno">
          <Form.Label>Archivo CV actualmente cargado</Form.Label>
          <Form.Control disabled type="text" {...register("fileName")} />
        </Form.Group>

        <Form.Group className="input-alumno">
          <Form.Label>Observaciones</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            {...register("observations")}
            onChange={(e) => setCount(e.target.value.length)}
          />
          <p>{count}/300</p>
          <Errors errorMsg={errors.observations?.message} />
        </Form.Group>

        <Form.Group className="input-alumno cv-container">
          <div>
          <Form.Label htmlFor="file-upload" ></Form.Label>
          <Form.Control
            id="file-upload"
            key={fileKey}
            type="file"
            accept=".pdf"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <Form.Label className={`custom-file-upload ${darkMode ? "dark" : ""}`}>

            <Form.Control className={`mt-2 label-cv ${darkMode ? "dark" : ""}`} key={fileKey}
            type="file"
            accept=".pdf"
            onChange={(e) => {
              setFile(e.target.files[0])
            }}/>
            Adjuntar CV
          </Form.Label>
          
          <Button
            className={`mt-2 button-elim ${darkMode ? "dark" : ""}`}
            type="button"
            onClick={() => {
              setFile(null);
              setFileKey(fileKey + 1);
            }}
          >
            {" "}
            Eliminar selección
          </Button>
          </div>
          <span className="span-cv">{file?.name}</span>
        </Form.Group>

        <Form.Group className="mb-3 input-alumno">
          <Button
            variant="primary"
            type="submit"
            className={`boton-univ ${darkMode ? "dark" : ""}`}
          >
            Guardar
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default OtrosDatos;
