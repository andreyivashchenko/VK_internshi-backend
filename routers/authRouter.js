import Router from "express";
import AuthController from "../controllers/authController.js";
import { registrationValidation } from "../validations/authValidation.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const controller = new AuthController();
const router = new Router();

router.post("/registration", registrationValidation, controller.registration);
router.post("/login", controller.login);
router.get("/users", roleMiddleware(["USER", "ADMIN"]), controller.gitUsers);

export default router;
