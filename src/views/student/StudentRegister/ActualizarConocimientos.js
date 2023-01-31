import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./style/StudentForm.css";
import { DarkModeContext } from "context/DarkModeContext";
import React, { useState, useContext, useEffect } from "react";
import Table from "react-bootstrap/Table";
import {
  customFetch,
  customFetchWithBody,
  getAuxData,
  handleServerError,
} from "utils/helpers";
import { useAuth, useAuthDispatch } from "context/AuthContextProvider";
import { toast } from "react-toastify";
import Modal from "components/Modal";

const ActualizarConocimientos = () => {
  const { darkMode } = useContext(DarkModeContext);
  const dispatch = useAuthDispatch();
  const auth = useAuth();

  const [show, setShow] = useState(false);

  const loadingOption = [{ id: "loading", name: "Cargando..." }];
  const [knowledgesTypes, setKnowledgeTypes] = useState(loadingOption);
  const [knowledgeValues, setKnowledgeValues] = useState(loadingOption);

  const [knowledgeTypeId, setKnowledgeTypeId] = useState("");
  const [knowledgeValueId, setKnowledgeValueId] = useState("");

  const [knowledge, setKnowledge] = useState({});

  const [studentKnowledgments, setStudentKnowledgments] = useState();
  const [loadingStudentKnowledgments, setLoadingStudentKnowledgments] =
    useState(false);
  const [loadingAddKnowledgment, setLoadingAddKnowledgment] = useState(false);

  const getStudentKnowledgments = () => {
    customFetch("GET", "/knowledge", auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        return response.json();
      })
      .then((body) => {
        if (body?.length) {
          setStudentKnowledgments(body);
        } else {
          setStudentKnowledgments([]);
        }
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      });
  };

  const addKnowledge = () => {
    if (!knowledgeTypeId || !knowledgeValueId) {
      toast.error("Seleccione tipo y valor de conocimiento");
      return;
    }
    setLoadingAddKnowledgment(true);
    customFetchWithBody(
      "POST",
      "/knowledge",
      { knowledgeTypeId, knowledgeValueId },
      auth.token
    )
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        return response.json();
      })
      .then((body) => {
        if (body) {
          toast.success("Se agregó el conocimiento");
          getStudentKnowledgments();
        } else {
          toast.error("Ya posee ese conocimiento.");
        }
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      })
      .finally(() => {
        setLoadingAddKnowledgment(false);
      });
  };

  const openModal = (k) => {
    setKnowledge(k);
    setShow(true);
  };

  const deleteKnowledge = (k) => {
    customFetch("DELETE", `/knowledge?knowledgeId=${k.id}`, auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        return response.json();
      })
      .then((body) => {
        if (body) {
          toast.success("Se eliminó el conocimiento");
          getStudentKnowledgments();
        } else {
          toast.error("No se pudo eliminar el conocimiento");
        }
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      });
  };

  useEffect(() => {
    getAuxData("KnowledgesTypes", setKnowledgeTypes, auth, dispatch);
    getAuxData("KnowledgeValues", setKnowledgeValues, auth, dispatch);
    getStudentKnowledgments();
  }, []);

  return (
    <div className="container-alumno-actualizar">
      <Form className={`form-alumno-conocimientos ${darkMode ? "dark" : ""}`}>
        <Form.Group className="mb-3 input-alumno">
          <Form.Label>Seleccione un conocimiento</Form.Label>
          <Form.Select
            onChange={(e) => {
              setKnowledgeTypeId(e.target.value);
            }}
          >
            <option value={""}>Seleccione una opción</option>
            {knowledgesTypes?.length ? (
              knowledgesTypes.map((kt) => {
                return (
                  <option key={kt.id} value={kt.id}>
                    {kt.name}
                  </option>
                );
              })
            ) : (
              <option key={1}>Lista vacía</option>
            )}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3 input-alumno">
          <Form.Label>Seleccione un nivel</Form.Label>
          <Form.Select
            onChange={(e) => {
              setKnowledgeValueId(e.target.value);
            }}
          >
            <option value={""}>Seleccione una opción</option>

            {knowledgeValues?.length ? (
              knowledgeValues.map((kv) => {
                return (
                  <option key={kv.id} value={kv.id}>
                    {kv.name}
                  </option>
                );
              })
            ) : (
              <option key={1}>Lista vacía</option>
            )}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3 input-alumno-button">
          <Button
            type="button"
            onClick={() => {
              addKnowledge();
            }}
            className={`mt-2 button-elim ${darkMode ? "dark" : ""}`}
          >
            Agregar
          </Button>
        </Form.Group>
      </Form>


      {!studentKnowledgments?.length ? (
        <h4 className={`errors-knowledge ${darkMode ? "dark" : ""}`}>No hay conocimientos agregados</h4>
      ) : (
        <Table
          bordered
          className={`p-1 table-knowledge ${darkMode ? "dark" : ""}`}
        >
          <thead>
            <tr>
              <th>Conocimiento</th>
              <th>Nivel</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="align-baseline">
            {studentKnowledgments.map((k) => {
              return (
                <tr key={k.id}>
                  <td>{k.knowledgeType.name}</td>
                  <td>{k.knowledgeValue.name}</td>
                  <td>
                    <Button
                      onClick={() => {
                        openModal(k);
                      }}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <Modal
        title={"Atención!"}
        onConfirm={() => {
          deleteKnowledge(knowledge);
          setShow(false);
        }}
        onClose={() => {
          setShow(false);
        }}
        show={show}
      >
        <p>{`¿Está seguro que desea eliminar ${knowledge?.knowledgeType?.name} de su lista de conocimientos?`}</p>
      </Modal>
    </div>
  );
};

export default ActualizarConocimientos;
