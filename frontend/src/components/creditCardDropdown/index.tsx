import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  FaRegCreditCard,
  FaTrash,
  FaCheckCircle,
  FaRegCircle,
} from "react-icons/fa";

import "./style.scss";
import { useCreditCard } from "@/context/creditCard";

export interface creditCardsProps {
  id: string;
  label: string;
  number: string;
  name: string;
  expiration: string;
  cvv: string;
}

interface CreditCardDropdownProps {
  creditCards: creditCardsProps[];
  selectedCard: creditCardsProps;
  onSelectCard: (selected: creditCardsProps) => void;
  selectedPaymentMethod:
    | "pix"
    | "creditCard"
    | "boleto"
    | "paypal"
    | "userCreditCard";
  setSelectedPaymentMethod: (
    label: "pix" | "creditCard" | "boleto" | "paypal" | "userCreditCard"
  ) => void;
}

const CreditCardDropdown = ({
  creditCards,
  selectedCard,
  onSelectCard,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}: CreditCardDropdownProps) => {
  const { removeCreditCard } = useCreditCard();

  const handleDelete = (creditCardId: string) => {
    removeCreditCard(creditCardId);
  };

  return (
    <Listbox value={selectedCard} onChange={onSelectCard}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className="relative flex items-center justify-between w-full px-3 py-2 text-left text-black border rounded-md focus:outline-none focus:border-blue-300">
              {selectedPaymentMethod === "userCreditCard" ? (
                <FaCheckCircle className="!text-[#63aafb] text-[24px]" />
              ) : (
                <FaRegCircle className="!text-black text-[24px]" />
              )}
              <FaRegCreditCard className="!text-black icon mx-2 text-[22px]" />
              <div className="flex items-center justify-between w-full">
                <p className="!text-black">
                  {selectedCard?.label || "Selecione um cartão"}
                </p>
                <p className="!text-black">{selectedCard?.number}</p>
              </div>
              <FaTrash
                onClick={() => handleDelete(selectedCard?.id)}
                className="!text-black ml-5 hover:!text-red-600 mr-2 text-[22px]"
              />
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Listbox.Options
                static
                className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white border rounded-md shadow-lg max-h-60 focus:outline-none"
              >
                {creditCards?.map((card) => (
                  <Listbox.Option
                    key={card?.id}
                    value={card}
                    className="cursor-pointer"
                  >
                    {({ active }) => (
                      <div
                        onClick={() =>
                          setSelectedPaymentMethod("userCreditCard")
                        }
                        className={`${
                          active ? "text-black bg-blue-500" : "text-gray-900"
                        } cursor-pointer select-none relative py-2 pl-10 pr-4 flex items-center justify-between w-full`}
                      >
                        <FaRegCreditCard className="!text-black icon mr-2 text-[22px]" />
                        <div className="flex items-center justify-between w-full">
                          <p className="!text-black">{card?.label}</p>
                          <p className="!text-black">{card?.number}</p>
                        </div>
                        <FaTrash
                          onClick={() => handleDelete(card?.id)}
                          className="!text-black ml-5 hover:!text-red-600 mr-2 text-[22px]"
                        />
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default CreditCardDropdown;
