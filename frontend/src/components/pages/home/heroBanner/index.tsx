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
    return gameShow && cart.some((item) => item.game.name === gameShow.name);
  };

  const gameExistInAccount = () => {
    return user?.gamesBought?.some((id) => id === gameShow?._id);
  };

  return (
    <Container>
      {(loading || !gameShow) && <HeroBannerSkeleton />}
      {!loading && gameShow && (
        <>
          <div className="flex flex-col items-center justify-start gap-3 my-5 sm:flex-row sm:gap-5">
            <div className="p-2 text-white flex bg-[#2d2d2d] rounded-[14px] items-center justify-center gap-2 text-[14px] w-full sm:w-auto">
              <CiSearch className="text-white text-[16px] ml-1" />
              <input
                type="text"
                placeholder="Buscar na loja"
                className="rounded-[12px] bg-transparent outline-none pl-1 w-full"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-3 sm:gap-5 sm:mt-0">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className="text-sm text-gray-300 transition-all hover:text-white sm:text-base"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between w-full gap-6 lg:flex-row lg:items-start">
            <div className="w-full overflow-hidden lg:w-4/5">
              <motion.div
                variants={gameBannerVariants}
                key={gameShow?._id}
                initial="hidden"
                animate={exitAnimate ? "exit" : "visible"}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                  stiffness: 1000,
                }}
                className="
                  min-h-[400px] md:min-h-[500px] lg:min-h-[750px] 
                  rounded-[14px] flex items-start justify-end gap-2 sm:gap-4 flex-col 
                  p-4 sm:p-6 md:p-10 shadow-inner bg-[#2d2d2d] text-white 
                  transition-all hover:shadow-2xl heroBanner relative
                "
                style={{
                  backgroundImage: `url(${gameShow?.cover})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent rounded-[14px]"></div>

                <motion.img
                  variants={GameTitleVariants}
                  key={gameShow?._id}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.4,
                  }}
                  src={gameShow?.banner}
                  alt={gameShow?.name}
                  className="w-[180px] sm:w-[220px] md:w-[280px] z-10"
                />
                <p className="max-w-full sm:max-w-[80%] md:max-w-[350px] text-lg sm:text-xl md:text-2xl font-bold z-10">
                  {gameShow?.name}
                </p>
                <p className="max-w-full sm:max-w-[80%] md:max-w-[350px] text-sm sm:text-base md:text-lg z-10">
                  {gameShow?.description}
                </p>
                <p className="text-white rounded-[8px] text-base sm:text-lg z-10">
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
                    className="z-10 px-4 py-2 text-sm transition-all sm:text-base"
                    style="tertiary"
                  />
                ) : (
                  <Button
                    onClick={() => navigation("/profile")}
                    label={"Ver na biblioteca"}
                    className="z-10 px-4 py-2 text-sm transition-all sm:text-base"
                    style="tertiary"
                  />
                )}
              </motion.div>
            </div>

            <div
              className="
              w-full lg:w-1/5 flex 
              flex-row lg:flex-col 
              min-h-[200px] lg:min-h-[750px] 
              overflow-x-auto lg:overflow-x-visible 
              pb-4 lg:pb-0 
              gap-3 lg:gap-0 
              justify-start lg:justify-between 
              items-start lg:items-center
              no-scrollbar
              p-2 lg:p-0
            "
            >
              {games.slice(0, 6).map((game) => (
                <div
                  onClick={() => handleGameClick(game)}
                  key={game._id}
                  className={classNames(
                    "w-[120px] sm:w-[150px] lg:w-full flex-shrink-0 lg:flex-shrink p-2 sm:px-4 sm:py-2 lg:px-8 lg:py-4 rounded-[8px] min-h-[80px] lg:min-h-[100px] flex items-center justify-between flex-row gap-2 hover:bg-[#292929] transition-all cursor-pointer",
                    gameShow?.name === game.name && "bg-[#292929]"
                  )}
                >
                  <img
                    src={game.banner}
                    alt={game.name}
                    className="w-1/3 lg:w-1/4 rounded-[4px] lg:rounded-[8px] object-cover"
                  />
                  <p className="w-2/3 text-xs text-center text-white sm:text-sm lg:text-base">
                    {game.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
