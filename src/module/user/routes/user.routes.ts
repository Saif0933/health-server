import { Router } from "express";
import { getProfile, updateProfile } from "../controller/user.controller";
import { isAuthenticated } from "../auth.middleware";

const route = Router();

route.use(isAuthenticated);
route.get("/profile", getProfile);
route.put("/profile", updateProfile);

export default route;
