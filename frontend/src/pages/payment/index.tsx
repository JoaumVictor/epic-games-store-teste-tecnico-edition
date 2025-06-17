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
import { Link } from "react-router-dom";
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
  const { state, totalPriceInCart, dispatch } = useCart();

  const [allCreditCards, setAllCreditCards] = useState<creditCardsProps[]>([]);

  const [selectedCard, setSelectedCard] = useState<creditCardsProps>(
    allCreditCards[0]
  );

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    "" as selectedPaymentMethodType
  );

  const { creditCards } = useCreditCard();

  useEffect(() => {
    setSelectedCard(creditCards[0]);
    setAllCreditCards(creditCards);
    if (creditCards.length === 0) {
      setSelectedPaymentMethod("creditCard");
    }
  }, [creditCards]);

  const handleSelectCard = (selected: creditCardsProps) => {
    setSelectedCard(selected);
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
      return true;
    } else {
      return false;
    }
  };

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="bg-white h-[100vh]">
      <Container className="px-10">
        <div className="flex items-start justify-center w-full gap-10">
          <div className="flex flex-col items-start justify-start w-7/12 gap-3 pt-10">
            <p className="mb-6 text-2xl text-black">Finalizar compra</p>
            <div className="bg-[#5069cf] w-full h-[4px] my-6" />
            {allCreditCards.length > 0 && (
              <>
                <div className="w-full">
                  <p className="my-4 text-xl text-black">
                    Selecione um cartão de crédito
                  </p>
                  <CreditCardDropdown
                    creditCards={allCreditCards}
                    selectedCard={selectedCard}
                    onSelectCard={handleSelectCard}
                    selectedPaymentMethod={selectedPaymentMethod}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                  />
                </div>
                <div className="bg-[#5069cf] w-full h-[4px] my-6" />
              </>
            )}
            <p className="my-4 text-xl text-black">
              Outros métodos de pagamento
            </p>
            {paymentMethods.map((method) => (
              <div
                onClick={() => setSelectedPaymentMethod(method.paymentMethod)}
                className={classNames(
                  "flex items-start flex-col justify-center cursor-pointer w-full gap-3 bg-[#efefef] hover:bg-[#dddddd] transition-all rounded-[8px] min-h-[100px] p-10",
                  selectedPaymentMethod === method.paymentMethod &&
                    "border-[#6da2ff] border"
                )}
              >
                <div className="flex items-center justify-start gap-3">
                  {selectedPaymentMethod === method.paymentMethod ? (
                    <FaCheckCircle className="!text-[#63aafb] text-[24px]" />
                  ) : (
                    <FaRegCircle className="!text-black text-[24px]" />
                  )}
                  {method.icon}
                  <p className="text-black">{method.label}</p>
                </div>

                <div className="flex flex-col items-center justify-start gap-3">
                  {selectedPaymentMethod === method.paymentMethod && (
                    <div className="flex flex-col items-start justify-center w-full">
                      <p className="text-[#5f5f5f] text-[14px] ml-9 mb-4">
                        Você será direcionado ao seu prestador de serviço de
                        pagamento para finalizar a compra.
                      </p>
                      {selectedPaymentMethod === "creditCard" && (
                        <p className="text-[#5f5f5f] text-[16px] ml-9 mb-4">
                          <span className="text-red-600 ">*</span> Esse método
                          de pagamento será salvo para futuras compras
                        </p>
                      )}
                      <p className="text-[#565656] text-[12px] ml-9">
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
            <div className="bg-[#5069cf] w-full h-[4px] my-6" />
          </div>
          <div className="flex relative bg-[#f4f4f4] flex-col px-10 h-[100vh] items-end justify-start w-3/12 gap-3 pt-10">
            <Link to="/checkout">
              <IoCloseOutline className="!text-black text-[30px] absolute top-3 right-3" />
            </Link>
            <p className="mb-10 text-2xl text-black text-end">
              Resumo do pedido
            </p>
            <div
              className={classNames(
                "w-full mb-10 flex items-start justify-center gap-5 flex-col max-h-[450px] overflow-x-hidden py-10 pr-3",
                state.cart.length <= 3 ? "overflow-y-auto" : "overflow-y-hidden"
              )}
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#272727 transparent",
              }}
            >
              {state.cart.map(({ game }) => (
                <div className="flex items-center justify-between w-full">
                  <img
                    src={game.banner}
                    alt={game.name}
                    className="w-[60px] rounded-[8px]"
                  />
                  <div className="flex flex-col items-center justify-center w-1/2 gap-3">
                    <p className="text-[#4c4c4c] font-bold text-end w-full">
                      {game.name}
                    </p>
                    <p className="text-[#8e8e8e] text-end w-full">
                      {formatterCurrency(Number(game.price))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-black">Total de itens:</p>
              <p className="text-black">{state.cart.length}</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-black">Desconto</p>
              <p className="text-black">-R$ 0,00</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-black">Preço: </p>
              <span className="text-black">
                {formatterCurrency(totalPriceInCart(state.cart))}
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="my-6 text-black">Subtotal: </p>
              <span className="text-[22px] text-black">
                {formatterCurrency(totalPriceInCart(state.cart))}
              </span>
            </div>
            {(selectedPaymentMethod === "pix" ||
              selectedPaymentMethod === "boleto" ||
              selectedPaymentMethod === "paypal") && (
              <p className="text-center text-red-400">
                Desculpe, esse método de pagamento não está disponível
              </p>
            )}
            <div className="w-full">
              <Button
                style="finally"
                className="!w-full"
                disabled={state.cart.length === 0 || !finallyButtonDisabled()}
                onClick={() => setModalOpen(true)}
                label="Fazer pedido"
              />
            </div>
          </div>
        </div>
        <PaymentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          paymentMethod={selectedPaymentMethod}
          selectedCard={selectedCard}
          value={totalPriceInCart(state.cart)}
        />
      </Container>
    </main>
  );
}
