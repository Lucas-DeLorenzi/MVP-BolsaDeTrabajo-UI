import { DarkModeContext } from "context/DarkModeContext";
import React, { useState, useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useAuth, useAuthDispatch } from "context/AuthContextProvider";
import { customFetch, handleServerError, displayDatetime } from "utils/helpers";
import Loading from "components/Loading";
import { toast } from "react-toastify";
import "./style/StudentForm.css";

const Historial = () => {
  const { darkMode } = useContext(DarkModeContext);
  const auth = useAuth();
  const dispatch = useAuthDispatch();
  const [loading, setLoading] = useState(false);
  const [postulations, setPostulations] = useState([]);

  const getPostulations = () => {
    setLoading(true);
    customFetch("GET", "/postulation", auth.token)
    .then((response) => {
      const error = handleServerError(dispatch, response);
      if (error) {
        return;
      }
      return response.json();
    })
    .then((body) => {
      if (body !== undefined) {
        setPostulations(body);
        return
      }
      setPostulations([]);
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
    getPostulations()
  }, []);

  return (
    <div>
      { loading 
      ? <Loading/>
      : postulations?.length
      ? (<div className={`table-historial-ofertas ${darkMode ? "dark" : ""}`}>
          <Table bordered hover className={`table-users ${darkMode ? "dark" : ""}`}>
            <thead>
              <tr>
                <th>Título de la búsqueda</th>
                <th>Fecha de postulación</th>
              </tr>
            </thead>
            <tbody className="align-baseline">
              {postulations.map((p) => {
                return (
                  <tr key={p.id}>
                    <td>{p.search.searchTitle}</td>
                    <td>{displayDatetime(p.postulationDate)}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>)
      : <h4 className={`text-center mt-4 error-histo ${darkMode ? "dark" : ""}`}>No hay postulaciones para mostrar.</h4>
      }
    </div>
  )
}

export default Historial