import { Router } from "express";
import { loggedAdmin, loggedUserApi } from "../../middlewares/auth.js";
import {
  getAllUsers,
  getLoggedUser,
  register,
  resetPassword,
} from "../../controllers/api/users.controllers.js";

export const apiUsersRouter = Router();

apiUsersRouter.post("/", register);

apiUsersRouter.put("/", resetPassword);

apiUsersRouter.get("/current", loggedUserApi, getLoggedUser);

apiUsersRouter.get("/", loggedAdmin, getAllUsers);
