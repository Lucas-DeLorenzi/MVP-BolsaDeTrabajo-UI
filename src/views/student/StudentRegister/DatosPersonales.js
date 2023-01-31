import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./style/StudentForm.css";
import { DarkModeContext } from "context/DarkModeContext";
import React, { useState, useContext, useEffect } from "react";
import { customFetch, customFetchWithBody, getAuxData, handleServerError } from "utils/helpers";
import { useAuthDispatch, useAuth } from "context/AuthContextProvider";
import OfertasLaborales from "../StudentMenu/OfertasLaborales";
import { BsFillArrowDownCircleFill } from "react-icons/bs";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { updStdPersonalDataSchema } from "validationModels/updStdPersonalDataSchema";

import { fullDateString } from "utils/helpers";
import { toast } from "react-toastify";

import Loading from "components/Loading";
import Modal from "components/Modal";
import Errors from "components/Errors";

const DatosPersonales = () => {
  const { darkMode } = useContext(DarkModeContext);

  const dispatch = useAuthDispatch();
  const auth = useAuth();

  const [loading, setLoading] = useState(false)
  const loadingOption = [{ id: "loading", name: "Cargando..." }];
  const [documentTypes, setDocumentTypes] = useState(loadingOption);
  const [civilStatusTypes, setCivilStatusTypes] = useState(loadingOption);
  const [genderTypes, setGenderTypes] = useState(loadingOption);
  const [response, setResponse] = useState({ success: false, msg: "" });
  const [show, setShow] = useState(false);
  const [formValuesWait, setFormValuesWait] = useState();
  const [currentUsrUniqueFields, setCurrentUsrUniqueFields] = useState({ email: "", fileNumber: "", documentNumber: "", userName: "", cuilCuit: "" });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({ mode: "all", resolver: joiResolver(updStdPersonalDataSchema(auth.token, currentUsrUniqueFields)) });

  const getAuxiliaryData = () => {
    getAuxData("CivilStatus", setCivilStatusTypes, auth, dispatch);
    getAuxData("GenderTypes", setGenderTypes, auth, dispatch);
    getAuxData('DocumentTypes', setDocumentTypes, auth, dispatch);
  };

  const onSubmit = (formValues) => {
    formValues.birthday = fullDateString(formValues.birthday);
    setFormValuesWait(formValues);
    setShow(true);
  };


  const confirmSubmit = () => {
    setShow(false);
    setLoading(true);
    customFetchWithBody('PUT', '/student/updatePersonalData', formValuesWait, auth.token)
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

  useEffect(() => {
    setLoading(true);
    getAuxiliaryData();
    customFetch('GET', `/student/GetCurrentPersonalData`, auth.token)
      .then((res) => {
        const error = handleServerError(dispatch, res);
        if (error) {
          return;
        }
        return res.json();
      })
      .then((res) => {
        reset({
          ...res,
          birthday: res.birthday.substr(0, 10)
        });
        setCurrentUsrUniqueFields({
          email: res.email,
          fileNumber: res.fileNumber,
          documentNumber: res.documentNumber,
          userName: res.userName,
          cuilCuit: res.cuilCuit
        });
      })
      .catch(() => {
        toast.error("Ocurrió un error")
      })
      .finally(() => setLoading(false))
  }, []);

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
            >
              <Form.Group className="input-group-pers">
                <Form.Label>Usuario</Form.Label>
                <Form.Control type="text" disabled {...register("userName")} />
               <Errors errorMsg={errors.userName?.message} />
              </Form.Group>

              
              <Form.Group className="input-group-pers">
                <Form.Label>Nombres</Form.Label>
                <Form.Control type="text" {...register("firstName")} />
               <Errors errorMsg={errors.firstName?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Apellido</Form.Label>
                <Form.Control type="text" {...register("lastName")} />
               <Errors errorMsg={errors.lastName?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" {...register("email")} />
               <Errors errorMsg={errors.email?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Tipo y Nro Documento</Form.Label>
                <div className="dni-container">
                  <Form.Select className="select-dni" placeholder="asd" {...register("documentTypeId")}>
                    {documentTypes ? (
                      documentTypes.map((status) => {
                        
                        return <option key={status.id} value={status.id}>{status.name}</option>;
                      })
                    ) : (
                      <option>Lista Vacía</option>
                    )}
                  </Form.Select>
                  <div className="dni-input">
                    <Form.Control type="number" {...register("documentNumber")} />
                   <Errors errorMsg={errors.documentNumber?.message} />
                  </div>
                </div>
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Fecha Nacimiento</Form.Label>
                <Form.Control type="date" {...register("birthday")} />
               <Errors errorMsg={errors.birthday?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Estado Civil</Form.Label>
                <Form.Select {...register("civilStatusTypeId")}>
                  {civilStatusTypes ? (
                    civilStatusTypes.map((status) => {
                      return <option key={status.id} value={status.id}>{status.name}</option>;
                    })
                  ) : (
                    <option>Lista Vacía</option>
                  )}
                </Form.Select>
               <Errors errorMsg={errors.civilStatusTypeId?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Legajo</Form.Label>
                <Form.Control type="number" {...register("fileNumber")} />
               <Errors errorMsg={errors.fileNumber?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>CUIL o CUIT</Form.Label>
                <Form.Control type="number" {...register("cuilCuit")} />
               <Errors errorMsg={errors.cuilCuit?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Sexo</Form.Label>
                <Form.Select {...register("genderTypeId")}>
                  {genderTypes.length ? (
                    genderTypes.map((status) => {
                      <option><BsFillArrowDownCircleFill/></option>
                      return <option key={status.id} value={status.id}>{status.name}</option>;
                    })
                  ) : (
                    <option>Lista Vacía</option>
                  )}
                </Form.Select>
               <Errors errorMsg={errors.genderTypeId?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Calle</Form.Label>
                <Form.Control type="text" {...register("address.street")} />
                <Errors errorMsg={errors.address?.street?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Nro Calle</Form.Label>
                <Form.Control type="number" {...register("address.streetNumber")} />
                <Errors errorMsg={errors.address?.streetNumber?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Letra Bis</Form.Label>
                <Form.Control type="text" {...register("address.letterBis")} />
                <Errors errorMsg={errors.address?.letterBis?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Piso</Form.Label>
                <Form.Control type="number" {...register("address.floor")} />
                <Errors errorMsg={errors.address?.floor?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Depto</Form.Label>
                <Form.Control type="text" {...register("address.apartment")} />
                <Errors errorMsg={errors.address?.apartment?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Código Postal</Form.Label>
                <Form.Control type="text" {...register("address.postalCode")} />
                <Errors errorMsg={errors.address?.postalCode?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Localidad</Form.Label>
                <Form.Control type="text" {...register("address.city")} />
                <Errors errorMsg={errors.address?.city?.message} />
              </Form.Group>

              <Form.Group className="input-group-pers">
                <Form.Label>Teléfono particular</Form.Label>
                <Form.Control type="number" {...register("phoneNumber")} />
               <Errors errorMsg={errors.phoneNumber?.message} />
              </Form.Group>
              
              <h1></h1>

                <Button variant="primary" type="submit" className={`boton1 ${darkMode ? "dark" : ""}`}>
                  Guardar
                </Button>

            </Form>
          }
          <Modal
            title={'Atención!'}
            children={'¿Está seguro de que quiere actualizar sus datos personales?'}
            onClose={() => {
              setShow(false);
            }}
            onConfirm={() => {
              confirmSubmit();
            }}
            show={show}
          ></Modal>
        </div>
      }
    </div>
  );
};

export default DatosPersonales;
