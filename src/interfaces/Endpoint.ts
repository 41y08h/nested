import { IRouter } from "express";

export default interface IEndpoint {
  route: string;
  router: IRouter;
}
