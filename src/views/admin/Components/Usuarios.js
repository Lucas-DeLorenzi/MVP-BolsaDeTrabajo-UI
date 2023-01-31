import React, { useState, useEffect, useContext } from "react";
import "assets/style/Careers.css";
import Table from "react-bootstrap/Table";
/* import "../../student/style/StudentForm.css"; */
import "../style/Usuarios.css";
import { Button } from "react-bootstrap";
import { customFetch, handleServerError } from "utils/helpers";
import { useAuth, useAuthDispatch } from "context/AuthContextProvider";
import { toast } from "react-toastify";
import Loading from "components/Loading";
import Modal from "components/Modal";
import { DarkModeContext } from "context/DarkModeContext";
import ValidacionUsuarios from "./ValidacionUsuarios";
import GestionUsuario from "./GestionUsuario";
import { FiUserCheck } from "react-icons/fi";
import { FaUserEdit } from "react-icons/fa";


const Usuarios = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [clickedUser, setClickedUser] = useState("");
  const [usersToValidate, setUsersToValidate] = useState([]);
  const auth = useAuth();
  const dispatch = useAuthDispatch();
  const usuariosButton = ["Validar usuario", "Gestionar usuario"];
  const [tabUsuario, setTabUsuario] = useState("");

  const openModal = (user) => {
    setShow(true);
    setClickedUser(user);
  };
  const confirmValidation = (e) => {
    setLoading(true);
    setShow(false);
    customFetch(
      "PUT",
      `/${clickedUser.path}/toValidate/${clickedUser.id}?userName=admin`,
      auth.token
    )
      .then((response) => {
        console.log("respuesta put", response);
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        toast.success("Usuario Validado!");
        setUsersToValidate((users) =>
          users.filter((user) => user.id !== clickedUser.id)
        );
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getUsersToValidate = (usersPath) => {
    setLoading(true);
    customFetch("GET", usersPath, auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        return response.json();
      })
      .then((res) => {
        if (res?.length) {
          setUsersToValidate((current) => {
            return [...current, ...res];
          });
        }
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getUsersToValidate("/student/toValidate")
    getUsersToValidate("/company/toValidate");
  }, []);

  return (
    <div className="buttons-intern">
    <div className={`buttons-carreras ${darkMode ? "dark" : ""}`}>
        <button
        type="button"
        key={"Gestionar usuario"}
        className={`labels-carreras ${darkMode ? "dark" : ""}`}
        onClick={() => setTabUsuario("Gestionar usuario")}
        >
            <p><FaUserEdit/></p>
           <p>Gestionar usuario</p>
        </button>
        <button
        type="button"
        key={"Validar usuario"}
        className={`labels-carreras ${darkMode ? "dark" : ""}`}
        onClick={() => setTabUsuario("Validar usuario")}
        >
          <p><FiUserCheck/></p>
          <p>Validar usuario</p>
        </button>
    </div>
    {tabUsuario === "Validar usuario" && <ValidacionUsuarios/>}
    {tabUsuario === "Gestionar usuario" && <GestionUsuario/>}

    </div>
  );
};

export default Usuarios;
