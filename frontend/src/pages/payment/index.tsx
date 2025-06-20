/* eslint-disable react/style-prop-object */
import CheckoutHeader from "@/components/layout/headers/checkoutHeader";
import { useCart } from "@/context/cart";
import { useEffect, useState } from "react";
import { classNames, formatterCurrency } from "@/utils/shared";
import Button from "@/components/ui/button";
import CreditCardDropdown, {
  creditCardsProps,
} from "@/components/pages/payment/creditCardDropdown";
import { useCreditCard } from "@/context/creditCard";
import { AiOutlineBarcode } from "react-icons/ai";
import {
  FaCcPaypal,
  FaCreditCard,
  FaCheckCircle,
  FaRegCircle,
} from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import PaymentModal from "@/components/shared/modals/paymentModal";
import Container from "@/components/ui/container";

type selectedPaymentMethodType =
  | "pix"
  | "creditCard"
  | "boleto"
  | "paypal"
  | "userCreditCard";

interface paymentMethodProps {
  paymentMethod: selectedPaymentMethodType;
  label: string;
  icon: JSX.Element;
}

export default function Payment() {
  const { cart, totalPriceInCart } = useCart();
  const navigation = useNavigate();

  const [allCreditCards, setAllCreditCards] = useState<creditCardsProps[]>([]);

  const [selectedCard, setSelectedCard] = useState<creditCardsProps>();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<selectedPaymentMethodType>();

  const { creditCards } = useCreditCard();

  useEffect(() => {
    setSelectedCard(creditCards[0]);
    setAllCreditCards(creditCards);
    if (creditCards.length === 0) {
      setSelectedPaymentMethod("creditCard");
    } else {
      setSelectedPaymentMethod("userCreditCard"); // Define como padrão se houver cartões salvos
    }
  }, [creditCards]);

  useEffect(() => {
    if (cart.length === 0) {
      navigation("/profile");
    }
  }, [cart, navigation]); // Adicionar cart e navigation como dependências

  const handleSelectCard = (selected: creditCardsProps) => {
    setSelectedCard(selected);
    setSelectedPaymentMethod("userCreditCard"); // Garante que o método seja atualizado ao selecionar um cartão salvo
  };

  const paymentMethods: paymentMethodProps[] = [
    {
      paymentMethod: "pix",
      label: "Pix",
      icon: <FaPix className="text-black text-[24px]" />,
    },
    {
      paymentMethod: "creditCard",
      label: "Cartão de crédito",
      icon: <FaCreditCard className="text-black text-[24px]" />,
    },
    {
      paymentMethod: "boleto",
      label: "Boleto",
      icon: <AiOutlineBarcode className="text-black text-[24px]" />,
    },
    {
      paymentMethod: "paypal",
      label: "Paypal",
      icon: <FaCcPaypal className="text-black text-[24px]" />,
    },
  ];

  const finallyButtonDisabled = () => {
    if (
      selectedPaymentMethod === "creditCard" ||
      selectedPaymentMethod === "userCreditCard"
    ) {
      return true; // Retorna true se o método de pagamento selecionado for cartão de crédito ou cartão salvo
    } else {
      return false; // Retorna false para outros métodos (Pix, Boleto, Paypal)
    }
  };

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen text-gray-800 bg-white">
      <CheckoutHeader />
      <Container className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="flex flex-col items-start justify-center w-full gap-8 lg:flex-row lg:gap-10">
          <div className="flex flex-col items-start justify-start w-full gap-4 pt-4 lg:w-7/12 lg:pt-10">
            <p className="mb-4 text-2xl font-bold text-black sm:text-3xl">
              Finalizar compra
            </p>
            <div className="bg-[#5069cf] w-full h-[3px] sm:h-[4px] my-4 sm:my-6 rounded-full" />
            {allCreditCards.length > 0 && (
              <>
                <div className="w-full">
                  <p className="my-3 text-lg font-semibold text-black sm:text-xl">
                    Selecione um cartão de crédito
                  </p>
                  <CreditCardDropdown
                    creditCards={allCreditCards}
                    selectedCard={selectedCard}
                    onSelectCard={handleSelectCard}
                    selectedPaymentMethod={
                      selectedPaymentMethod || "userCreditCard"
                    }
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                  />
                </div>
                <div className="bg-[#5069cf] w-full h-[3px] sm:h-[4px] my-4 sm:my-6 rounded-full" />
              </>
            )}
            <p className="my-3 text-lg font-semibold text-black sm:text-xl">
              Outros métodos de pagamento
            </p>
            {paymentMethods.map((method) => (
              <div
                onClick={() => setSelectedPaymentMethod(method.paymentMethod)}
                key={method.paymentMethod}
                className={classNames(
                  "flex flex-col justify-center cursor-pointer w-full gap-2 sm:gap-3 bg-[#efefef] hover:bg-[#dddddd] transition-all rounded-lg min-h-[90px] p-4 sm:p-6 md:p-10",
                  selectedPaymentMethod === method.paymentMethod
                    ? "border-[#6da2ff] border-2"
                    : "border-transparent border"
                )}
              >
                <div className="flex items-center justify-start gap-2 sm:gap-3">
                  {selectedPaymentMethod === method.paymentMethod ? (
                    <FaCheckCircle className="text-[#63aafb] text-xl sm:text-2xl" />
                  ) : (
                    <FaRegCircle className="text-xl text-gray-600 sm:text-2xl" />
                  )}
                  {method.icon}
                  <p className="text-base font-medium text-gray-800 sm:text-lg">
                    {method.label}
                  </p>
                </div>

                <div className="flex flex-col items-start justify-start gap-2 pl-7 sm:pl-9">
                  {selectedPaymentMethod === method.paymentMethod && (
                    <div className="flex flex-col items-start justify-center w-full">
                      <p className="mb-2 text-xs text-gray-600 sm:text-sm">
                        Você será direcionado ao seu prestador de serviço de
                        pagamento para finalizar a compra.
                      </p>
                      {selectedPaymentMethod === "creditCard" && (
                        <p className="mb-2 text-sm text-gray-600">
                          <span className="text-red-600 mr-0.5">*</span> Esse
                          método de pagamento será salvo para futuras compras
                        </p>
                      )}
                      <p className="text-xs leading-tight text-gray-500">
                        Ao escolher salvar suas informações de pagamento, este
                        método de pagamento será selecionado como padrão para
                        todas as compras feitas usando o pagamento da Epic
                        Games, incluindo compras no Fortnite, Rocket League,
                        Fall Guys e na Epic Games Store. Você pode excluir suas
                        informações de pagamento salvas a qualquer momento nesta
                        tela de pagamento ou fazendo login na sua conta da Epic
                        Games e selecionando "Gerenciar pagamento" nas
                        configurações da conta.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="bg-[#5069cf] w-full h-[3px] sm:h-[4px] my-4 sm:my-6 rounded-full" />
          </div>

          <div className="flex relative bg-[#f4f4f4] flex-col px-4 sm:px-6 md:px-8 lg:px-10 py-6 lg:py-10 h-auto min-h-[400px] lg:h-[calc(100vh-100px)] lg:overflow-y-auto items-end justify-start w-full lg:w-5/12 gap-4 rounded-lg shadow-md">
            <Link
              to="/checkout"
              className="absolute top-3 right-3 sm:top-4 sm:right-4"
            >
              <IoCloseOutline className="text-2xl text-gray-700 transition-colors sm:text-3xl hover:text-gray-900" />
            </Link>
            <p className="w-full pt-6 mb-4 text-xl font-bold text-right text-black sm:text-2xl lg:text-xl sm:pt-8 lg:pt-0">
              Resumo do pedido
            </p>
            <div className="w-full mb-6 flex flex-col gap-3 max-h-[250px] sm:max-h-[350px] lg:max-h-[450px] overflow-y-auto no-scrollbar py-2">
              {cart.map(({ game }) => (
                <div
                  key={game._id}
                  className="flex items-center justify-between w-full pb-2 border-b border-gray-300 last:border-b-0 last:pb-0"
                >
                  <img
                    src={game.banner}
                    alt={game.name}
                    className="flex-shrink-0 object-contain w-16 h-16 mr-3 rounded-md sm:w-20 sm:h-20"
                  />
                  <div className="flex flex-col items-start justify-center flex-grow overflow-hidden">
                    <p className="overflow-hidden text-sm font-bold text-gray-800 sm:text-base whitespace-nowrap text-ellipsis">
                      {game.name}
                    </p>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      {formatterCurrency(Number(game.price))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col w-full gap-3 pt-4 border-t border-gray-300">
              <div className="flex items-center justify-between w-full text-sm text-gray-700 sm:text-base">
                <p className="text-black">Total de itens:</p>
                <p className="text-black">{cart.length}</p>
              </div>
              <div className="flex items-center justify-between w-full text-sm text-gray-700 sm:text-base">
                <p className="text-black">Desconto</p>
                <p className="text-black">-R$ 0,00</p>
              </div>
              <div className="flex items-center justify-between w-full text-sm text-gray-700 sm:text-base">
                <p className="text-black">Preço: </p>
                <span>{formatterCurrency(totalPriceInCart)}</span>
              </div>
              <div className="flex items-center justify-between w-full mt-4 text-lg font-bold sm:text-xl">
                <p className="text-black">Subtotal: </p>
                <span className="text-2xl text-black sm:text-3xl">
                  {formatterCurrency(totalPriceInCart)}
                </span>
              </div>
            </div>
            {(selectedPaymentMethod === "pix" ||
              selectedPaymentMethod === "boleto" ||
              selectedPaymentMethod === "paypal") && (
              <p className="w-full mt-4 text-sm text-center text-red-500">
                Desculpe, esse método de pagamento não está disponível.
              </p>
            )}
            <div className="w-full mt-6">
              <Button
                style="finally"
                className="w-full py-3 text-base sm:text-lg"
                disabled={
                  cart.length === 0 ||
                  !finallyButtonDisabled() ||
                  !selectedPaymentMethod
                } // Adicionado !selectedPaymentMethod
                onClick={() => setModalOpen(true)}
                label="Fazer pedido"
              />
            </div>
          </div>
        </div>
        <PaymentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          paymentMethod={selectedPaymentMethod as selectedPaymentMethodType}
          selectedCard={selectedCard}
          value={totalPriceInCart}
        />
      </Container>
    </main>
  );
}
