import { CreateCreditCardDto } from "./dto/creditCard.dto";
import { getErrorMessage } from "./errors";
import api from "./index";

export const getAllCreditCards = async (email: string, password: string) => {
  try {
    const response = await api.get("/credit-cards");
    return response.data;
  } catch (error) {
    console.error("error", error);
    return getErrorMessage(error);
  }
};

export const createCreditCard = async (creditCard: CreateCreditCardDto) => {
  try {
    const response = await api.post("/credit-cards", creditCard);
    return response.data;
  } catch (error) {
    console.error("error", error);
    return getErrorMessage(error);
  }
};
