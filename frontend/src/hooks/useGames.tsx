import { useContext } from "react";
import { GamesContext } from "../context/gamesContext/index";

const useGames = () => {
  const context = useContext(GamesContext);

  if (!context) {
    throw new Error("useGames must be used within a GamesProvider");
  }

  return context;
};

export default useGames;
