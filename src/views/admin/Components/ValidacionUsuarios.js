import React, { useState, useEffect, useContext } from "react";
import "assets/style/Careers.css";
import Table from 'react-bootstrap/Table';
import '../../student/StudentRegister/style/StudentForm.css';
import '../style/Usuarios.css';
import { Button } from "react-bootstrap";
import { customFetch, handleServerError } from "utils/helpers";
import { useAuth, useAuthDispatch } from "context/AuthContextProvider";
import { toast } from "react-toastify";
import Loading from "components/Loading";
import Modal from "components/Modal";
import { DarkModeContext } from "context/DarkModeContext";


const Usuarios = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [clickedUser, setClickedUser] = useState("");
  const [usersToValidate, setUsersToValidate] = useState([]);
  const auth = useAuth();
  const dispatch = useAuthDispatch();

  const openModal = (user) => {
    setShow(true);
    setClickedUser(user);
  }
  const confirmValidation = (e) => {
    setLoading(true);
    setShow(false);
    customFetch('PUT', `/${clickedUser.path}/toValidate/${clickedUser.id}?userName=admin`, auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        toast.success("Usuario Validado!")
        setUsersToValidate((users) => users.filter((user) => user.id !== clickedUser.id))
      })
      .catch((er) => {
        console.log(er)
        toast.error("Ocurrió un error")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const getUsersToValidate = (usersPath) => {
    setLoading(true)
    customFetch('GET', usersPath, auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response)
        if (error) {
          return
        }
        return response.json()
      })
      .then((res) => {
        setUsersToValidate((current) => { return [...current, ...res] })
      })
      .catch((er) => {
        console.log(er)
        toast.error("Ocurrió un error")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getUsersToValidate("/student/toValidate")
    getUsersToValidate("/company/toValidate")
  }, [])

  return (
    <div className="table-us">
      {
        loading
        ? <Loading/>
        : !usersToValidate?.length
        ? <h4 className={`text-center error-pasantia ${darkMode ? "dark" : ""}`}>No hay usuarios pendientes de validación</h4>
        : (
          <Table size="sm" bordered  className={`table-users ${darkMode ? "dark" : ""}`}>
            <thead>
              <tr>
                <th>Rol</th> 
                <th>Usuario</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="align-baseline">
              {usersToValidate.map((user) => {
                return (
                  <tr key={user.id}>
                    <td>{user.role}</td>
                    <td>{user.name}</td>
                    <td><Button onClick={() => { openModal(user) }}>VALIDAR</Button></td>
                  </tr>
                )
              })
              }

            </tbody>
          </Table>

        )
      }
      <Modal title={"Atención!"}
        onClose={() => {
          setShow(false);
        }}
        onConfirm={() => confirmValidation()}
        show={show}>
        <p>¿Está seguro que quiere validar al usuario?</p>
      </Modal>
    </div>
  );
};

export default Usuarios;
