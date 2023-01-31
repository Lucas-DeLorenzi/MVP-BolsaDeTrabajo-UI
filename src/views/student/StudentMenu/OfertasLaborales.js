import React, { useEffect, useState, useContext } from "react";
import { Button } from "react-bootstrap";
import "./style/OfertasLaborales.css";
import Modal from "components/Modal";
import { DarkModeContext } from "context/DarkModeContext";
import Loading from "components/Loading";
import { displayDatetime, getAuxData } from "utils/helpers";

import { useAuth, useAuthDispatch } from "context/AuthContextProvider";

import { customFetch, handleServerError } from "utils/helpers";
import { toast } from "react-toastify";


const OfertasLaborales = () => {
  const { darkMode } = useContext(DarkModeContext);
  const auth = useAuth();
  const dispatch = useAuthDispatch();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingPostulation, setLoadingPostulation] = useState(false);
  const [searches, setSearches] = useState([]);
  const [filteredSearches, setFilteredSearches] = useState([]);

  const [search, setSearch] = useState({});
  const [modalOptions, setModalOptions] = useState({})

  const loadingOption = [{ id: "", name: "Cargando..." }];
  const [knowledgesTypes, setKnowledgeTypes] = useState(loadingOption);

    // filters
    const [companyFilter, setCompanyFilter] = useState('');
    const [titleFilter, setTitleFilter] = useState('');
    const [knowledgeId, setKnowledgeId] = useState('');

  const openModal = () => {
    setShow(true);
  };

  useEffect(() => {
    if (titleFilter !== '') {
      setCompanyFilter('');
      setKnowledgeId('');
      setFilteredSearches(searches.filter(i => i.searchTitle.includes(titleFilter)));
    } else {
      setFilteredSearches(searches);
    }
  }, [titleFilter]);

  useEffect(() => {
    if (companyFilter !== '') {
      setTitleFilter('');
      setKnowledgeId('');
      setFilteredSearches(searches.filter(i => i.company.name.includes(companyFilter)));
    } else {
      setFilteredSearches(searches);
    }
  }, [companyFilter]);

  useEffect(() => {
    if (knowledgeId !== '') {
      setCompanyFilter('');
      setTitleFilter('');
      setFilteredSearches(searches.filter(i => i.knowledgeTypes?.length && i.knowledgeTypes.some((k) => k.id === knowledgeId)));
    } else {
      setFilteredSearches(searches);
    }
  }, [knowledgeId]);

  const handleCompanyChange = (e) => {
    setCompanyFilter(e.target.value);
  };
  const handleTitleChange = (e) => {
    setTitleFilter(e.target.value);
  };
  const handleKnowledgeIdChange = (e) => {
    setKnowledgeId(e.target.value);
  };

  const getSearches = () => {
    setLoading(true);
    customFetch("GET", "/searches", auth.token)
    .then((response) => {
      const error = handleServerError(dispatch, response);
      if (error) {
        return;
      }
      return response.json();
    })
    .then((body) => {
      setSearches(body.filter(s => s.company.validation.updatedAt !== null));
      setFilteredSearches(body.filter(s => s.company.validation.updatedAt !== null));
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
    setLoadingSearch(true);
    let path = 'internships';
    if (discriminator === 'Empleo') {
      path = 'jobs';
    }
    customFetch("GET", `/searches/${path}/${id}`, auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        return response.json();
      })
      .then((body) => {
        setSearch(body);
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      })
      .finally(() => {
        setLoadingSearch(false);
      });
  };

  const postulate = () => {
    setLoadingPostulation(true);
    customFetch("POST", `/postulation?searchId=${search.id}`, auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        return response.json()
      })
      .then((body) => {
        if (body) {
          toast.success("Postulación exitosa");
          setShow(false);
        } else {
          toast.error("Ocurrió un error en el proceso de postulación");
        }
        getSearches();
        setSearch({});
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      })
      .finally(() => {
        setLoadingPostulation(false);
      });
  };

  const removePostulation = () => {
    setLoadingPostulation(true);
    const postulationId = search.postulations.find((p) => p.studentId === auth?.currentUser?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'])?.id;
    customFetch("DELETE", `/postulation?postulationId=${postulationId}`, auth.token)
      .then((response) => {
        const error = handleServerError(dispatch, response);
        if (error) {
          return;
        }
        return response.json()
      })
      .then((body) => {
        if (body) {
          toast.success("Postulación removida");
          setShow(false);
        } else {
          toast.error("Ocurrió un error en el proceso");
        }
        getSearches();
        setSearch({});
      })
      .catch((er) => {
        console.log(er);
        toast.error("Ocurrió un error");
      })
      .finally(() => {
        setLoadingPostulation(false);
      });
  };

  useEffect(() => {
    getAuxData('KnowledgesTypes', setKnowledgeTypes, auth, dispatch);
    getSearches()
  }, []);

  return (
    <div>
      <main className={`main-container-ofertas ${darkMode ? "dark" : ""}`}>

        {
          auth?.currentUser?.validated === 'False' && (
            <div className="w-100 text-bg-danger text-center h6 p-3 mb-3">
              Usted no está validado. Puede ver las ofertas, pero no postularse. Un administrador verificará sus datos. Ante cualquier consulta, póngase en contacto con <strong>admin@admin.admin</strong>.
            </div>
          )
        }

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
            Conocimiento
          </div>
          <select
            className="p-2 rounded text-center mb-3 select-tablas"
            onChange={(e) => {
              handleKnowledgeIdChange(e);
            }}
            value={knowledgeId}
            >
            <option value={''}>Todas</option>
            {
              knowledgesTypes?.length 
              && knowledgesTypes.map((k) => {
                return (
                  <option key={k.id} value={k.id}>{k.name}</option>
                )
              })
            }
          </select>
        </div>
      </div>
        { loading 
        ? <Loading /> 
        : !filteredSearches?.length
        ? (<h3 className={`text-center error-pasantia ${darkMode ? "dark" : ""}`}>No se encontraron búsquedas</h3>)
        : (<div className={`job-container ${darkMode ? "dark" : ""}`}>
            <section className={`job-list ${darkMode ? "dark" : ""}`}>
              <ul className={`job-ul ${darkMode ? "dark" : ""}`}>
                {
                filteredSearches.map((s) => {
                    return (
                      <li key={s.id} className={`${s.id === search?.id ? "selected-card" : ""} job-cards ${darkMode ? "dark" : ""}`} onClick={() => findSearch(s.id, s.discriminatorValue)}>
                        <h3>{s.searchTitle}</h3>
                        <h5>{s.company.name}</h5>
                        {s.postulations.some(p => p.studentId === auth?.currentUser?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'])
                          && <p className="text-bg-success text-center">Ya postulado</p>}
                        <p>{`Especialidad: ${s.degrees.map((d => { return d.degreeTitle })).join(" - ")}`}</p>
                        <p>{`Skills requeridas: ${s.knowledgeTypes.map((k => { return k.name })).join(" - ")}`}</p>
                        <p>{`Activa desde: ${displayDatetime(s.dateFrom).substring(0,10)}`}</p>
                        <p>{s.discriminatorValue}</p>
                      </li>
                    )
                  })
                }
              </ul>
            </section>

            {
              loadingSearch
                ? <div className={`job-description ${darkMode ? "dark" : ""}`}><Loading /> </div>
                : !search?.id
                  ? (<section className={`job-description ${darkMode ? "dark" : ""}`}>
                    <h2>Haga click en una búsqueda!</h2>
                  </section>)
                  : (<section className={`job-description ${darkMode ? "dark" : ""}`}>
                    <h1  className="title-oferta">{search.searchTitle}</h1>
                    <h4>{search.company.name}</h4>
                    <p>
                      {search.searchDescription}
                    </p>
                    {search.postulations.some(p => p.studentId === auth?.currentUser?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'])
                      ? (<Button
                        className={`button-postularse ${darkMode ? "dark" : ""}`}
                        disabled={auth?.currentUser?.validated === "False" || loadingPostulation}
                        onClick={() => {
                          setModalOptions({ body: '¿Está seguro que desea dar de baja la postulación?', postulate: false })
                          openModal();
                        }}
                      >
                        Remover postulación
                      </Button>)
                      : (<Button
                        className={`button-postularse ${darkMode ? "dark" : ""}`}
                        disabled={auth?.currentUser?.validated === "False" || loadingPostulation}
                        onClick={() => {
                          setModalOptions({ body: '¿Está seguro que quiere postularse a esta oferta?', postulate: true })
                          openModal();
                        }}
                      >
                        Postularse
                      </Button>)}
                  </section>)
            }
          </div>)}
        <Modal
          title={"Atención!"}
          disabled={loadingPostulation}
          onConfirm={() => {
            modalOptions.postulate
              ? postulate()
              : removePostulation()
          }}
          onClose={() => {
            setShow(false);
          }}
          show={show}
        >
          <p>{modalOptions.body}</p>
        </Modal>
      </main>
    </div>
  );
};

export default OfertasLaborales;
