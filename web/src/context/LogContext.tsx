import { createContext, useContext, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { validateToken, validateeToken } from "../apollo/query";

const LogContext = createContext<boolean | undefined>(undefined);

export const useLog = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error("useLog must be used within a LogProvider");
  }
  return context;
};

export const LogProvider = ({ children }: { children: JSX.Element }) => {
  const [validate_token] = useLazyQuery(validateeToken);
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      validate_token({
        variables: {
          token: jwt,
        },
      }).then((data) => {
        if (data?.data?.validateeToken) {
          navigate("/", { replace: true });
        }
      });
    }
  }, [navigate, validate_token]);

  return (
    <LogContext.Provider value={undefined}>
      {children}
    </LogContext.Provider>
  );
};
