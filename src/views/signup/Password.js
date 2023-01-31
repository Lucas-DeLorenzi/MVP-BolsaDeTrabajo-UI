import React, { useState } from "react";
import { useAuthDispatch, useAuth } from "context/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { passwordSchema } from "validationModels/loginSchema";
import "assets/style/Login.css";
import { customFetch, handleServerError } from "utils/helpers";
import { toast } from "react-toastify";


const Password = () => {
  let navigate = useNavigate();
  const dispatch = useAuthDispatch();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: "all", resolver: joiResolver(passwordSchema) });


  const onSubmit = (formValues) => {

    const { email } = formValues;
    setLoading(true);
    customFetch("GET", `/login/forgotpassword?email=${encodeURI(email)}`).then((response) => {
      const error = handleServerError(dispatch, response);
      if (error) {
        return;
      }
      return response.json();
    })
      .then((body) => {
        console.log(body);
        if (body?.isCompleted) {
          toast.success("Revise su casilla de correo.");
          goToCode();
        }
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      }).finally(() => setLoading(false));
  };

  const goToCode = () =>
    navigate("/code" /* { state: { docTypes: docTypes } } */);
  return (
    <div>
      <Container id="main-container" className="d-grid h-100 password">
        <Button
          onClick={() => {
            navigate("/login");
          }}
          className="password-but"
        >
          Volver
        </Button>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          /*   id="sing-in-form" */
          className="text-center w-100 test-asd"
        >
          <Form.Group controlId="sign-in-email-address" className="item-pw">
            <Form.Label>
              Ingrese el mail asociado a su cuenta, recibirá un código de
              recuperación
            </Form.Label>
            <Form.Control
              type="text"
              size="lg"
              autoComplete="username"
              /* className="position-relative" */
              {...register("email")}
            />
            <div
              className={`${errors.email ? "show-error" : "hide-error"} error`}
            >
              {errors.email ? `${errors.email?.message}` : "placeholder"}
            </div>
          </Form.Group>

          <Form.Group className="item-pw">
            <Button disabled={loading} size="lg" type="submit" id="button-code" >
              {loading ? "ENVIANDO..." : "ENVIAR"}
            </Button>
          </Form.Group>
        </Form>
        {/*  </div> */}
      </Container>
    </div>
  );
};

export default Password;
