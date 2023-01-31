import React, { useState, useEffect, useContext } from "react";
import "assets/style/Careers.css";
import Table from 'react-bootstrap/Table';
/* import '../../student/style/StudentForm.css'; */
import '../style/Usuarios.css';
import { Button } from "react-bootstrap";
import { customFetch, handleServerError } from "utils/helpers";
import { useAuth, useAuthDispatch } from "context/AuthContextProvider";
import { toast } from "react-toastify";
import Loading from "components/Loading";
import Modal from "components/Modal";
import { DarkModeContext } from "context/DarkModeContext";
import ReadStudent from "components/ReadStudent";
import ReadCompany from "components/ReadCompany";

const GestionUsuario = () => {
  const { darkMode } = useContext(DarkModeContext);
  const auth = useAuth();
  const dispatch = useAuthDispatch();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState([]);
  const [show, setShow] = useState(false);
  const [showDeletion, setShowDeletion] = useState(false);

  const getUsers = (usersPath) => {
    let role = "Empresa";
    if (usersPath.includes("student")) {
      role = "Alumno";
    }
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
        if(res?.length) {
          res = res.map(r => {
            return {...r, role}
          })
          if (role === 'Empresa') {
            setCompanies(res);
          } else {
            setStudents(res);
          }

          // setUsers((current) => { return [...current, ...res] })
        }
      })
      .catch((er) => {
        console.log(er)
        toast.error("Ocurrió un error")
      })
      .finally(() => {
        setLoading(false)
      })
  };

  useEffect(() => {
    getUsers("/student")
    getUsers("/company")
  }, []);

  useEffect(() => {
    const newArr = [...students, ...companies]
    setUsers(newArr);

  }, [students, companies])

  const openUserDetails = (u) => {
    setUser(u);
    setShow(true);
  };

  const openUserDeletion = (u) => {
    setUser(u);
    setShowDeletion(true);
  };

  const deleteUser = () => {
    let discriminator = 'student'
    if (user.role === 'Empresa') {
      discriminator = 'company'
    }

    customFetch("DELETE", `/${discriminator}/${user.id}`, auth.token)
    .then((response) => {
      const error = handleServerError(dispatch, response)
      if (error) {
        return
      }
      return response.json()
    })
    .then((body) => {
      setUsers([]);
      getUsers("/student");
      getUsers("/company");
    })
    .catch((er) => {
      console.log(er)
      toast.error("Ocurrió un error")
    })

  };

  return (
     <div className="table-us">
      {
        loading
        ? <Loading/>
        : !users?.length
        ? <h4 className={`text-center error-pasantia ${darkMode ? "dark" : ""}`}>No hay usuarios para mostrar.</h4>
        : (
          <>
            <Table size="sm" bordered  className={`table-users ${darkMode ? "dark" : ""}`}>
              <thead>
                <tr>
                  <th>Rol</th> 
                  <th>Usuario</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="align-baseline">
                {
                  users.map((u) => {
                    return (
                      <tr key={u.id}>
                        <td>{u.role}</td>
                        <td>{u.name}</td>
                        <td>
                          <Button
                            onClick={()=>openUserDetails(u)}
                          >
                            +INFO
                          </Button>
                          <Button>
                            EDITAR
                          </Button>
                          <Button
                            onClick={()=>openUserDeletion(u)}
                          >
                            ELIMINAR
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                }
                
              </tbody>
            </Table>
            <Modal title={"Datos"}
              onClose={() => {
                setShow(false);
              }}
              big
              show={show}
            >
              {
                user.role === "Empresa"
                ? <ReadCompany company={user} />
                : <ReadStudent student={user} />
              }
            </Modal>

            <Modal title={"Eliminar usuario"}
              show={showDeletion}
              onClose={() => {
                setShowDeletion(false);
              }}
              onConfirm={ ()=>{
                deleteUser()
                }
              }
            >
              <p>Está seguro que desea eliminar el usuario?</p>
            </Modal>
        </>
        )
      }
      </div>
  )
}

export default GestionUsuario