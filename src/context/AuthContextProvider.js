import React, {
  useReducer,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { baseUrl } from "utils/constants";
import { formatUserResponse } from "utils/helpers";

const initialState = {
  currentUser: null,
  waitingLogin: false,
  loginError: "",
  token: null, // JSON Web Token (JWT)
};

export const AuthContext = createContext(initialState);
export const AuthDispatchContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const [auth, dispatch] = useReducer(authReducer, initialState);

  const asyncDispatcher = {
    login: (email, password) => {
      dispatch({ type: "setWaitingLogin", waiting: true });

      //devMode
      if (email === "devMode@dev.com") {
        dispatch({ type: "setToken", token: `${password}-development` });
        dispatch({
          type: "setCurrentUser",
          currentUser: { name: `${password}-DevMode`, role: password },
        });
        return;
      }

      fetch(baseUrl + "/authentication/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => {
          if (res.status === 401) {
            return;
          }
          return res.json();
        })
        .then((loginResponse) => {
          if (loginResponse) {
            dispatch({ type: "setToken", token: loginResponse });

            fetch(baseUrl + "/login", {
              method: "GET",
              headers: {
                Authorization: "Bearer " + loginResponse,
              },
            })
              .then((res) => res.json())
              .then((res) => {
                if (res) {
                  dispatch({
                    type: "setCurrentUser",
                    currentUser: formatUserResponse(res.claims),
                  });
                } else {
                  dispatch({
                    type: "setError",
                    error: "Credenciales inválidas.",
                  });
                }
              })
              .catch((e) => {
                console.log(e);
                dispatch({
                  type: "setError",
                  error: "Ocurrió un error inesperado.",
                });
              });
          } else {
            dispatch({ type: "setError", error: "Credenciales inválidas." });
          }
        })
        .catch((e) => {
          console.log(e);
          dispatch({ type: "setError", error: "Ocurrió un error inesperado." });
        });
    },

    logout: () => {
      dispatch({ type: "setCurrentUser", currentUser: null });
      dispatch({ type: "setToken", token: null });
    },

    setLogin: function (user, token) {
      if (!user || !token) {
        dispatch({ type: "setCurrentUser", currentUser: null });
        dispatch({ type: "setToken", token: null });
        return;
      }
      dispatch({ type: "setUserFromLocalStorage", currentUser: user });
      dispatch({ type: "setToken", token });
    },
    clear: () => {
      dispatch({ type: "setError", error: "" })
    }
  };

  return (
    <AuthContext.Provider value={auth}>
      <AuthDispatchContext.Provider value={asyncDispatcher}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

function authReducer(state, action) {
  switch (action.type) {
    case "setCurrentUser": {
      localStorage.setItem("user", JSON.stringify(action.currentUser));
      return {
        ...state,
        currentUser: action.currentUser,
        waitingLogin: false,
        loginError: "",
      };
    }
    case "setToken": {
      localStorage.setItem("token", action.token);
      return { ...state, token: action.token };
    }
    case "setWaitingLogin": {
      return { ...state, waitingLogin: action.waiting };
    }
    case "setError": {
      return { ...state, loginError: action.error, waitingLogin: false };
    }
    case "setUserFromLocalStorage": {
      return { ...state, currentUser: action.currentUser };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

export function useAuth() {
  const auth = useContext(AuthContext);
  return auth;
}

export function useAuthDispatch() {
  return useContext(AuthDispatchContext);
}

export function useCapitalizeName(initialName) {
  const [name, setInternalName] = useState(initialName);
  useEffect(() => {
    if (name && new RegExp("[a-z]").test(name)) {
      setInternalName(name.toUpperCase());
    }
  }, [name]);
  return name;
}
