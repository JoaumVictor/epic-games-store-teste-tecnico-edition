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
  selectedCard: creditCardsProps | undefined;
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
  selectedPaymentMethod = "userCreditCard",
  setSelectedPaymentMethod,
}: CreditCardDropdownProps) => {
  const { removeCreditCard } = useCreditCard();

  const handleDelete = (e: React.MouseEvent, creditCardId?: string) => {
    e.stopPropagation();
    if (creditCardId) {
      removeCreditCard(creditCardId);
    }
  };

  return (
    <Listbox value={selectedCard} onChange={onSelectCard}>
      {({ open }) => (
        <>
          <div className="relative w-full">
            <Listbox.Button className="relative flex items-center justify-between w-full px-4 py-3 text-sm text-left text-gray-800 transition-all duration-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 sm:text-base">
              {selectedPaymentMethod === "userCreditCard" ? (
                <FaCheckCircle className="text-[#63aafb] text-lg sm:text-xl mr-2 flex-shrink-0" />
              ) : (
                <FaRegCircle className="flex-shrink-0 mr-2 text-lg text-gray-600 sm:text-xl" />
              )}
              <FaRegCreditCard className="flex-shrink-0 mx-2 text-lg text-gray-800 sm:text-xl" />
              <div className="flex flex-col items-start justify-between w-full overflow-hidden sm:flex-row sm:items-center">
                <p className="mr-2 overflow-hidden font-medium text-gray-800 whitespace-nowrap text-ellipsis">
                  {selectedCard?.label || "Selecione um cartão"}
                </p>
                <p className="overflow-hidden text-xs text-gray-600 sm:text-sm whitespace-nowrap text-ellipsis">
                  {selectedCard?.number}
                </p>
              </div>
              {selectedCard && (
                <FaTrash
                  onClick={(e) => handleDelete(e, selectedCard.id)}
                  className="flex-shrink-0 ml-3 text-lg text-gray-600 cursor-pointer sm:ml-5 hover:text-red-500 sm:text-xl"
                />
              )}
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
                className="absolute z-10 w-full py-1 mt-1 overflow-auto text-sm bg-white border border-gray-300 rounded-md shadow-lg max-h-60 focus:outline-none sm:text-base"
              >
                {creditCards?.map((card) => (
                  <Listbox.Option
                    key={card.id}
                    value={card}
                    className="cursor-pointer"
                  >
                    {({ active }) => (
                      <div
                        onClick={() =>
                          setSelectedPaymentMethod("userCreditCard")
                        }
                        className={`${
                          active ? "text-gray-900 bg-blue-100" : "text-gray-900"
                        } cursor-pointer select-none relative py-2 pl-4 pr-2 sm:pl-6 sm:pr-4 flex items-center justify-between w-full`}
                      >
                        <FaRegCreditCard className="flex-shrink-0 mr-2 text-lg text-gray-800 sm:text-xl" />
                        <div className="flex flex-col items-start justify-between w-full overflow-hidden sm:flex-row sm:items-center">
                          <p className="mr-2 overflow-hidden font-medium text-gray-800 whitespace-nowrap text-ellipsis">
                            {card.label}
                          </p>
                          <p className="overflow-hidden text-xs text-gray-600 sm:text-sm whitespace-nowrap text-ellipsis">
                            {card.number}
                          </p>
                        </div>
                        <FaTrash
                          onClick={(e) => handleDelete(e, card.id)}
                          className="flex-shrink-0 ml-3 text-lg text-gray-600 cursor-pointer sm:ml-5 hover:text-red-500 sm:text-xl"
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
