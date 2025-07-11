import { Types } from "mongoose";
import { User } from "../interfaces/User";
import UserModel from "../models/UserModel";
import jwt from "jsonwebtoken";
import MessageModel from "../models/MessageModel";

export const registerUserService = async (userData: Omit<User, "_id">) => {
  const newUser = new UserModel(userData);
  return await newUser.save();
};

export const getUserProfileService = async (userId: string) => {
  if (!userId) {
    throw new Error("missing Data");
  }
  try {
    const foundUser = await UserModel.findById(userId)
      .populate('contacts', '_id name email')
      .populate('conversations', '_id participants creationDate');
    
    const formatedUser = foundUser?.toObject()
    if(!formatedUser){
      throw new Error ("account not found")
    }
    return formatedUser;
  } catch (error) {
    throw new Error("error getting user from DB");
  }
};

export const loginUserService = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await UserModel.findOne({ email, password, isDeleted: false })


  if (!user || user.password !== password) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET || "tu-secreto-seguro",
    { expiresIn: "24h" }
  );
  return { user, token };
};

export const getContactsService = async (userId: string) => {
  if (!userId) {
    throw new Error("User Error");
  }
  try {
    const user = await UserModel.findById(userId).populate('contacts', '_id name email');
    if(!user){
      throw new Error("user not found")
    }
    if(user.contacts.length<0){
      throw new Error("no contacts found")
    }
    return user?.contacts;
  } catch (error) {
    throw new Error("Error geting contacts ");
  }
};

export const addContactService = async (
  userId: string,
  contactEmail: string
) => {
  try {
    const currentUser = await UserModel.findById(userId);
    if (!currentUser) {
      throw new Error("acct Owner not found");
    }

    const contactToAdd = await UserModel.findOne({ email: contactEmail });
    if (!contactToAdd) {
      throw new Error("Contact not found");
    }
    if (currentUser.contacts?.includes(contactToAdd.id)) {
      throw new Error("Contact already exists");
    }
    currentUser.contacts = [...(currentUser.contacts || []), contactToAdd.id];
    await currentUser.save();
    return currentUser;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error adding contact in DB");
  }
};

export const deleteContactService = async (
  userId: string,
  contactId: string
) => {
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      throw new Error("User not found");
    }

    foundUser.contacts = foundUser.contacts.filter(
      (contact) => contact.toString() !== contactId
    );
    await foundUser.save();
    return foundUser.contacts;
  } catch (error) {
    throw new Error("Error deleting contact");
  }
};

export const deleteUserAccountService = async (
  userId: string
): Promise<void> => {
  try {
    const deletedUser = await UserModel.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      throw new Error("User not found");
    }

    await MessageModel.updateMany(
      { sender: userId },
      { isDeleted: true, deletedAt: new Date() }
    );
  } catch (error) {
    throw new Error("Error deleting user account");
  }
};

export const updateAccountService = async (
  userId: string,
  dataToupdate: Object
) => {
  if (!userId) {
    throw new Error("missing data");
  }
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      dataToupdate,
      {
        new: true,
        runValidatos: true,
      }
    );
    return updatedUser;
  } catch (error) {
    throw new Error("Error updating data");
  }
};
