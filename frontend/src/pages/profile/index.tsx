import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "@/components/ui/container";
import useUser from "@/hooks/useUser";
import { formatterCurrency } from "@/utils/shared";
import Header from "@/components/layout/headers/header";

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
        <div className="flex items-center justify-center flex-grow">
          <p className="text-lg">Carregando perfil e transações...</p>
        </div>
      </main>
    );
  }

  if (userError || !user) {
    return (
      <main className="min-h-screen flex flex-col bg-[#121212] text-white">
        <Header />
        <div className="flex items-center justify-center flex-grow">
          <p className="text-lg text-red-500">
            Erro ao carregar usuário: {userError || "Usuário não encontrado."}
          </p>
        </div>
      </main>
    );
  }

  if (transactionsError) {
    return (
      <main className="min-h-screen flex flex-col bg-[#121212] text-white">
        <Header />
        <div className="flex items-center justify-center flex-grow">
          <p className="text-lg text-red-500">
            Erro ao carregar transações: {transactionsError}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#121212] min-h-[100vh] text-white">
      <Header />
      <Container className="px-10 py-10">
        <div className="flex items-start justify-center w-full gap-10">
          <div className="relative flex flex-col items-start justify-start w-7/12 gap-3 pt-10">
            <h2 className="mb-6 text-2xl text-white">Meu Perfil</h2>

            <img
              src="https://i.pinimg.com/736x/c1/6b/20/c16b20763f42593e20c90f4b024a5bbf.jpg"
              alt="joel the last of us"
              className="absolute object-cover w-40 h-40 mb-6 rounded-full shadow-md top-10 right-10"
            />

            <div className="flex flex-col items-start justify-start w-full gap-2 text-lg text-white">
              <p>
                <strong>Nome de Usuário:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>ID de Usuário:</strong> {user._id}{" "}
              </p>
              <p>
                <strong>Papel:</strong> {user.role || "Não definido"}
              </p>
              <p>
                <strong>Membro desde:</strong>{" "}
                {getFormattedDate(user.createdAt)}
              </p>
            </div>

            <div className="bg-[#5069cf] w-full h-[4px] my-6" />

            <h2 className="mt-6 mb-6 text-2xl text-white">Minhas Transações</h2>

            {userTransactions.length === 0 ? (
              <p className="text-white">
                Nenhuma transação encontrada para este usuário.
              </p>
            ) : (
              <div className="flex flex-col items-start justify-start w-full gap-5">
                {userTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="w-full p-6 rounded-lg shadow-sm bg-[#2d2d2d] text-white"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-200">
                        Jogo: {transaction.game?.name || "N/A"}
                      </p>
                      <span className="font-bold text-green-400">
                        {formatterCurrency(transaction.amount)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Data: {getFormattedDate(transaction.transactionDate)}
                    </p>
                    {transaction?.discountApplied &&
                      transaction?.discountApplied > 0 && (
                        <p className="text-sm text-gray-400">
                          Desconto Aplicado: {transaction.discountApplied}%
                        </p>
                      )}
                    <p className="mt-2 text-xs text-gray-500">
                      Transação ID: {transaction._id}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex relative bg-[#1c1c1c] flex-col min-h-[80vh] items-end justify-start w-3/12 gap-3 p-6 z-0">
            <h2 className="w-full text-xl text-white text-end">
              Minhas Conquistas
            </h2>
            <div className="bg-[#5069cf] w-full h-[2px] my-4" />
            <div className="flex flex-col w-full gap-4 pr-2 overflow-y-auto">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start gap-3 bg-[#2d2d2d] p-3 rounded-lg shadow-sm"
                >
                  <img
                    src={achievement.imageUrl}
                    alt={achievement.name}
                    className="flex-shrink-0 object-cover w-16 h-16 rounded-full shadow-md"
                  />
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold text-white">
                      {achievement.name}
                    </p>
                    <p className="text-sm text-gray-400">
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
