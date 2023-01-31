import React, { useState, useContext, useEffect } from "react";
import "./HistorialOfertas.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { DarkModeContext } from "context/DarkModeContext";
import { Table } from "react-bootstrap";
import Modal from "components/Modal";
import { customFetch, displayDatetime, handleServerError } from "utils/helpers";
import { useAuth, useAuthDispatch } from "context/AuthContextProvider";
import { toast } from "react-toastify";
import ReadStudent from "components/ReadStudent";

const HistorialPostulados = ({ search, goBack }) => {
  const { darkMode } = useContext(DarkModeContext);
  const auth = useAuth();
  const dispatch = useAuthDispatch();
  const [show, setShow] = useState(false);
  const [student, setStudent] = useState({});
  
  const openModal = (student) => {
    setStudent(student)
    setShow(true);
  }

  const downloadCV = (student) => {
    customFetch("GET", `/mail/DownloadCV?userId=${student.id}`, auth.token)
    .then((res) => {
      const error = handleServerError(dispatch, res);
      if (error) {
        return;
      }
      return res.blob();
    })
    .then((blob) => {
      if(!blob) {
        toast.error('Algo salió mal. Inténtelo más tarde.')
        return
      }
      const url = window.URL.createObjectURL(
        new Blob([blob]),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${student.name}_CV.pdf`,
      );
  
      // Append to html link element page
      document.body.appendChild(link);
  
      // Start download
      link.click();
  
      // Clean up and remove the link
      link.parentNode.removeChild(link);

    })
    .catch((err) => {
      console.log({err});
    })
  }
  
  return (
    <div>
      <div className={`table-historial-ofertas ${darkMode ? "dark" : ""}`}>
        <Button
          className={`back-button ${darkMode ? "dark" : ""}`}
          onClick={() => {
            goBack('')
          }}
        >
          Volver
        </Button>
        {
        !search?.postulations?.length
        ? <h4 className="mt-3 text-center">No hay postulados en la oferta seleccionada.</h4>
        : (<Table
          bordered
          hover
          className={`table-users ${darkMode ? "dark" : ""}`}
        >
          <thead>
            <tr>
              <th>Nombre y apellido</th>
              <th>Legajo</th>
              <th>Fecha postulación</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="align-baseline">
            {
              search.postulations.map(postulation => {
                return (
                  <tr key={postulation.id}>
                    <td>{postulation.student.name}</td>
                    <td>{postulation.student.fileNumber}</td>
                    <td>{displayDatetime(postulation.postulationDate)}</td>
                    <td>
                      <Button
                        disabled={!postulation.student.otherData?.fileName}
                        onClick={()=>{downloadCV(postulation.student)}}
                      >
                        {postulation.student.otherData?.fileName? 'DESCARGAR CV' : 'Sin CV'}
                      </Button>
                      <Button onClick={() => { openModal(postulation.student) }}>+INFO</Button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>)}
      </div>
      <Modal
        title={'Postulante'}
        onClose={() => {
          setShow(false);
        }}
        show={show}
      >
        <ReadStudent student={student}/>
      </Modal>
    </div>
  );
};

export default HistorialPostulados;
