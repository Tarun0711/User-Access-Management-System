import { Router } from "express";
import { auth, checkRole } from "../middleware/auth";
import { UserRole } from "../entities/User";
import {
  createSoftware,
  getSoftware,
  updateSoftware,
  deleteSoftware
} from "../controllers/software.controller";

const router = Router();

router.use(auth);

router.get("/", getSoftware);
router.post("/", checkRole([UserRole.ADMIN]), createSoftware);
router.patch("/:id", checkRole([UserRole.ADMIN]), updateSoftware);
router.delete("/:id", checkRole([UserRole.ADMIN]), deleteSoftware);

export default router; 