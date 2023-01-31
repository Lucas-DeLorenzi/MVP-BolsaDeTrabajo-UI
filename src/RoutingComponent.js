import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, useAuthDispatch } from "context/AuthContextProvider";
import { DarkModeContext } from "context/DarkModeContext";

import Login from "views/Login";
import SignUpStudent from "views/signup/SignUpStudent";
import Password from "views/signup/Password";
import Code from "views/signup/Code";

import MainMenu from "views/MainMenu";
// admin routing
import Admin from "views/admin/Admin";
import Usuarios from "views/admin/Components/Usuarios";
import Careers from "views/admin/Components/Careers";
import AuxTables from "views/admin/Components/AuxTables";
import Searches from "views/admin/Components/Searches.js"
import PasantiasValidadas from "views/admin/Components/PasantiasValidadas";
import Jobs from "views/admin/Components/Jobs";

// company routing
import CompanyMenu from "views/company/CompanyMenu";
import Offers from "views/company/Offers";
import Pasantia from "views/company/Pasantia";
import RelacionDependencia from "views/company/RelacionDependencia";
import HistorialOfertas from "views/company/HistorialOfertas";
import Company from "views/company/Company";

// student routing
import StudentForm from "views/student/StudentRegister/StudentForm";
import OfertasLaborales from "views/student/StudentMenu/OfertasLaborales";
import Historial from "views/student/StudentRegister/Historial";
import StudentProfile from "views/student/StudentRegister/StudentProfile";
import DatosPersonales from "views/student/StudentRegister/DatosPersonales";
import DatosUniversitarios from "views/student/StudentRegister/DatosUniversitarios";
import OtrosDatos from "views/student/StudentRegister/OtrosDatos";
import ActualizarConocimientos from "views/student/StudentRegister/ActualizarConocimientos";


const RoutingComponent = () => {
  const auth = useAuth();
  const dispatch = useAuthDispatch();
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);
  const [routes, setRoutes] = useState("login");
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    let foundUser = "";
    if (loggedInUser) {
      foundUser = JSON.parse(loggedInUser);
    }
    dispatch.setLogin(foundUser, token);
  }, []);

  useEffect(() => {
    setRoutes(routesFunction());
  }, [auth.currentUser]);

  const routesFunction = () => {
    switch (auth.currentUser?.assigned_role) {
      case "Administrador": {
        return (
          <Routes>
            <Route path="main" element={<MainMenu />}>
              <Route path="admin" element={<Admin />}>
                <Route path="users" element={<Usuarios/>} />
                <Route path="careers" element={<Careers/>} />
                <Route path="auxTables" element={<AuxTables/>} />
                <Route path="searches" element={<Searches/>}>
                  <Route path="internships" element={<PasantiasValidadas/>}/>
                  <Route path="jobs" element={<Jobs/>}/>
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate replace to="main/admin/users" />} />
          </Routes>
        );
      }
      case "Empresa": {
        return (
          <Routes>
            <Route path="main" element={<MainMenu />}>
              <Route path="company" element={<CompanyMenu />}>
                <Route path="offers" element={<Offers />}>
                  <Route index element={<Navigate replace to="/main/company/offers/internship" />} />
                  <Route path="internship" element={<Pasantia />}/>
                  <Route path="job" element={<RelacionDependencia />} />
                </Route>
                <Route path="history" element={<HistorialOfertas />}/>
                <Route path="companyprofile" element={<Company />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate replace to="main/company" />} />
          </Routes>
        );
      }
      case "Alumno": {
        return (
          <Routes>
            <Route path="main" element={<MainMenu />}>
              <Route path="student" element={<StudentForm />}>
                <Route path="offers" element={<OfertasLaborales />}/>
                <Route path="history" element={<Historial />}/>
                <Route path="profile" element={<StudentProfile />}>
                  <Route index element={<Navigate replace to="/main/student/profile/personalData" />} />
                  <Route path="personalData" element={<DatosPersonales />}/>
                  <Route path="universityData" element={<DatosUniversitarios />}/>
                  <Route path="otherData" element={<OtrosDatos />} />
                  <Route path="knowledgements" element={<ActualizarConocimientos />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate replace to="main/student/offers" />} />
          </Routes>
        );
      }
      default: {
        return (
          <Routes>
            <Route path="login" element={<Login />} />;
            <Route path="signUp" element={<SignUpStudent />} />;
            <Route path="password" element={<Password/>}/>;
            <Route path="code" element={<Code/>} />;
            <Route path="*" element={<Navigate replace to="login" />} />
          </Routes>
        );
      }
    }
  };

  return <BrowserRouter>{routes}</BrowserRouter>;
};

export default RoutingComponent;
