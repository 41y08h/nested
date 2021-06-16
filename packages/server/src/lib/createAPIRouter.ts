import { IRouter, Router } from "express";
import { readdirSync } from "fs";
import path from "path";
import IController from "../interfaces/Controller";
import createEndpoint from "./createEndpoint";

const createAPIRouter = (): IRouter => {
  const api = Router();
  const controllersPath = path.join(__dirname, "../controllers");
  const controllersFileNames = readdirSync(controllersPath);

  controllersFileNames.forEach(async (filename) => {
    const controllerPath = path.join(__dirname, "../controllers", filename);
    const module = await import(controllerPath);
    const controller: IController = module.default;

    const endpoint = createEndpoint(controller);
    api.use(endpoint.route, endpoint.router);
  });

  return api;
};

export default createAPIRouter;
