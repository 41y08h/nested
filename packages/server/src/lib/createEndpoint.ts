import { Router } from "express";
import IController from "../interfaces/Controller";
import IEndpoint from "../interfaces/Endpoint";

const createEndpoint = (Controller: IController): IEndpoint => {
  const router = Router();

  Controller.handlers.forEach((handler) => {
    const method = handler.method ?? "get";
    router[method](handler.path, handler.handle);
  });

  return { route: Controller.route, router };
};

export default createEndpoint;
