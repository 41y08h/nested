import IHandler from "./Handler";

export default interface IController {
  route: string;
  handlers: IHandler[];
}
