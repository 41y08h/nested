import { RequestHandler } from "express";

type TMethod = "get" | "post" | "put" | "patch" | "delete";

export default interface IHandler {
  path: string;
  method?: TMethod;
  handle: RequestHandler;
}
