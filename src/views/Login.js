import React, { useEffect, useContext, useState } from "react";
import { useAuthDispatch, useAuth } from "context/AuthContextProvider";
import { DarkModeContext } from "context/DarkModeContext";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import "assets/style/Login.css";
import logo from "../img/utnlogo.png";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { loginSchema } from "validationModels/loginSchema";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "utils/constants";
// import logo from "./expense.png";

const Login = () => {
  const { darkMode } = useContext(DarkModeContext);
  const dispatch = useAuthDispatch();
  const auth = useAuth();
  const [docTypes, setDocTypes] = useState(null);
  let navigate = useNavigate();

  const goToForm = () => navigate("/signUp", { state: { docTypes: docTypes } });
  const goToPassword = () => navigate("/password", { state: { docTypes: docTypes } });

  const onSubmit = (formValues) => {
    const { email, password } = formValues;
    dispatch.login(email, password);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: "all", resolver: joiResolver(loginSchema) });

  useEffect(() => {
    if (auth.loginError !== "" && !auth.waitingLogin) {
      toast.error(auth.loginError);
      dispatch.clear();
    }
  }, [auth.loginError, auth.waitingLogin]);

  useEffect(() => {
    if (docTypes === null)
      fetch(`${baseUrl}/aux/DocumentTypes`)
        .then((res) => res.json())
        .then((res) => setDocTypes(res));
  }, []);


  return (
    <div>
      <Container id="main-container" className="d-grid h-100">
        <Form
          onSubmit={handleSubmit(onSubmit)}
          id="sing-in-form"
          className="text-center w-100"
        >
        <img className="logo-utn" src={logo}></img>
       
          <Form.Group controlId="sign-in-email-address">
            <label className="label-input">Email</label>
            <Form.Control
              type="text"
              size="lg"
              autoComplete="username"
              className="position-relative input-login"
              {...register("email")}
            />
            <div
              className={`${errors.email ? "show-error" : "hide-error"} error`}
            >
              {errors.email ? `${errors.email?.message}` : "placeholder"}
            </div>
          </Form.Group>
          <Form.Group controlId="sign-in-password" className="mb-3">
            <label className="label-input-contrasenia">Contraseña</label>
            <Form.Control
              type="password"
              size="lg"
              autoComplete="password"
              className="position-relative input-login"
              {...register("password")}
            />
            <div
              className={`${
                errors.password ? "show-error" : "hide-error"
              } error`}
            >
              {errors.password ? `${errors.password?.message}` : "placeholder"}
            </div>
          </Form.Group>
          <div className="d-grid">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className={`${darkMode ? "dark" : ""}`}
              disabled={auth.waitingLogin}
            >
              { auth.waitingLogin ? 'INGRESANDO...' : 'INGRESAR'}
            </Button>
            <Button
              size="lg"
              className={`${darkMode ? "dark" : ""}`}
              onClick={goToForm}
            >
              REGISTRARSE
            </Button>
          </div>
        </Form>
          <a onClick={goToPassword} className="mt-5 rec-contrasenia">Recuperar contraseña</a>
          </Container>
    </div>
  );
};

export default Login;
