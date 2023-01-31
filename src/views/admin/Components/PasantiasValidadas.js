import React, { useState, useEffect, useContext } from "react";
import "assets/style/Careers.css";
import Table from "react-bootstrap/Table";
import "../../student/StudentRegister/style/StudentForm.css";
import "../style/Usuarios.css";
import { Button } from "react-bootstrap";
import { customFetch, handleServerError } from "utils/helpers";
import { useAuth, useAuthDispatch } from "context/AuthContextProvider";
import { toast } from "react-toastify";
import Loading from "components/Loading";
import Modal from "components/Modal";
import { DarkModeContext } from "context/DarkModeContext";
import Form from "react-bootstrap/Form";
import ReadInternship from "components/ReadInternship";

const PasantiasValidadas = () => {
  // helpers
  const { darkMode } = useContext(DarkModeContext);
  const auth = useAuth();
  const dispatch = useAuthDispatch();
  // modals
  const [show, setShow] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  // async
  const [loading, setLoading] = useState(false);
  // internships manipulation
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [internship, setInternship] = useState([]);
  // filters
  const [companyFilter, setCompanyFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [validationState, setValidationState] = useState(0);

  const openModal = (i) => {
    setInternship(i)
    setShow(true);
  };

  const openModalInfo = (i) => {
    setInternship(i)
    setShowInfo(true);
  };

  const openModalDelete = (i) => {
    setInternship(i)
    setShowDelete(true);
  }

  useEffect(() => {
    if (companyFilter !== '') {
      setFilteredInternships(internships.filter(i => i.company.name.includes(companyFilter)))
    } else {
      setFilteredInternships(internships)
    }
  }, [companyFilter]);

  useEffect(() => {
    if (titleFilter !== '') {
      setFilteredInternships(internships.filter(i => i.searchTitle.includes(titleFilter)))
    } else {
      setFilteredInternships(internships)
    }
  }, [titleFilter]);

  useEffect(() => {
    getInternships(validationState)
    setCompanyFilter('');
    setTitleFilter('');
  }, [validationState]);
  
  const handleCompanyChange = (e) => {
    setCompanyFilter(e.target.value);
  };
  const handleTitleChange = (e) => {
    setTitleFilter(e.target.value);
  };
  const handleValidationChange = (e) => {
    setValidationState(e.target.value);
  };

  const getInternships = (state) => {
    setLoading(true);
    customFetch("GET", `/searches/internships?validationStatus=${state}`, auth.token)
    .then((response) => {
      const error = handleServerError(dispatch, response);
      if (error) {
        return;
      }
      return response.json();
    })
    .then((body) => {
      if (body?.length) {
        setInternships(body);
        setFilteredInternships(body)
        return;
      }
      setInternships([]);
      setFilteredInternships([])
    })
    .catch((er) => {
      console.log(er);
      toast.error("Ocurrió un error");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const validateInternship = () => {
    customFetch("PUT", `/searches/internshipsToValidate/${internship.id}`, auth.token)
    .then((res) => {
      const error = handleServerError(dispatch, res);
      if (error) {
        return;
      }
      return res.json();
    })
    .then((body) => {
      if (body) {
        toast.success("Se validó la pasantía");
        return
      }
      toast.error("Algo falló en la validación, inténtelo nuevamente")
    })
    .catch((er) => {
      console.log(er);
      toast.error("Ocurrió un error");
    })
    .finally(() => {
      getInternships(validationState)
    });
  }

  const deleteInternship = () => {
    customFetch("DELETE", `/searches/${internship.id}`, auth.token)
    .then((res) => {
      const error = handleServerError(dispatch, res);
      if (error) {
        toast.error("Algo falló, inténtelo nuevamente")
        return;
      }
      toast.success("Se eliminó la pasantía");
    })
    .catch((er) => {
      console.log(er);
      toast.error("Ocurrió un error");
    })
    .finally(() => {
      getInternships(validationState)
    });
  }
  

  return (
    <>
      <div className={`mt-3 d-flex flex-column flex-sm-row mx-3 justify-content-center gap-3 flex-wrap inputs-pasantias ${darkMode ? "dark" : ""}`}>
        <div className="d-flex flex-column">
          <div className="mb-2 text-center">
            Empresa
          </div>
          <input
            className="p-1 rounded text-center mb-3"
            onChange={(e) => {
              handleCompanyChange(e);
            }}
            value={companyFilter}
          />
        </div>

        <div className="d-flex flex-column">
          <div className={`mb-2 text-center inputs-pasantias ${darkMode ? "dark" : ""}`}>
            Título
          </div>
          <input
            className="p-1 rounded text-center mb-3"
            onChange={(e) => {
              handleTitleChange(e);
            }}
            value={titleFilter}
          />
        </div>

        <div className="d-flex flex-column">
          <div className={`mb-2 text-center inputs-pasantias ${darkMode ? "dark" : ""}`}>
            Estado de validación
          </div>
          <select
            className="p-2 rounded text-center mb-3 select-tablas"
            onChange={(e) => {
              handleValidationChange(e);
            }}
            value={validationState}
            >
            <option value={0}>Todas</option>
            <option value={1}>Validadas</option>
            <option value={2}>A validar</option>
          </select>
        </div>
      </div>
      { loading
      ? <Loading/>
      : !filteredInternships?.length
      ? <h4 className={`mt-5 text-center error-pasantia ${darkMode ? "dark" : ""}`}> No hay pasantías para mostrar.</h4>
      : (<>
          
          <div className="table-us">
            <Table
              size="sm"
              bordered
              className={`table-users ${darkMode ? "dark" : ""}`}
            >
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Título pasantía</th>
                  <th>Estado Pasantía</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="align-baseline">
                {
                  filteredInternships.map((i) => {
                    return (
                      <tr key={i.id}>
                        <td>{i.company.name}</td>
                        <td>{i.searchTitle}</td>
                        <td>{i.discriminatorValue === "Pasantía a Verificar"? "Requiere verificación" : "Verificada"}</td>
                        <td>
                          <Button 
                            onClick={ () => {
                              openModalInfo(i)
                            }}
                          >
                            +INFO
                          </Button>
                          <Button
                            disabled={i.discriminatorValue !== "Pasantía a Verificar"}
                            onClick={ () => {
                              openModal(i)
                            }}
                          >
                            VALIDAR
                          </Button>
                          <Button
                            onClick={ () => {
                              openModalDelete(i)
                            }}
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

            <Modal
              key={'validateModal'}
              title={"Atención!"}
              onClose={() => {
                setShow(false);
              }}
              onConfirm={() => {
                validateInternship();
                setShow(false);
              }}
              show={show}
            >
              <p>¿Está seguro que quiere validar la pasantía {internship.searchTitle}?</p>
            </Modal>
            <Modal
              show={showInfo}
              key={'infoModal'}
              title={internship.searchTitle}
              onClose={() => {
                setShowInfo(false);
              }}
            >
              {internship?.id && (<ReadInternship internship={internship} />)}
            </Modal>
            <Modal
              key={'deleteModal'}
              title={"Atención!"}
              onClose={() => {
                setShowDelete(false);
              }}
                onConfirm={
                  internship.postulations?.length
                  ? undefined
                  :
                  () => {
                  deleteInternship();
                  setShowDelete(false);
                }}
              show={showDelete}
            >
              {internship.postulations?.length
              ? <p>Esta búsqueda ya tiene postulados, no se puede eliminar.</p>
              : <p>¿Está seguro que quiere eliminar la pasantía {internship.searchTitle}?</p>
              }
            </Modal>
          </div>
        </>
      )}
    </>
  );
};

export default PasantiasValidadas;
