import "./SignUpCompany.css";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { signUpCompanySchema } from "validationModels/signUpSchema";
import { toast } from "react-toastify";
import { customFetchWithBody } from "utils/helpers";
import Errors from "components/Errors";

const SignUpCompany = () => {
  const navigate = useNavigate();
  const [passwordState, setPasswordState] = useState(true);
  const [passwordConfirmState, setPasswordConfirmState] = useState(true);
  const [response, setResponse] = useState({ success: false, msg: "" });
  const [loading, setLoading] = useState(false)
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ mode: "all", resolver: joiResolver(signUpCompanySchema) });

  const onSubmit = (formValues) => {
    const { businessName, email, password } = formValues;
    createCompany({ businessName, email, password });
  };

  const createCompany = (company) => {
    setLoading(true);
    customFetchWithBody("POST", "/company", company)
      .then((res) => {
        if (res.status === 400) {
          setResponse({ ...response, msg: "Algo salió mal" });
          return;
        }
        setResponse({
          ...response,
          success: true,
          msg: "Se ha registrado exitosamente, revise su casilla de correo electrónico.",
        });
        reset(undefined);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        setResponse({ ...response, msg: "Ocurrió un error inesperado" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (response.msg !== "") {
      response.success
        ? toast.success(response.msg)
        : toast.error(response.msg);
      setResponse({ ...response, success: false, msg: "" });
    }
  }, [response]);

  const handlePasswordState = () => {
    setPasswordState(!passwordState);
  };

  const handlePasswordConfirmState = () => {
    setPasswordConfirmState(!passwordConfirmState);
  };

  return (
    <div>
      <Container id="main-container-signup" className="d-grid h-100">
        <Form onSubmit={handleSubmit(onSubmit)} className="text-center mb-3 w-100">
          <Form.Group className="mb-3">
            <Form.Label>Razón social</Form.Label>
            <Form.Control type="text" {...register("businessName")} />
           <Errors errorMsg={errors.businessName?.message} />
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
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" {...register("email")} />
           <Errors errorMsg={errors.email?.message} />
          </Form.Group>
          <Button disabled={loading} type="submit">{loading ? 'REGISTRANDO' : 'REGISTRARSE'}</Button>
        </Form>
      </Container>
    </div>
  );
};

export default SignUpCompany;
