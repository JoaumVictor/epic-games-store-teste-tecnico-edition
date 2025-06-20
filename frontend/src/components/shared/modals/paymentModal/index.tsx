import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "@/components/ui/button";
import { formatterCurrency, isLuhnValid } from "@/utils/shared";
import { IoCloseOutline } from "react-icons/io5";
import Input from "@/components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { creditCardsProps } from "@/components/pages/payment/creditCardDropdown";
import { FaCreditCard } from "react-icons/fa";
import { useCart } from "@/context/cart";
import useUser from "@/hooks/useUser";
import api from "@/api";
import { useNavigate } from "react-router-dom";

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
  const { cart, dispatch } = useCart();
  const { user } = useUser();
  const navigation = useNavigate();

  const [paymentProcessing, setPaymentProcessing] = useState(false);

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
      .matches(/^(0[1-9]|1[0-2])\d{2}$/, "Data inválida. Formato aceito: MM/YY")
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

  const handleNewCreditCardPayment = async (
    values: handleNewCreditCardPaymentProps
  ) => {
    if (!user || !user._id || cart.length === 0) return;

    setPaymentProcessing(true);

    // Simula processamento de pagamento com novo cartão
    console.log("Pagamento via novo cartão", {
      type: "creditCard",
      value: formatterCurrency(value),
      products: cart,
      newCreditCard: values,
    });

    await new Promise((r) => setTimeout(r, 2000)); // delay simulado

    setPaymentProcessing(false);

    // Simula mensagem e redirecionamento
    alert(`Pagamento aprovado! Total: ${formatterCurrency(value)}`);
    dispatch({ type: "CLEAR_CART" });

    setTimeout(() => {
      onClose();
      formik.resetForm();
      navigation("/profile");
    }, 500);
  };

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
      </div>
    ),
    creditCard: (
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-3 px-4 py-3 sm:px-6"
      >
        <p className="mb-3 text-xl text-black">Pagamento com novo cartão</p>
        {/* <p>Inputs aqui</p> */}

        <p className="text-[#7b7b7b] text-[14px] mt-4">
          Ao prosseguir, você confirma que é adulto e concorda com nossos termos
          de serviço.
        </p>
      </form>
    ),
    pix: <></>,
    boleto: <></>,
    paypal: <></>,
  };

  const buttonContent = {
    userCreditCard: (
      <Button
        label={
          paymentProcessing
            ? "Processando..."
            : `Pagar ${formatterCurrency(value)}`
        }
        style="finally"
        onClick={() => handleNewCreditCardPayment(formik.values)}
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
        disabled={!formik.isValid || paymentProcessing}
        onClick={formik.handleSubmit}
      />
    ),
    pix: <></>,
    boleto: <></>,
    paypal: <></>,
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
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
                    onClose();
                    formik.resetForm();
                  }}
                />
              </div>
              {modalContent[paymentMethod]}
              <div className="flex justify-end px-4 py-3 bg-gray-50 sm:px-6">
                {buttonContent[paymentMethod]}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PaymentModal;
