import React, { createContext, useState, useEffect, useMemo } from "react";
import { Game } from "@/types/games";
import api from "@/api";

interface GamesContextValue {
  games: Game[];
  loading: boolean;
  error: string | null;
}

export const GamesContext = createContext<GamesContextValue | undefined>(
  undefined
);

export const GamesProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<Game[]>("http://localhost:3000/games");
        setGames(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar jogos:", err);
        setError(
          "Não foi possível carregar os jogos. Tente novamente mais tarde."
        );
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const contextValue = useMemo(
    () => ({
      games,
      loading,
      error,
    }),
    [games, loading, error]
  );

  return (
    <GamesContext.Provider value={contextValue}>
      {children}
    </GamesContext.Provider>
  );
};
