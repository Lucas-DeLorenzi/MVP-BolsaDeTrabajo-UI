import AuthContextProvider from "context/AuthContextProvider";
import { DarkModeProvider } from "context/DarkModeContext";
import RoutingComponent from "RoutingComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <AuthContextProvider>
      <DarkModeProvider>
        <RoutingComponent />
        <ToastContainer />
      </DarkModeProvider>
    </AuthContextProvider>

  );
};

export default App;
