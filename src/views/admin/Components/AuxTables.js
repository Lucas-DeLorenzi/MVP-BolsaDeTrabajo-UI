import React, { useState } from "react";
import AuxTableCRUD from "components/AuxTableCRUD";
import "./AuxTables.css";

const AuxTables = () => {
  const options = [
    { id: 0, name: "Tipo de Conocimientos", url: "/aux/KnowledgesTypes", isEditable: true },
    { id: 1, name: "Tipo de Documentos", url: "/aux/DocumentTypes", isEditable: true },
    { id: 2, name: "Tipo de Estado civil", url: "/aux/CivilStatus", isEditable: false },
    { id: 3, name: "Tipo de Género", url: "/aux/GenderTypes", isEditable: false },
    { id: 4, name: "Tipo de Valor de Conocimiento", url: "/aux/KnowledgeValues", isEditable: false },
    { id: 5, name: "Tipo de Jornada Laboral", url: "/aux/WorkdayTypes", isEditable: false },
  ];
  const [stateOptions, setStateOptions] = useState(0);

  const handleChange = (e) => {
    setStateOptions(e.target.value);
  };
  return (
    <>
      <div className="mt-3 d-flex justify-content-center">
        <select
          className="p-2 rounded text-center mb-3 select-tablas"
          onChange={(e) => {
            handleChange(e);
          }}
          value={stateOptions}
        >
          {options.map((o) => {
            return (
              <option className="p-1 " value={o.id} key={o.id}>
                {o.name}
              </option>
            );
          })}
        </select>
      </div>
      <AuxTableCRUD key={stateOptions} path={options[stateOptions].url} isEditable={options[stateOptions].isEditable} />
    </>
  )
}

export default AuxTables
