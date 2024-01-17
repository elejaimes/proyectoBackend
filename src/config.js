import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();
program.option("-p, --prod", "execution environment", false).parse();
const { prod } = program.opts();

dotenv.config({
  path: prod ? "./config/prod.env" : "./config/dev.env",
});

export const PORT = process.env.PORT;
export const MODE = process.env.MODE;
export const CNX_STR = process.env.CNX_STR;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const GH_APP_ID = process.env.GH_APP_ID;
export const GH_CLIENT_ID = process.env.GH_CLIENT_ID;
export const GH_CLIENT_SECRET = process.env.GH_CLIENT_SECRET;
export const GH_CALLBACK_URL = process.env.GH_CALLBACK_URL;
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
