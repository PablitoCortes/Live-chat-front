import {Router } from "express";
import { authUser } from "../middlewares/authUser";
import { getContacts, addContact, deleteContact } from "../controllers/contactController";

const contactRouter = Router();


contactRouter.get("/contacts", authUser, getContacts);
contactRouter.put("/contacts/add", authUser, addContact);
contactRouter.delete("/contacts/:contactId", authUser, deleteContact);

export default contactRouter;