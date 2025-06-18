import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

interface UserContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const UserContext = createContext<UserContextValue | undefined>(
  undefined
);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const ID_MOCKADO = "6851b4096b63b9e1b6ddafeb";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<User>(
          `http://localhost:3000/users/${ID_MOCKADO}`
        );
        if (response.data) {
          setUser(response.data);
        } else {
          setError("Nenhum usuário encontrado no backend.");
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          "Não foi possível carregar o usuário. Verifique se o backend está rodando."
        );
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      error,
    }),
    [user, loading, error]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
