
import React, { useState, useContext, useEffect } from "react";
import './HistorialOfertas.css';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import HistorialPostulados from "./HistorialPostulados";
import Loading from "components/Loading";
import Modal from "components/Modal";

import { DarkModeContext } from "context/DarkModeContext";
import { customFetch, handleServerError } from "utils/helpers";
import { useAuth, useAuthDispatch } from "context/AuthContextProvider";
import { toast } from "react-toastify";
import ReadJob from "components/ReadJob";
import ReadInternship from "components/ReadInternship";


const HistorialOfertas = () => {
  // helpers
  const { darkMode } = useContext(DarkModeContext);
  const auth = useAuth();
  const dispatch = useAuthDispatch();

  const [openJobRequest, setOpenJobRequest] = useState("");
  // async
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  // modals
  const [showInfo, setShowInfo] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  //objects
  const [searches, setSearches] = useState([]);
  const [search, setSearch] = useState({});

  //filters



  useEffect(() => {
    getSearches();
  }, []);

  const openModalInfo = (s) => {
    findSearch(s.id, s.discriminatorValue);
    setShowInfo(true);
  }

  const openPostulations = (s) => {
    findSearch(s.id, s.discriminatorValue)
      .then((res)=>{
        if (res) {
          setOpenJobRequest("open");
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }


  const getSearches = () => {
    setLoading(true);
    customFetch("GET", "/searches?validationStatus=0", auth.token)
    .then((response) => {
      const error = handleServerError(dispatch, response);
      if (error) {
        return;
      }
      return response.json();
    })
    .then((body) => {
      setSearches(body);
    })
    .catch((er) => {
      console.log(er);
      toast.error("Ocurrió un error");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const findSearch = (id, discriminator) => {
    return new Promise((resolve, reject) => {
      setLoadingSearch(true);
      let path = 'internships';
      if (discriminator === 'Empleo') {
        path = 'jobs';
      }
      customFetch("GET", `/searches/${path}/${id}`, auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          reject(false)
          return;
        }
        return response.json();
      })
      .then((body) => {
        setSearch(body);
        resolve(true)
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
        reject(false)
      })
      .finally(() => {
        setLoadingSearch(false);
      });
    });
  };



  return (
    <div>
      {
        openJobRequest === "open" 
        ? <HistorialPostulados search={ search } goBack={setOpenJobRequest}/> 
        : ( loading
          ? <Loading/>
          : !searches?.length
          ? <h4 className={`mt-5 text-center error-history ${darkMode ? "dark" : ""}`}> No hay ofertas para mostrar.</h4>
          : <div className={`table-historial-ofertas ${darkMode ? "dark" : ""}`}>
              <Table bordered hover className={`table-users ${darkMode ? "dark" : ""}`}>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Tipo/Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="align-baseline">
                  {
                    searches.map((s) => {
                      return (
                        <tr key={s.id}>
                          <td>{s.searchTitle}</td>
                          <td>{s.discriminatorValue}</td>
                          <td>
                            <Button 
                              onClick={ () => {
                                openModalInfo(s)
                              }}
                            >
                              +INFO
                            </Button>
                            <Button onClick={() => {
                              openPostulations(s);
                            }}
                            >
                              VER POSTULADOS
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </Table>
              <Modal
              show={showInfo}
              key={'infoModal'}
              title={search.searchTitle}
              onClose={() => {
                setShowInfo(false);
              }}
            >
            {
              loadingSearch
              ? <Loading/>
              : !search?.id 
              ? <p>Algo falló, intentelo nuevamente.</p>
              : search.discriminatorValue === "Empleo"
              ? <ReadJob job={search} />
              : <ReadInternship internship={search} />
            }
            </Modal>
            </div>)
      }
    </div>
  )
}

export default HistorialOfertas