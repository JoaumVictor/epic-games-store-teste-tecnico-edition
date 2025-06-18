interface User {
  _id: string;
  username: string;
  email: string;
  role?: "user" | "admin";
  gamesBought?: string[];
  createdAt: string;
  updatedAt: string;
}
