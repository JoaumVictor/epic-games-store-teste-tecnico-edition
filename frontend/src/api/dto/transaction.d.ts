interface Transaction {
  _id: string;
  game: Game;
  user: User;
  transactionDate: string;
  amount: number;
  discountApplied?: number;
  createdAt: string;
  updatedAt: string;
}
