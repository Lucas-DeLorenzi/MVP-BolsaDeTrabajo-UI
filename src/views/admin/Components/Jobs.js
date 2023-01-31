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
import ReadJob from "components/ReadJob";

const Jobs = () => {
  // helpers
  const { darkMode } = useContext(DarkModeContext);
  const auth = useAuth();
  const dispatch = useAuthDispatch();
  // modals
  const [showInfo, setShowInfo] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  // async
  const [loading, setLoading] = useState(false);
  // jobs manipulation
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [job, setJob] = useState([]);
  // filters
  const [companyFilter, setCompanyFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');

  const openModalInfo = (j) => {
    setJob(j)
    setShowInfo(true);
  };

  const openModalDelete = (j) => {
    setJob(j)
    setShowDelete(true);
  }

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (companyFilter !== '') {
      setFilteredJobs(jobs.filter(j => j.company.name.includes(companyFilter)))
    } else {
      setFilteredJobs(jobs)
    }
  }, [companyFilter]);

  useEffect(() => {
    if (titleFilter !== '') {
      setFilteredJobs(jobs.filter(j => j.searchTitle.includes(titleFilter)))
    } else {
      setFilteredJobs(jobs)
    }
  }, [titleFilter]);
  
  const handleCompanyChange = (e) => {
    setCompanyFilter(e.target.value);
  };
  const handleTitleChange = (e) => {
    setTitleFilter(e.target.value);
  };


  const getJobs = () => {
    setLoading(true);
    customFetch("GET", '/searches/jobs', auth.token)
    .then((response) => {
      const error = handleServerError(dispatch, response);
      if (error) {
        return;
      }
      return response.json();
    })
    .then((body) => {
      if (body?.length) {
        setJobs(body);
        setFilteredJobs(body)
        return;
      }
      setJobs([]);
      setFilteredJobs([])
    })
    .catch((er) => {
      console.log(er);
      toast.error("Ocurrió un error");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const deleteJob = () => {
    customFetch("DELETE", `/searches/${job.id}`, auth.token)
    .then((res) => {
      const error = handleServerError(dispatch, res);
      if (error) {
        toast.error("Algo falló, inténtelo nuevamente")
        return;
      }
      toast.success("Se eliminó la búsqueda");
    })
    .catch((er) => {
      console.log(er);
      toast.error("Ocurrió un error");
    })
    .finally(() => {
      getJobs();
    });
  }
  

  return (
    <>
      <div className="mt-3 d-flex flex-column flex-sm-row mx-3 justify-content-center gap-3 flex-wrap">
        <div className="d-flex flex-column">
          <div className={`mb-2 text-center inputs-jobs-cont ${darkMode ? "dark" : ""}`}>
            Empresa
          </div>
          <input
            className={`p-1 rounded text-center mb-3 inputs-jobs ${darkMode ? "dark" : ""}`}
            onChange={(e) => {
              handleCompanyChange(e);
            }}
            value={companyFilter}
          />
        </div>

        <div className="d-flex flex-column">
          <div className={`mb-2 text-center inputs-jobs-cont ${darkMode ? "dark" : ""}`}>
            Título
          </div>
          <input
            className={`p-1 rounded text-center mb-3 inputs-jobs ${darkMode ? "dark" : ""}`}
            onChange={(e) => {
              handleTitleChange(e);
            }}
            value={titleFilter}
          />
        </div>
      </div>
      { loading
      ? <Loading/>
      : !filteredJobs?.length
      ? <h4 className={`mt-5 text-center error-pasantia ${darkMode ? "dark" : ""}`}> No hay búsquedas de empleo para mostrar.</h4>
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
                  <th>Título Empleo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="align-baseline">
                {
                  filteredJobs.map((j) => {
                    return (
                      <tr key={j.id}>
                        <td>{j.company.name}</td>
                        <td>{j.searchTitle}</td>
                        <td>
                          <Button 
                            onClick={ () => {
                              openModalInfo(j)
                            }}
                          >
                            +INFO
                          </Button>
                          <Button
                            onClick={ () => {
                              openModalDelete(j)
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
              show={showInfo}
              key={'infoModal'}
              title={job.searchTitle}
              onClose={() => {
                setShowInfo(false);
              }}
            >
              {job?.id && (<ReadJob job={job} />)}
            </Modal>
            <Modal
              key={'deleteModal'}
              title={"Atención!"}
              onClose={() => {
                setShowDelete(false);
              }}
              onConfirm={() => {
                deleteJob();
                setShowDelete(false);
              }}
              show={showDelete}
            >
              <p>¿Está seguro que quiere eliminar la búsqueda {job.searchTitle}?</p>
            </Modal>
          </div>
        </>
      )}
    </>
  );
};

export default Jobs;
