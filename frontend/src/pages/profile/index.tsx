import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "@/components/ui/container";
import useUser from "@/hooks/useUser";
import { formatterCurrency } from "@/utils/shared";
import Header from "@/components/layout/headers/header";

interface Game {
  _id: string;
  name: string;
  banner: string;
  cover: string;
  price: number;
}

interface Transaction {
  _id: string;
  game: Game;
  user: string;
  amount: number;
  discountApplied?: number;
  transactionDate: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export default function Profile() {
  const { user, loading: userLoading, error: userError } = useUser();
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchUserTransactions = async () => {
      if (!user?._id) {
        setTransactionsLoading(false);
        return;
      }

      try {
        setTransactionsLoading(true);
        setTransactionsError(null);
        const response = await axios.get<Transaction[]>(
          `http://localhost:3000/transactions/user/${user._id}`
        );
        setUserTransactions(response.data);
        setTransactionsLoading(false);
      } catch (err) {
        console.error("Erro ao buscar transações do usuário:", err);
        setTransactionsError(
          "Não foi possível carregar as transações. Tente novamente mais tarde."
        );
        setTransactionsLoading(false);
      }
    };

    if (!userLoading) {
      fetchUserTransactions();
    }
  }, [user, userLoading]);

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const achievements: Achievement[] = [
    {
      id: "1",
      name: "Deus da Guerra",
      description: "Conclua a história principal de God of War (2018).",
      imageUrl:
        "https://cdn.fastly.steamstatic.com/steamcommunity/public/images/apps/1593500/7a2be6b8ab7c6894970e3addca5b6e32c109f121.jpg",
    },
    {
      id: "2",
      name: "O Vingador Aracnídeo",
      description: "Desbloqueie todas as habilidades em Marvel's Spider-Man.",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfCkUkG-oQsZJL8cWs83J_dnR1gdDDQhqLQgUv7DeNdHHGv2RuiUSsvppDfmLniOV3eEc&usqp=CAU",
    },
    {
      id: "3",
      name: "Sobrevivente Definitivo",
      description:
        "Sobreviva por um ano no Modo Sobrevivência de The Last of Us.",
      imageUrl:
        "https://i.pinimg.com/736x/7e/2a/bd/7e2abd9e6342b2dfe3ab905cf1d6b9ef.jpg",
    },
  ];

  if (userLoading || transactionsLoading) {
    return (
      <main className="min-h-screen flex flex-col bg-[#121212] text-white">
        <Header />
        <div className="flex items-center justify-center flex-grow p-4">
          <p className="text-base text-center sm:text-lg">
            Carregando perfil e transações...
          </p>
        </div>
      </main>
    );
  }

  if (userError || !user) {
    return (
      <main className="min-h-screen flex flex-col bg-[#121212] text-white">
        <Header />
        <div className="flex items-center justify-center flex-grow p-4">
          <p className="text-base text-center text-red-500 sm:text-lg">
            Erro ao carregar usuário, verifique se seu ID MOCKADO no contexto do
            user está CORRETO.
          </p>
        </div>
      </main>
    );
  }

  if (transactionsError) {
    return (
      <main className="min-h-screen flex flex-col bg-[#121212] text-white">
        <Header />
        <div className="flex items-center justify-center flex-grow p-4">
          <p className="text-base text-center text-red-500 sm:text-lg">
            Erro ao carregar transações: {transactionsError}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#121212] min-h-screen text-white">
      <Header />
      <Container className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-10">
        <div className="flex flex-col items-start justify-center w-full gap-8 lg:flex-row lg:gap-10">
          <div className="relative flex flex-col items-start justify-start w-full gap-4 pt-4 lg:w-7/12 xl:w-2/3">
            <h2 className="mb-4 text-xl font-bold sm:text-2xl">Meu Perfil</h2>

            <div className="relative flex flex-col items-center w-full gap-4 sm:flex-row sm:items-start sm:gap-6">
              <img
                src="https://i.pinimg.com/736x/c1/6b/20/c16b20763f42593e20c90f4b024a5bbf.jpg"
                alt="Avatar do usuário"
                className="flex-shrink-0 object-cover w-24 h-24 rounded-full shadow-md sm:w-32 sm:h-32"
              />
              <div className="flex flex-col items-start justify-start w-full gap-1 text-base text-white sm:text-lg">
                <p>
                  <strong>Nome de Usuário:</strong> {user.username}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>ID de Usuário:</strong> {user._id}
                </p>
                <p>
                  <strong>Papel:</strong> {user.role || "Não definido"}
                </p>
                <p>
                  <strong>Membro desde:</strong>{" "}
                  {getFormattedDate(user.createdAt)}
                </p>
              </div>
            </div>

            <div className="bg-[#5069cf] w-full h-[2px] sm:h-[3px] my-4 rounded-full" />

            <h2 className="mt-4 mb-4 text-xl font-bold sm:text-2xl">
              Minhas Transações
            </h2>

            {userTransactions.length === 0 ? (
              <p className="text-base text-gray-300 sm:text-lg">
                Nenhuma transação encontrada para este usuário.
              </p>
            ) : (
              <div className="flex flex-col items-start justify-start w-full gap-4 max-h-[1000px] overflow-y-hidden pr-2 no-scrollbar">
                {userTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="w-full p-4 sm:p-6 rounded-lg shadow-sm bg-[#2d2d2d] text-white border border-[#2d2d2d] hover:border-[#5069cf] transition-all duration-200"
                  >
                    <div className="flex flex-col items-start justify-between mb-2 sm:flex-row sm:items-center">
                      <p className="mb-1 text-base font-semibold text-gray-200 sm:text-lg sm:mb-0">
                        Jogo: {transaction.game?.name || "N/A"}
                      </p>
                      <span className="text-base font-bold text-green-400 sm:text-lg">
                        {formatterCurrency(transaction.amount)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 sm:text-sm">
                      Data: {getFormattedDate(transaction.transactionDate)}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      Transação ID: {transaction._id}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col min-h-[400px] lg:min-h-[80vh] items-start justify-start w-full lg:w-5/12 xl:w-1/3 gap-4 p-4 sm:p-6 bg-[#1c1c1c] rounded-lg shadow-md">
            <h2 className="w-full pb-6 text-xl font-bold text-center border-b border-gray-700 sm:text-2xl lg:text-right">
              Minhas Conquistas
            </h2>
            <div className="flex flex-col w-full gap-4 pr-2 overflow-y-auto no-scrollbar">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start gap-3 bg-[#2d2d2d] p-3 rounded-lg shadow-sm border border-[#2d2d2d] hover:border-[#5069cf] transition-all duration-200"
                >
                  <img
                    src={achievement.imageUrl}
                    alt={achievement.name}
                    className="flex-shrink-0 object-cover w-16 h-16 rounded-full shadow-md"
                  />
                  <div className="flex flex-col">
                    <p className="text-base font-semibold text-white sm:text-lg">
                      {achievement.name}
                    </p>
                    <p className="text-xs text-gray-400 sm:text-sm">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
