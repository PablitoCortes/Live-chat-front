import { Router } from "express";
import {
  addContact,
  deleteContact,
  getContacts,
  getUserProfile,
  loginUser,
  LogoutUser,
  registerUser,
  deleteUserAccount,
  updateAccount,
} from "../controllers/userController";
import { checkExistingUser } from "../middlewares/checkExistingUser";
import { authUser } from "../middlewares/authUser";
import { validateEmail } from "../middlewares/validateEmail";

const userRouter = Router();

userRouter.post("/register", validateEmail, checkExistingUser, registerUser);
userRouter.post("/login", validateEmail, loginUser);
userRouter.post("/logout", LogoutUser);

userRouter.get("/profile", authUser, getUserProfile);
userRouter.put("/profile/update", authUser, updateAccount);
userRouter.delete("/delete", authUser, deleteUserAccount);

userRouter.get("/contacts", authUser, getContacts);
userRouter.put("/contacts/add", authUser, addContact);
userRouter.delete("/contacts/:contactId", authUser, deleteContact);

export default userRouter;
