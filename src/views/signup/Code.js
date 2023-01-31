import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { newPasswordSchema } from "validationModels/loginSchema";
/* import "assets/style/Login.css";
import "./SignUpCompany.css"; */
import "./Code.css";
import InputGroup from "react-bootstrap/InputGroup";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { toast } from "react-toastify";
import { customFetchWithBody } from "utils/helpers";
import Errors from "components/Errors";

const Code = () => {
  const navigate = useNavigate();
  const [passwordState, setPasswordState] = useState(true);
  const [passwordConfirmState, setPasswordConfirmState] = useState(true);
  const [response, setResponse] = useState({ success: false, msg: "" });
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({ mode: "all", resolver: joiResolver(newPasswordSchema) });

  const onSubmit = (formValues) => {
    const { email, password, code } = formValues;
    newPassword({ email, password, code });
  };

  const newPassword = (newPass) => {
    setLoading(true);
    customFetchWithBody("PUT", "/login/newpassword", newPass)
      .then((res) => {
        if (res.status === 400) {
          setResponse({ ...response, msg: "Algo salió mal" });
          return;
        } else {
          setResponse({
            ...response,
            success: true,
            msg: "Se ha cambiado la contraseña exitosamente.",
          });
        }
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
      if (response.success) {
        toast.success(response.msg)
        reset(undefined);
        navigate("/login");
      } else {
        toast.error(response.msg);
      }
    }
  }, [response]);

  const handlePasswordState = () => {
    setPasswordState(!passwordState);
  };

  const handlePasswordConfirmState = () => {
    setPasswordConfirmState(!passwordConfirmState);
  };

  /*     const goToNewPassword = () => navigate("/newPassword"/* , { state: { docTypes: docTypes } } */
  return (
    <div>
      <Container id="main-container" className="d-grid h-100 code-container">
        <Button
          onClick={() => {
            navigate("/password");
          }}
          className="password-but"
        >
          Volver
        </Button>
        <Form onSubmit={handleSubmit(onSubmit)}  /* id="sing-in-form"  */ className="text-center w-100 ">
          <Form.Group className="code-blocks">
            <Form.Label>Ingrese su email nuevamente</Form.Label>
            <Form.Control type="email" {...register("email")} />
            <Errors errorMsg={errors.email?.message} />
          </Form.Group>

          <Form.Group controlId="sign-in-email-address" className="code-blocks">
            <label >Ingrese el código</label>
            <Form.Control {...register("code")} type="text" />
            <Errors errorMsg={errors.code?.message} />
          </Form.Group>

          <Form.Group className="code-blocks">
            <Form.Label>Ingrese su nueva Contraseña</Form.Label>
            <InputGroup.Text className="p-0 border-0">
              <Form.Control
                type={passwordState ? "password" : "text"}
                {...register("password")}
              />
              <i
                className={`p-2 ${!passwordState ? "fas fa-eye-slash" : "fas fa-eye"
                  }`}
                type="button"
                onClick={() => handlePasswordState()}
              ></i>
            </InputGroup.Text>
            <Errors errorMsg={errors.password?.message} />
          </Form.Group>

          <Form.Group className="code-blocks">
            <Form.Label>Confirme la contraseña</Form.Label>
            <InputGroup.Text className="p-0 border-0">
              <Form.Control
                type={passwordConfirmState ? "password" : "text"}
                {...register("passwordConfirm")}
              />
              <i
                className={`p-2 ${!passwordConfirmState ? "fas fa-eye-slash" : "fas fa-eye"
                  }`}
                type="button"
                onClick={() => handlePasswordConfirmState()}
              ></i>
            </InputGroup.Text>
            <Errors errorMsg={errors.passwordConfirm?.message} />
          </Form.Group>

          <Form.Group className="code-blocks">
            <Button disabled={loading} type="submit" id="button-code" >
              {loading ? "REGISTRANDO" : "REGISTRARSE"}
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
};

export default Code;
