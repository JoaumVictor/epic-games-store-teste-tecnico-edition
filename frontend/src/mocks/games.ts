export interface gameProps {
  name: string;
  titleImage: string;
  status: string;
  price: number | "free";
  description: string;
  cover: string;
  banner: string;
}

const games: gameProps[] = [
  {
    name: "Skull and Bones",
    titleImage:
      "https://cdn2.unrealengine.com/egs-skull-and-bones-carousel-logo-350x100-3f35fb158981.png",
    price: 24999,
    status: "Já disponível",
    description:
      "Entre no perigoso mundo de Skull and Bones, uma experiência cooperativa de RPG de ação de piratas num mundo aberto.",
    cover:
      "https://cdn2.unrealengine.com/egs-skull-and-bones-carousel-desktop-1248x702-8814fa009b18.jpg?h=720&quality=medium&resize=1&w=1280",
    banner:
      "https://cdn2.unrealengine.com/egs-skull-and-bones-carousel-thumb-1200x1600-eb9d60ded5a8.jpg?h=128&quality=high&resize=1&w=360",
  },
  {
    name: "Honkai Star Rail",
    titleImage:
      "https://cdn2.unrealengine.com/egs-honkai-star-rail-1-3-carousel-logo-en-1340x660-a99349a7bcf4.png",
    price: "free",
    status: "Já disponível",
    description:
      "Honkai: Star Rail é um novo RPG de fantasia espacial da HoYoverse. Suba no Expresso Astral e vivencie as infinitas maravilhas da galáxia.",
    cover:
      "https://cdn2.unrealengine.com/egs-honkai-star-rail-version-2-0-carousel-desktop-2560x1440-d3b790cf05dd.jpg?h=720&quality=medium&resize=1&w=1280",
    banner:
      "https://cdn2.unrealengine.com/en-honkai-star-rail-version-2-0-carousel-thumb-1200x1600-442b2b27643b.jpg?h=128&quality=medium&resize=1&w=360",
  },
  {
    name: "Prince Of Persia: The Sands Of Time Remake",
    titleImage:
      "https://cdn2.unrealengine.com/egs-prince-of-persia-lost-crown-carousel-logo-252x80-c3b63b9442da.png",
    price: 24999,
    status: "Disponível 3 de março",

    description:
      "Viaje para um empolgante jogo de plataforma de aventura e ação no mundo mitológico persa.",
    cover:
      "https://cdn2.unrealengine.com/egs-prince-of-persia-lost-crown-carousel-desktop-1920x1080-c7ae57efc8ab.jpg?h=720&quality=medium&resize=1&w=1280",
    banner:
      "https://cdn2.unrealengine.com/egs-prince-of-persia-lost-crown-carousel-thumb-1200x1600-f1da6429caec.jpg?h=128&quality=medium&resize=1&w=360",
  },
  {
    name: "Fortnite",
    price: "free",
    titleImage: "https://pngimg.com/d/fortnite_PNG136.png",
    status: "Já disponível",
    description:
      "Explore vastos mundos abertos onde a magia da construção LEGO encontra o Fortnite.",
    cover:
      "https://cdn1.epicgames.com/offer/fn/FNJN_01_EGS_Launcher_Blade_2560x1440_2560x1440-9b2da247e66cc11c447d59784923efbd?h=480&quality=medium&resize=1&w=1280",
    banner:
      "https://cdn1.epicgames.com/offer/fn/Blade_1200x1600_1200x1600-fcea56f5eb92df731a89121e2b4416b5?h=480&quality=medium&resize=1&w=360",
  },
  {
    name: "Homeworld 3",
    titleImage:
      "https://cdn2.unrealengine.com/egs-homeworld-3-logo-3840x2160-f528e2d9421b.png",
    price: 22999,
    status: "Já disponível",

    description:
      "Tático, belo e incomparável, o RTS de ficção científica e ganhador do prêmio GOTY retorna com Homeworld 3.",
    cover:
      "https://cdn2.unrealengine.com/egs-homewrold-3-carousel-desktop-1920x1080-0ba8d22503a4.jpg?h=720&quality=medium&resize=1&w=1280",
    banner:
      "https://cdn2.unrealengine.com/egs-homeworld-3-epic-thumb-1200x1600-1200x1600-ac4f7a4b136c.jpg?h=128&quality=medium&resize=1&w=360",
  },
  {
    name: "Rocket League",
    price: "free",
    titleImage: "https://www.dafont.com/forum/attach/orig/5/1/517500.png",
    status: "Já disponível",
    description:
      "Rocket League é um jogo de futebol de carros híbrido com física de jogo intensa e fácil de entender.",
    cover:
      "https://cdn2.unrealengine.com/egs-rocket-league-mazda-rx-7-breaker-1920x1080-7ba959ae1a0f.jpg?h=480&quality=medium&resize=1&w=854",
    banner:
      "https://cdn1.epicgames.com/offer/9773aa1aa54f4f7b80e44bef04986cea/EGS_RocketLeague_PsyonixLLC_S2_1200x1600-eeed32ae8de826070bdad6ab622d0018?h=480&quality=medium&resize=1&w=360",
  },
];

export default games;
