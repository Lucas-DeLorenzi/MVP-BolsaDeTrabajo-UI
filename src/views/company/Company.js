import React, { useState, useContext, useEffect } from "react";
import "./Company.css";
import Form from "react-bootstrap/Form";
import { DarkModeContext } from "context/DarkModeContext";
import Loading from "components/Loading";
import Modal from "components/Modal";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { updCompanyDataSchema } from "validationModels/updCompanyDataSchema";
import { getAuxData, customFetch, handleServerError, customFetchWithBody } from "utils/helpers";
import { useAuth, useAuthDispatch } from "context/AuthContextProvider";
import Errors from "components/Errors";

const Company = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(false);
  const [relationTypes, setRelationTypes] = useState();
  const [show, setShow] = useState(false);
  const [response, setResponse] = useState({ success: false, msg: "" });
  const [formValuesWait, setFormValuesWait] = useState();
  const [uniqueFields, setUniqueFields] = useState();
  const [currentUniqueFields, setCurrentUniqueFields] = useState();
  const auth = useAuth();
  const dispatch = useAuthDispatch();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({ mode: "all", resolver: joiResolver(updCompanyDataSchema(uniqueFields, currentUniqueFields)) });
  
  const onSubmit = (formValues) => {
    setFormValuesWait(formValues);
    setShow(true);
  };

  const confirmSubmit = () => {
    setShow(false);
    setLoading(true);
    customFetchWithBody('PUT', '/company/updateCompanyData', formValuesWait, auth.token)
      .then((res) => {
        if (res.status === 200) {
          setResponse({
            ...response, success: true,
            msg: "Sus datos se han actualizado correctamente!"
          });
        } else {
          setResponse({
            ...response, success: false,
            msg: "Ocurrió un error"
          })
        }
      })
      .catch(() => setResponse({
        ...response, success: false,
        msg: "Ocurrió un error"
      }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setLoading(true);
    getAuxData('RelationTypes', setRelationTypes, auth, dispatch)
    customFetch('GET', '/company/GetCompaniesUniqueFields', auth.token)
      .then((res) => {
        const error = handleServerError(dispatch, res);
        if (error) {
          return;
        }
        return res.json();
      })
      .then((res) => {
        setUniqueFields(res)
      }).catch(() => {
        toast.error("Ocurrió un error")
      })
    customFetch('GET', `/company/GetCurrentCompanyData`, auth.token)
      .then((res) => {
        const error = handleServerError(dispatch, res);
        if (error) {
          return;
        }
        return res.json();
      })
      .then((res) => {
        reset({
          ...res
        });
        setCurrentUniqueFields({
          businessName: res.businessName,
          email: res.email,
          cuilCuit: res.cuilCuit,
        }
        )
      })
      .catch(() => {
        toast.error("Ocurrió un error")
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (response.msg !== "") {
      response.success
        ? toast.success(response.msg)
        : toast.error(response.msg);
      setResponse({ ...response, success: false, msg: "" });
    }
  }, [response]);

  return (
    <div className="background-company">
      {loading ? <Loading /> :
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className={`form-empresa ${darkMode ? "dark" : ""}`}
          >
            <h3 >Datos de la empresa:</h3>
            <h3 className="h3-inv"></h3>
            <h3 className="h3-inv"></h3>
            <Form.Group className="form-group-company">
              <Form.Label>Razon Social</Form.Label>
              <Form.Control type="text" {...register("businessName")} />
              <Errors errorMsg={errors.businessName?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>CUIT</Form.Label>
              <Form.Control type="number" {...register("cuilCuit")} />
              <Errors errorMsg={errors.cuilCuit?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" {...register("email")} />
              <Errors errorMsg={errors.email?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Rubro</Form.Label>
              <Form.Control type="text" {...register("sector")} />
              <Errors errorMsg={errors.sector?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Calle</Form.Label>
              <Form.Control type="text" {...register("address.street")} />
              <Errors errorMsg={errors.address?.street?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Nro Calle</Form.Label>
              <Form.Control type="number" {...register("address.streetNumber")} />
              <Errors errorMsg={errors.address?.streetNumber?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Letra Bis</Form.Label>
              <Form.Control type="text" {...register("address.letterBis")} />
              <Errors errorMsg={errors.address?.letterBis?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Piso</Form.Label>
              <Form.Control type="number" {...register("address.floor")} />
              <Errors errorMsg={errors.address?.floor?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Depto</Form.Label>
              <Form.Control type="text" {...register("address.apartment")} />
              <Errors errorMsg={errors.address?.apartment?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Codigo Postal</Form.Label>
              <Form.Control type="text" {...register("address.postalCode")} />
              <Errors errorMsg={errors.address?.postalCode?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Localidad</Form.Label>
              <Form.Control type="text" {...register("address.city")} />
              <Errors errorMsg={errors.address?.city?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Telefono</Form.Label>
              <Form.Control type="number" {...register("phoneNumber")} />
              <Errors errorMsg={errors.phoneNumber?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Web</Form.Label>
              <Form.Control type="text" {...register("webSite")} />
              <Errors errorMsg={errors.webSite?.message} />
            </Form.Group>
            <h3 className="h3-inv"></h3>
            <h3 className="h3-inv"></h3>
            <h3>Datos de contacto:</h3>
            <h3 className="h3-inv"></h3>
            <h3 className="h3-inv"></h3>
            <Form.Group className="form-group-company">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" {...register("contact.firstName")} />
              <Errors errorMsg={errors.contact?.firstName?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Apellido</Form.Label>
              <Form.Control type="text" {...register("contact.lastName")} />
              <Errors errorMsg={errors.contact?.lastName?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Puesto/Cargo</Form.Label>
              <Form.Control type="text" {...register("contact.position")} />
              <Errors errorMsg={errors.contact?.position?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="number" {...register("contact.phone")} />
              <Errors errorMsg={errors.contact?.phone?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" {...register("contact.email")} />
              <Errors errorMsg={errors.contact?.email?.message} />
            </Form.Group>

            <Form.Group className="form-group-company">
              <Form.Label>Relación del contacto con la empresa</Form.Label>
              <Form.Select {...register("contact.relationTypeId")}>
                {relationTypes?.length ? (
                  relationTypes.map((status) => {
                    return <option key={status.id} value={status.id}>{status.name}</option>;
                  })
                ) : (
                  <option>Lista Vacía</option>
                )}
              </Form.Select>
              <Errors errorMsg={errors.contact?.relationTypeId?.message} />
            </Form.Group>
            <h1></h1>
            <Form.Group className="mb-3 form-group-company">
              <button className={`button-form-empresa ${darkMode ? "dark" : ""}`} variant="primary" type="submit">
                GUARDAR
              </button>
            </Form.Group>
          </Form>
      }
      <Modal
        title={'Atención!'}
        children={'¿Está seguro de que quiere actualizar los datos de la empresa?'}
        onClose={() => {
          setShow(false);
        }}
        onConfirm={() => {
          confirmSubmit();
        }}
        show={show}
      ></Modal>

    </div>
  );
};

export default Company;
