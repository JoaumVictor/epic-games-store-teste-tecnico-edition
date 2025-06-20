import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "@/components/ui/button";
import { formatterCurrency, isLuhnValid } from "@/utils/shared";
import { IoCloseOutline } from "react-icons/io5";
import Input from "@/components/ui/customInput"; // Ajustado para customInput
import { useFormik } from "formik";
import * as Yup from "yup";
import { creditCardsProps } from "@/components/pages/payment/creditCardDropdown";
import { FaCreditCard } from "react-icons/fa";
import { useCart } from "@/context/cart";
import useUser from "@/hooks/useUser";
import api from "@/api";
import { useNavigate } from "react-router-dom";

// Tipagem para o Game, conforme fornecido
export interface Game {
  _id: string;
  name: string;
  description: string;
  cover: string;
  banner: string;
  price: number;
  discount?: number;
  genre?: string[];
  releaseDate?: string;
  developer?: string;
  publisher?: string;
  platforms?: string[];
  rating?: number;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Estendendo a tipagem do item do carrinho para incluir a interface Game
interface CartItem {
  game: Game; // Assumindo que cada item do carrinho tem uma propriedade 'game' do tipo Game
  quantity: number; // Exemplo: se houver quantidade
  _id: string; // ID do item do carrinho (não do jogo)
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: selectedPaymentMethodType;
  selectedCard?: creditCardsProps;
  value: number;
}

type selectedPaymentMethodType =
  | "pix"
  | "creditCard"
  | "boleto"
  | "paypal"
  | "userCreditCard";

interface handleNewCreditCardPaymentProps {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  cardholderName: string;
}

const PaymentModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  paymentMethod,
  selectedCard,
  value,
}) => {
  // Tipagem do cart para usar CartItem
  const { cart, dispatch } = useCart();
  const { user, fetchUser } = useUser();
  const navigation = useNavigate();

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  // Novo estado para a mensagem de sucesso ou erro do pagamento
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<
    string | null
  >(null);

  const validationSchema = Yup.object({
    cardNumber: Yup.string()
      .required("Número do cartão é obrigatório")
      .length(16, "Número do cartão deve conter exatamente 16 dígitos")
      .transform((value) => value.replace(/\s/g, "").replace(/-/g, ""))
      .matches(/^[0-9]+$/, "Número do cartão inválido, use apenas números")
      .test("luhnCheck", "Número do cartão inválido", (value) =>
        isLuhnValid(value.replace(/\s/g, ""))
      ),
    expirationDate: Yup.string()
      .required("Data de validade é obrigatória")
      .matches(/^(0[1-9]|1[0-2])\d{2}$/, "Data inválida. Formato aceito: MM/AA")
      .test("isValidDate", "Data inválida ou expirada", (value) => {
        const current = new Date();
        const month = parseInt(value.slice(0, 2), 10);
        const year = parseInt(`20${value.slice(2)}`, 10);
        return (
          year > current.getFullYear() ||
          (year === current.getFullYear() && month >= current.getMonth() + 1)
        );
      }),
    cvv: Yup.string()
      .required("CVV é obrigatório")
      .matches(/^\d{3,4}$/, "CVV inválido"),
    cardholderName: Yup.string()
      .required("Nome do titular é obrigatório")
      .min(3, "Mínimo 3 caracteres")
      .max(35, "Máximo 35 caracteres")
      .matches(
        /^[a-zA-Z\u00C0-\u017F\s]+$/,
        "Sem números ou caracteres especiais"
      ),
  });

  const formik = useFormik({
    initialValues: {
      cardNumber: "",
      expirationDate: "",
      cvv: "",
      cardholderName: "",
    },
    validationSchema,
    onSubmit: (values) => handleNewCreditCardPayment(values),
  });

  /**
   * Função para criar transações no backend para cada item do carrinho.
   * Ela itera sobre o carrinho, monta o payload para cada transação
   * e envia requisições POST em paralelo usando Promise.all.
   */
  const createTransactions = async () => {
    // Verifica se o usuário está logado e se o carrinho não está vazio
    if (!user || !user._id || cart.length === 0) {
      console.error(
        "Usuário não logado ou carrinho vazio. Não é possível criar transações."
      );
      return;
    }

    setPaymentProcessing(true); // Ativa o estado de processamento
    setPaymentSuccessMessage(null); // Limpa qualquer mensagem de sucesso/erro anterior

    try {
      // Cria um array de promessas, onde cada promessa é uma requisição POST para uma transação
      const transactionPromises = cart.map((item) => {
        // O ID do jogo vem de item.game._id e o preço do item.game.price, conforme a tipagem Game
        const gameId = item.game._id;
        const amount = item.game.price; // O valor da transação é o preço do jogo

        const payload = {
          game: gameId,
          user: user._id, // ID do usuário logado
          amount: amount, // Valor da transação é o preço individual do jogo
          discountApplied: 0, // Desconto sempre zero conforme especificado
        };
        console.log("Enviando payload da transação:", payload);
        return api.post("/transactions", payload); // Envia a requisição POST
      });

      // Aguarda que todas as promessas de transação sejam resolvidas
      await Promise.all(transactionPromises);

      console.log("Todas as transações foram criadas com sucesso!");
      // Define a mensagem de sucesso para exibir no modal
      setPaymentSuccessMessage(
        `🎉 Pagamento aprovado! Total: ${formatterCurrency(value)}`
      );

      dispatch({ type: "CLEAR_CART" }); // Limpa o carrinho após o sucesso
      await fetchUser(); // Atualiza os dados do usuário

      // Adiciona um pequeno delay antes de fechar o modal e redirecionar
      // para que a mensagem de sucesso seja visível
      setTimeout(() => {
        onClose(); // Fecha o modal
        formik.resetForm(); // Reseta o formulário
        setPaymentSuccessMessage(null); // Limpa a mensagem após fechar o modal
        navigation("/profile"); // Redireciona para o perfil
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar transações:", error);
      // Define a mensagem de erro para exibir no modal
      setPaymentSuccessMessage(
        "Ops! 😔 Erro ao processar o pagamento. Tente novamente."
      );
      setPaymentProcessing(false); // Desativa o estado de processamento em caso de erro
    }
  };

  /**
   * Handler para pagamento com um novo cartão de crédito.
   */
  const handleNewCreditCardPayment = async (
    values: handleNewCreditCardPaymentProps
  ) => {
    console.log("Iniciando pagamento via novo cartão...", {
      type: "creditCard",
      value: formatterCurrency(value),
      products: cart,
      newCreditCard: values,
    });

    // Simula um delay de processamento antes de chamar a API
    await new Promise((r) => setTimeout(r, 1000));

    await createTransactions(); // Chama a função para criar as transações
  };

  /**
   * Handler para pagamento com um cartão de crédito salvo.
   */
  const handleSavedCreditCardPayment = async () => {
    console.log("Iniciando pagamento via cartão salvo...", {
      type: "userCreditCard",
      value: formatterCurrency(value),
      products: cart,
      selectedCard: selectedCard,
    });

    // Simula um delay de processamento antes de chamar a API
    await new Promise((r) => setTimeout(r, 1000));

    await createTransactions(); // Chama a função para criar as transações
  };

  // Conteúdo dinâmico do modal baseado no método de pagamento
  const modalContent = {
    userCreditCard: (
      <div className="flex flex-col gap-3 px-4 py-3 sm:px-6">
        <p className="mb-3 text-xl text-black">Pagamento via cartão salvo</p>
        <div className="flex items-center gap-3">
          <FaCreditCard className="text-black text-[36px]" />
          <div className="flex flex-col">
            <span className="text-black">{selectedCard?.label}</span>
            <span className="text-sm text-black">{selectedCard?.number}</span>
          </div>
        </div>
        <p className="text-[#7b7b7b] text-[14px] mt-4">
          Ao prosseguir, você confirma que é adulto e concorda com nossos termos
          de serviço.
        </p>
        {/* Exibe a mensagem de sucesso ou erro */}
        {paymentSuccessMessage && (
          <div
            className={`mt-4 p-3 rounded-md text-center 
                ${
                  paymentSuccessMessage.includes("aprovado")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
          >
            {paymentSuccessMessage}
          </div>
        )}
      </div>
    ),
    creditCard: (
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-3 px-4 py-3 sm:px-6"
      >
        <p className="mb-3 text-xl text-black">Pagamento com novo cartão</p>

        {/* Inputs para o novo cartão de crédito */}
        <Input
          type="text"
          label="Número do Cartão"
          name="cardNumber"
          placeholder="XXXX XXXX XXXX XXXX"
          value={formik.values.cardNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.cardNumber && formik.errors.cardNumber}
          maxLength={19} // Incluindo espaços para formatação (ex: 4 em 4)
        />
        <div className="flex gap-4">
          <Input
            type="text"
            label="Validade (MM/AA)"
            name="expirationDate"
            placeholder="MM/AA"
            value={formik.values.expirationDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.expirationDate && formik.errors.expirationDate
            }
            maxLength={5} // MM/AA
          />
          <Input
            type="text"
            label="CVV"
            name="cvv"
            placeholder="CVV"
            value={formik.values.cvv}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.cvv && formik.errors.cvv}
            maxLength={4} // CVV pode ser 3 ou 4 dígitos
          />
        </div>
        <Input
          type="text"
          label="Nome do Titular"
          name="cardholderName"
          placeholder="Nome Completo"
          value={formik.values.cardholderName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.cardholderName && formik.errors.cardholderName}
          maxLength={35}
        />

        <p className="text-[#7b7b7b] text-[14px] mt-4">
          Ao prosseguir, você confirma que é adulto e concorda com nossos termos
          de serviço.
        </p>
        {/* Exibe a mensagem de sucesso ou erro */}
        {paymentSuccessMessage && (
          <div
            className={`mt-4 p-3 rounded-md text-center 
                ${
                  paymentSuccessMessage.includes("aprovado")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
          >
            {paymentSuccessMessage}
          </div>
        )}
      </form>
    ),
    pix: <></>, // Conteúdo para Pix (vazio por enquanto)
    boleto: <></>, // Conteúdo para Boleto (vazio por enquanto)
    paypal: <></>, // Conteúdo para PayPal (vazio por enquanto)
  };

  // Conteúdo dinâmico do botão de pagamento
  const buttonContent = {
    userCreditCard: (
      <Button
        label={
          paymentProcessing
            ? "Processando..."
            : `Pagar ${formatterCurrency(value)}`
        }
        style="finally"
        onClick={handleSavedCreditCardPayment} // Chama o handler para cartão salvo
        disabled={paymentProcessing}
      />
    ),
    creditCard: (
      <Button
        label={
          paymentProcessing
            ? "Processando..."
            : `Pagar ${formatterCurrency(value)}`
        }
        style="finally"
        disabled={!formik.isValid || paymentProcessing} // Desabilita se o formulário não for válido ou estiver processando
        onClick={formik.handleSubmit} // Dispara a submissão do formulário do Formik
      />
    ),
    pix: <></>, // Botão para Pix (vazio por enquanto)
    boleto: <></>, // Botão para Boleto (vazio por enquanto)
    paypal: <></>, // Botão para PayPal (vazio por enquanto)
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => {
          // Função de fechamento do Dialog
          onClose(); // Chama a prop onClose
          formik.resetForm(); // Reseta o formulário
          setPaymentSuccessMessage(null); // Limpa a mensagem de sucesso/erro ao fechar
        }}
      >
        <div className="flex items-center justify-center h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:scale-95"
          >
            <div className="inline-block bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full mt-[10%] min-w-[400px]">
              <div className="flex justify-end p-2">
                <IoCloseOutline
                  className="text-black text-[36px] cursor-pointer"
                  onClick={() => {
                    // Botão de fechar dentro do modal
                    onClose(); // Chama a prop onClose
                    formik.resetForm(); // Reseta o formulário
                    setPaymentSuccessMessage(null); // Limpa a mensagem de sucesso/erro ao fechar
                  }}
                />
              </div>
              {modalContent[paymentMethod]}{" "}
              {/* Renderiza o conteúdo do modal */}
              <div className="flex justify-end px-4 py-3 bg-gray-50 sm:px-6">
                {buttonContent[paymentMethod]}{" "}
                {/* Renderiza o botão de pagamento */}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PaymentModal;
