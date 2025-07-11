import { Request, Response } from "express";
import {
  addContactService,
  deleteContactService,
  getContactsService,
  getUserProfileService,
  loginUserService,
  registerUserService,
  deleteUserAccountService,
  updateAccountService,
} from "../services/userService";
import { sendResponse, sendError } from "../utils/apiResponse";
import { User } from "../interfaces/User";
import { AuthRequest } from "../middlewares/authUser";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      sendError(res, 400, "Email, password and name are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      sendError(res, 400, "Invalid email format");
      return;
    }

    const userData: Omit<User, "_id"> = {
      email,
      password,
      name,
      creationDate: new Date(),
    };

    const user = await registerUserService(userData);
    const { password: _, ...userWithoutPassword } = user.toObject();

    sendResponse(res, 201, "User registered successfully", userWithoutPassword);
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 500, "Error registering user", error.message);
    } else {
      sendError(res, 500, "Error registering user");
    }
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      sendError(res, 400, "Email and password are required");
      return;
    }

    const { user, token } = await loginUserService(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/"
    });

    sendResponse(res, 200, "Login successful", {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token
    });
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 401, "Invalid credentials", error.message);
    } else {
      sendError(res, 401, "Invalid credentials");
    }
  }
};

export const getUserProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;

  try {
    if (!userId) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    const user = await getUserProfileService(userId);

    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    sendResponse(
      res,
      200,
      "User profile retrieved successfully",
      userWithoutPassword
    );
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 500, "Error fetching user profile", error.message);
    } else {
      sendError(res, 500, "Error fetching user profile");
    }
  }
};

export const getContacts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    sendError(res, 401, "Unauthorized");
    return;
  }

  try {
    const contacts = await getContactsService(userId);
    if (!contacts || contacts.length === 0) {
      sendResponse(res, 200, "No contacts found", []);
      return;
    }
    sendResponse(res, 200, "Contacts fetched successfully", contacts);
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 500, "Error fetching contacts", error.message);
    } else {
      sendError(res, 500, "Error fetching contacts");
    }
  }
};

export const addContact = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { contactEmail } = req.body;

    if (!userId || !contactEmail) {
      sendError(res, 400, "User and contact information are required");
      return;
    }
    const addedContact = await addContactService(userId, contactEmail);
    sendResponse(res, 200, "Contact added successfully", addedContact);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Contact already exists") {
        sendError(res, 409, error.message);
      } else if (error.message === "Contact not found") {
        sendError(res, 404, error.message);
      } else if (error.message === "acct Owner not found") {
        sendError(res, 404, "User not found");
      } else {
        sendError(res, 500, "Error adding contact", error.message);
      }
    } else {
      sendError(res, 500, "Error adding contact");
    }
  }
};

export const LogoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.clearCookie("token", {
      sameSite: "strict",
      expires: new Date(0),
    });
    sendResponse(res, 200, "Logout completed successfully");
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 500, "Error finishing session", error.message);
    } else {
      sendError(res, 500, "Error finishing session");
    }
  }
};

export const deleteContact = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  const { contactId } = req.params;

  if (!userId || !contactId) {
    sendError(res, 400, "Missing required data");
    return;
  }

  try {
    const userContacts = await getContactsService(userId);
    const contact = userContacts?.find(
      (contact) => contact.toString() === contactId
    );

    if (!contact) {
      sendError(res, 404, "Contact not found");
      return;
    }

    const newContactsList = await deleteContactService(userId, contactId);
    sendResponse(res, 200, "Contact deleted successfully", newContactsList);
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 500, "Error deleting contact", error.message);
    } else {
      sendError(res, 500, "Error deleting contact");
    }
  }
};

export const deleteUserAccount = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    await deleteUserAccountService(userId);

    res.clearCookie("token", {
      sameSite: "strict",
      expires: new Date(0),
    });

    sendResponse(res, 200, "User account deleted successfully");
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 500, "Error deleting user account", error.message);
    } else {
      sendError(res, 500, "Error deleting user account");
    }
  }
};

export const updateAccount = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  const { email, name } = req.body;

  if (!userId) {
    sendError(res, 401, "Unauthorized");
    return;
  }

  if (!email || !name) {
    sendError(res, 400, "Email and name are required");
    return;
  }

  try {
    const updateData = { email, name };
    const updatedUser = await updateAccountService(userId, updateData);

    if (!updatedUser) {
      sendError(res, 404, "User not found");
      return;
    }

    const { password: _, ...userWithoutPassword } = updatedUser.toObject();
    sendResponse(res, 200, "Account updated successfully", userWithoutPassword);
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 500, "Error updating account", error.message);
    } else {
      sendError(res, 500, "Error updating account");
    }
  }
};
