import { Router } from "express";
import createTicket from "../controllers/support/createTicket";

const supportRouter = Router();

supportRouter.post("/ticket", createTicket);

export default supportRouter;
