import "assets/style/Login.css";
import "./SignUpStudent.css";
import "assets/style/Login.css";

import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DarkModeContext } from "context/DarkModeContext";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";

import SignUpCompany from "./SignUpCompany.js";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { signUpStudentSchema } from "validationModels/signUpSchema";
import { toast } from "react-toastify";
import { baseUrl } from "utils/constants";
import Errors from "components/Errors";

const SignUpStudent = () => {
  const { darkMode } = useContext(DarkModeContext);
  const menuSignUp = ["Alumno", "Empresa"];
  let navigate = useNavigate();
  const { state } = useLocation();
  const [response, setResponse] = useState({ success: false, msg: "" });
  const [tabSignUp, setTabSignUp] = useState("");
  const [passwordState, setPasswordState] = useState(true);
  const [passwordConfirmState, setPasswordConfirmState] = useState(true);
  const [loading, setLoading] = useState(false)

  const handlePasswordState = () => {
    setPasswordState(!passwordState);
  };

  const handlePasswordConfirmState = () => {
    setPasswordConfirmState(!passwordConfirmState);
  };

  const onSubmit = (formValues) => {
    delete formValues.passwordConfirm;
    setLoading(true);
    fetch(`${baseUrl}/student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formValues),
    })
      .then((res) => {
        if (res.status === 201) {
          setResponse({
            ...response,
            success: true,
            msg: "Se ha registrado exitosamente, revise su casilla de correo electrónico.",
          });
        } else {
          setResponse({ ...response, msg: "Algo salió mal" });
        }
      })
      .catch((e) => {
        console.log(e);
        setResponse({ ...response, msg: "Ocurrió un error inesperado" });
      })
      .finally(() => {
        setLoading(false);
      })
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({ mode: "all", resolver: joiResolver(signUpStudentSchema) });

  useEffect(() => {
    if (response.msg !== "") {
      response.success
        ? toast.success(response.msg)
        : toast.error(response.msg);
      setResponse({ ...response, success: false, msg: "" });
      navigate("/login");
    }
  }, [response]);

  return (
    <div className="container-sign mb-5">
      <Container id="main-container-signup" className="d-grid h-100">
        <div className="border-sign">
          <div className="nav-registro">
            {tabSignUp === "" ? (
              <h1 className="title-signup">Elija una opción</h1>
            ) : tabSignUp === "Alumno" ? (
              <h1 className="title-signup">Alumno</h1>
            ) : (
              <h1 className="title-signup">Empresa</h1>
            )}
            <Button
              onClick={() => {
                navigate("/login");
              }}
              className="back-button"
            >
              Volver
            </Button>
          </div>
          <div className="buttons-signup">
            {menuSignUp.map((tab) => (
              <Button
                type="button"
                key={tab}
                className={`${darkMode ? "dark" : ""}`}
                onClick={() => {
                  setTabSignUp(tab);
                  reset({});
                }}
              >
                {tab}
              </Button>
            ))}
          </div>
          {tabSignUp === "Alumno" && (
            <Form
              onSubmit={handleSubmit(onSubmit)}
              className="text-center mb-3 w-100"
            >
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" {...register("firstName")} />
               <Errors errorMsg={errors.firstName?.message} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Apellido</Form.Label>
                <Form.Control type="text" {...register("lastName")} />
               <Errors errorMsg={errors.lastName?.message} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Contraseña</Form.Label>
                <InputGroup.Text className="p-0 border-0">
                  <Form.Control
                    type={passwordState ? "password" : "text"}
                    {...register("password")}
                  />
                  <i
                    className={`p-2 ${
                      !passwordState ? "fas fa-eye-slash" : "fas fa-eye"
                    }`}
                    type="button"
                    onClick={() => handlePasswordState()}
                  ></i>
                </InputGroup.Text>
               <Errors errorMsg={errors.password?.message} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Confirme la contraseña</Form.Label>
                <InputGroup.Text className="p-0 border-0">
                  <Form.Control
                    type={passwordConfirmState ? "password" : "text"}
                    {...register("passwordConfirm")}
                  />
                  <i
                    className={`p-2 ${
                      !passwordConfirmState ? "fas fa-eye-slash" : "fas fa-eye"
                    }`}
                    type="button"
                    onClick={() => handlePasswordConfirmState()}
                  ></i>
                </InputGroup.Text>
               <Errors errorMsg={errors.passwordConfirm?.message} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Legajo</Form.Label>
                <Form.Control type="text" {...register("fileNumber")} />
               <Errors errorMsg={errors.fileNumber?.message} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Tipo de documento</Form.Label>
                <Form.Select {...register("documentTypeId")}>
                  {state.docTypes?.map((type) => (
                    <option key={type.id} value={type.id} className="text-center">
                      {type.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Numero de documento</Form.Label>
                <div className="dni-input">
                  <Form.Control
                    type="text"
                    {...register("documentNumber")}
                    className="inputs-company"
                  />
                 <Errors errorMsg={errors.documentNumber?.message} />
                </div>
              </Form.Group>

              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" {...register("email")} />
               <Errors errorMsg={errors.email?.message} />
              </Form.Group>
              <Button disabled={loading} type="submit">{loading ? 'REGISTRANDO' : 'REGISTRARSE'}</Button>
            </Form>
          )}
          {tabSignUp === "Empresa" && <SignUpCompany />}
        </div>
      </Container>
    </div>
  );
};

export default SignUpStudent;
