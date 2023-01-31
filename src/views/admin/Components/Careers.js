import React, { useEffect, useState, useContext } from "react";
import Modal from "components/Modal";
import { toast } from "react-toastify";
import {
  customFetch,
  customFetchWithBody,
  handleServerError,
} from "utils/helpers";
import { useAuthDispatch, useAuth } from "context/AuthContextProvider";
import Loading from "components/Loading";
import { DarkModeContext } from "context/DarkModeContext";
import "assets/style/Careers.css";
import { Button } from "react-bootstrap";


const Careers = () => {
  const dispatch = useAuthDispatch();
  const { darkMode } = useContext(DarkModeContext);
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  //carreras
  const [careerArr, setCareerArr] = useState([]);
  //modal
  const [show, setShow] = useState(false);
  const [currentAction, setCurrentAction] = useState({});
  const [newNameInput, setNewName] = useState("");
  // GET
  const getCareers = () => {
    setLoading(true);
    customFetch("GET", "/degrees", auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        return response.json();
      })
      .then((body) => {
        setCareerArr(body);
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
    getCareers();
  }, []);

  // POST
  const handleCreate = () => {
    setCurrentAction({ ...actions().create });
  };
  const handleConfirmCreation = (newName) => {
    if (newName === "") {
      toast.error("Debe ingresar un nombre");
      return;
    }
    if (careerArr.find((x) => x.degreeTitle === newName)) {
      toast.error("El nombre ya existe");
      return;
    }
    customFetchWithBody(
      "POST",
      "/degrees",
      { degreeTitle: newName },
      auth.token
    )
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        toast.success("Carrera añadida exitosamente");
        getCareers();
        setNewName("");
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      })
      .finally(() => {
        setShow(false);
      });
  };

  // PUT
  const inputChangeHandler = (e) => {
    setNewName(e.target.value);
  };
  const handleEdit = (degree) => {
    setCurrentAction({ ...actions(degree).update });
  };
  const handleConfirmEdition = (degreeToMutate, newName) => {
    if (newName === "") {
      toast.error("Debe ingresar un nombre");
      return;
    }
    if (degreeToMutate.degreeTitle === newName) {
      toast.error("Debe ingresar un nombre distinto");
      return;
    }
    const testcareer = {
      degreeTitle: newName,
      abbreviation: "string",
      degreeCategory: 0,
      totalSubjects: 0,
    };
    customFetchWithBody(
      "PUT",
      `/degrees?idDegree=${degreeToMutate.degreeId}`,
      testcareer,
      auth.token
    )
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        toast.success("Carrera editada exitosamente");
        getCareers();
        setNewName("");
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      })
      .finally(() => {
        setShow(false);
      });
  };

  //DELETE
  const handleDelete = (career) => {
    setCurrentAction({ ...actions(career).delete });
  };

  const handleConfirmDeletion = (careerToMutate) => {
    customFetch("DELETE", `/degrees/${careerToMutate.degreeId}`, auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        toast.success(`Se eliminó la carrera "${careerToMutate.degreeTitle}"`);
        getCareers();
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      })
      .finally(() => {
        setShow(false);
      });
  };

  const handleAdd = () => {
    if (careerArr.length === 0) {
      setCareerArr([{ degreeId: 1, degreeTitle: "Carrera 1" }]);
    } else {
      const maxValue = careerArr.at(-1).degreeId + 1;
      const carArrNew = [...careerArr];
      carArrNew.push({
        degreeId: maxValue,
        degreeTitle: `Carrera ${maxValue}`,
      });
      setCareerArr([...carArrNew]);
    }
  };

  const actions = (careerToMutate) => {
    if (careerToMutate === undefined) careerToMutate = {};
    return {
      create: {
        isCreate: true,
        title: "Crear una carrera",
        body: "Elija un nombre para la nueva carrera",
        confirm: (newName) => handleConfirmCreation(newName),
        showInput: true,
      },
      update: {
        isUpdate: true,
        title: "Editar carrera",
        body: `Elija un nuevo nombre para ${careerToMutate.degreeTitle}`,
        confirm: (newName) => handleConfirmEdition(careerToMutate, newName),
        showInput: true,
        careerToMutate: { ...careerToMutate },
      },
      delete: {
        isDelete: true,
        title: "Eliminar Carrera",
        body: `Esta seguro que desea eliminar la carrera "${careerToMutate.degreeTitle}"?`,
        confirm: () => handleConfirmDeletion(careerToMutate),
      },
    };
  };

  useEffect(() => {
    if (currentAction.title) {
      setShow(true);
    }
  }, [currentAction]);

  return (
    <div className={`mx-5 d-flex flex-column align-items-center container-careers ${darkMode ? "dark" : ""}`}>
      <button className={`mx-2 mb-2 button-agregar-carrera ${darkMode ? "dark" : ""}`} type="button" onClick={handleCreate}>
        Agregar carrera
      </button>
      {loading ? (
        <Loading />
      ) : !careerArr ? (
        <p className={`m-2 error-pasantia ${darkMode ? "dark" : ""}`}>No hay carreras para mostrar</p>
      ) : (
        <div className={`align-items-center p-2 container-carreras-in ${darkMode ? "dark" : ""}`}>
          {careerArr.map((x) => {
            return (
              <div
                className="d-flex flex-row align-items-center justify-content-between"
                key={x.degreeId}
              >
                <div className="mx-auto px-4">{x.degreeTitle}</div>
                <div>
                  <Button
                    className={`boton-carreras ${darkMode ? "dark" : ""}`}
                    type="button"
                    onClick={() => handleEdit(x)}
                  >
                    Editar
                  </Button>
                  <button
                    onClick={() => handleDelete(x)}
                    className={`boton-carreras ${darkMode ? "dark" : ""}`}
                    type="button"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Modal
        title={currentAction.title}
        onClose={() => {
          setNewName("");
          setShow(false);
        }}
        onConfirm={() => {
          currentAction.confirm(newNameInput);
        }}
        show={show}
      >
        <p>{currentAction.body}</p>
        {currentAction.showInput && (
          <div>
            <label>
              Nombre:
              <input
                className="mx-2"
                type="text"
                id="Name"
                name="Name"
                value={newNameInput}
                onChange={inputChangeHandler}
              />
            </label>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Careers;
