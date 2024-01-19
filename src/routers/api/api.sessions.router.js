import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
} from "../../controllers/users.controllers.js";

export const apiSessionsRouter = Router();

apiSessionsRouter.post("/login", login);

apiSessionsRouter.get("/current", getCurrentUser);

apiSessionsRouter.delete("/current", logout);
