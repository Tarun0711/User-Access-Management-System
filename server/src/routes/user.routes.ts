import { Router } from "express";
import { auth, checkRole } from "../middleware/auth";
import { UserRole } from "../entities/User";
import { getUsers, getUser, updateUser } from "../controllers/user.controller";

const router = Router();

router.use(auth);

router.get("/", checkRole([UserRole.ADMIN]), getUsers);
router.get("/:id", checkRole([UserRole.ADMIN]), getUser);
router.patch("/:id", checkRole([UserRole.ADMIN]), updateUser);

export default router; 