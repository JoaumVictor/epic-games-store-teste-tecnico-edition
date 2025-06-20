import "./style.scss";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { motion } from "framer-motion";
import { classNames, formatterCurrency } from "@/utils/shared";
import Button from "@/components/ui/button";
import { useCart } from "@/context/cart";
import useGames from "@/hooks/useGames";
import { Game } from "@/api/dto/games";
import Container from "../../../ui/container";
import HeroBannerSkeleton from "@/components/shared/skeletons/heroBanner";
import useUser from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const { games, loading } = useGames();
  const { dispatch, cart } = useCart();
  const { user } = useUser();
  const navigation = useNavigate();

  useEffect(() => {
    if (games.length > 0) {
      setGameShow(games[0]);
    }
  }, [games]);

  const [gameShow, setGameShow] = useState<Game>();
  const [exitAnimate, setExitAnimate] = useState(false);

  const tags = ["Descobrir", "Navegar", "Novidades"];

  const handleGameClick = (game: Game) => {
    setExitAnimate(true);
    setTimeout(() => {
      setGameShow(game);
      setExitAnimate(false);
    }, 150);
  };

  const handleAddGameToCart = (game: Game) => {
    dispatch({ type: "ADD_TO_CART", payload: game });
  };

  const gameBannerVariants = {
    hidden: { x: "4%", opacity: 0.2 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-8%", opacity: 0.4 },
  };

  const GameTitleVariants = {
    hidden: { x: "5%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-10%", opacity: 0.4 },
  };

  const gameExistInCart = () => {
    return cart.some((game) => game.game.name === gameShow?.name);
  };

  const gameExistInAccount = () => {
    return user?.gamesBought?.some((id) => id === gameShow?._id);
  };

  return (
    <Container>
      <div className="flex items-center justify-start gap-5 my-5">
        <div className="p-2 text-white flex bg-[#2d2d2d] rounded-[14px] items-center justify-center gap-2 text-[14px]">
          <CiSearch className="text-white text-[16px] ml-1" />
          <input
            type="text"
            placeholder="Buscar na loja"
            className="rounded-[12px] bg-transparent outline-none pl-1"
          />
        </div>
        {tags.map((tag) => (
          <button
            key={tag}
            className="text-gray-300 transition-all hover:text-white"
          >
            {tag}
          </button>
        ))}
      </div>
      {loading && <HeroBannerSkeleton />}
      {loading === false && gameShow && (
        <div className="flex items-center justify-between w-full gap-3">
          <div className="w-4/5 overflow-hidden">
            <motion.div
              variants={gameBannerVariants}
              key={gameShow?.name}
              initial="hidden"
              animate={exitAnimate ? "exit" : "visible"}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
                stiffness: 1000,
              }}
              className="min-h-[750px] rounded-[14px] flex items-start justify-end gap-4 flex-col p-10 shadow-inner bg-[#2d2d2d] text-white transition-all hover:shadow-2xl heroBanner"
              style={{
                backgroundImage: `url(${gameShow?.cover})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <motion.img
                variants={GameTitleVariants}
                key={gameShow?.name}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
                src={gameShow?.banner}
                alt={gameShow?.name}
                className="w-[280px] z-10"
              />
              <p className="max-w-[350px] text-[16px] z-10">{gameShow?.name}</p>
              <p className="max-w-[350px] text-[20px] z-10">
                {gameShow?.description}
              </p>
              <p className=" text-white rounded-[8px] z-10">
                A partir de {formatterCurrency(gameShow?.price ?? 100)}
              </p>
              {!gameExistInAccount() ? (
                <Button
                  onClick={() => handleAddGameToCart(gameShow)}
                  disabled={gameExistInCart()}
                  label={
                    gameExistInCart()
                      ? "Já adicionado"
                      : "Adicionar ao carrinho"
                  }
                  className="z-10 transition-all"
                  style="tertiary"
                />
              ) : (
                <Button
                  onClick={() => navigation("/profile")}
                  label={"Ver na biblioteca"}
                  className="z-10 transition-all"
                  style="tertiary"
                />
              )}
            </motion.div>
          </div>
          <div className="w-1/5 flex items-center justify-between flex-col min-h-[750px]">
            {games.slice(0, 6).map((game) => (
              <div
                onClick={() => handleGameClick(game)}
                key={game._id}
                className={classNames(
                  "w-full cursor-pointer px-8 py-4 rounded-[8px] min-h-[100px] flex items-center justify-between flex-row gap-2 hover:bg-[#292929] transition-all",
                  gameShow?.name === game.name && "bg-[#292929]"
                )}
              >
                <img
                  src={game.banner}
                  alt={game.name}
                  className="w-1/4 rounded-[8px]"
                />
                <p className="w-2/3 text-center text-white">{game.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
