import { Router } from "express";
import { loggedAdmin, loggedUserApi } from "../../middlewares/auth.js";
import {
  getAllUsers,
  getCurrentUser,
  getLoggedUser,
  register,
  resetPassword,
} from "../../controllers/users.controllers.js";

export const apiUsersRouter = Router();

apiUsersRouter.post("/", register);

apiUsersRouter.put("/", resetPassword);

apiUsersRouter.get("/current", loggedUserApi, getLoggedUser);

apiUsersRouter.get("/", loggedAdmin, getAllUsers);
