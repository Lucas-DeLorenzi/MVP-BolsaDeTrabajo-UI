import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "context/DarkModeContext";
import Modal from "components/Modal";
import { toast } from "react-toastify";
import {
  customFetch,
  customFetchWithBody,
  handleServerError,
} from "utils/helpers";
import { useAuthDispatch, useAuth } from "context/AuthContextProvider";
import Loading from "components/Loading";
import "../assets/style/Careers.css";

const AuxTableCRUD = ({ path, isEditable }) => {
  const { darkMode } = useContext(DarkModeContext);
  const dispatch = useAuthDispatch();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  // Data
  const [dataArr, setDataArr] = useState([]);
  // Modal
  const [show, setShow] = useState(false);
  const [currentAction, setCurrentAction] = useState({});
  const [newNameInput, setNewName] = useState("");

  const getData = () => {
    setLoading(true);
    customFetch("GET", path, auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        return response.json();
      })
      .then((body) => {
        setDataArr(body);
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
    getData();
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
    if (dataArr.find((x) => x.name === newName)) {
      toast.error("El nombre ya existe");
      return;
    }
    customFetchWithBody("POST", path, newName, auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        toast.success("Elemento añadido exitosamente");
        getData();
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

  const handleEdit = (element) => {
    setCurrentAction({ ...actions(element).update });
  };

  const handleConfirmEdition = (elementToMutate, newName) => {
    if (newName === "" || elementToMutate.name === newName) {
      toast.error("Debe ingresar un nombre");
      return;
    }
    customFetchWithBody(
      "PUT",
      path,
      { name: newName, id: elementToMutate.id },
      auth.token
    )
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        toast.success("Elemento editado exitosamente");
        getData();
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
  const handleDelete = (element) => {
    setCurrentAction({ ...actions(element).delete });
  };

  const handleConfirmDeletion = (elementToMutate) => {
    customFetch("DELETE", `${path}/${elementToMutate.id}`, auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        toast.success(`Se eliminó el elemento "${elementToMutate.name}"`);
        getData();
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      })
      .finally(() => {
        setShow(false);
      });
  };

  const actions = (elementToMutate) => {
    if (elementToMutate === undefined) elementToMutate = {};
    return {
      create: {
        isCreate: true,
        title: "Crear un elemento",
        body: "Elija un nombre para el nuevo elemento",
        confirm: (newName) => handleConfirmCreation(newName),
        showInput: true,
      },
      update: {
        isUpdate: true,
        title: "Editar elemento",
        body: `Elija un nuevo nombre para ${elementToMutate.name}`,
        confirm: (newName) => handleConfirmEdition(elementToMutate, newName),
        showInput: true,
        elementToMutate: { ...elementToMutate },
      },
      delete: {
        isDelete: true,
        title: "Eliminar elemento",
        body: `Esta seguro que desea eliminar el elemento "${elementToMutate.name}"?`,
        confirm: () => handleConfirmDeletion(elementToMutate),
      },
    };
  };

  useEffect(() => {
    if (currentAction.title) {
      setShow(true);
    }
  }, [currentAction]);

  return (
    <div className={`d-flex flex-column align-items-center container-careers${darkMode ? "dark" : ""}`}>
      <button className={`mx-2 mb-2 button-agregar-carrera ${darkMode ? "dark" : ""}`}  type="button" onClick={handleCreate} disabled={!isEditable}>
        Agregar elemento
      </button>
      {loading ? (
        <Loading />
      ) : !dataArr ? (
        <p className={`m-2 error-pasantia ${darkMode ? "dark" : ""}`}>No hay elementos para mostrar</p>
      ) : (
        <div className={`align-items-center p-2 container-carreras-in ${darkMode ? "dark" : ""}`}>
          {dataArr.map((x) => {
            return (
              <div
                className="d-flex flex-row justify-content-between"
                key={x.id}
              >
                <div className="mx-auto align-self-center px-4">{x.name}</div>
                <div>
                  <button
                    className={`mx-2  boton-carreras ${darkMode ? "dark" : ""}`}
                    type="button"
                    onClick={() => handleEdit(x)}
                    disabled={!isEditable}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(x)}
                    className={`mx-2  boton-carreras ${darkMode ? "dark" : ""}`}
                    type="button"
                    disabled={!isEditable}
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

export default AuxTableCRUD;
