import { Router } from "express";
import { auth } from "../controller/auth.controller";

const route = Router();

route.post("/auth", auth);

export default route;
