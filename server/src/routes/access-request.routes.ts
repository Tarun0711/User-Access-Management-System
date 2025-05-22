import { Router } from "express";
import { auth, checkRole } from "../middleware/auth";
import { UserRole } from "../entities/User";
import {
  createRequest,
  getRequests,
  updateRequestStatus
} from "../controllers/access-request.controller";

const router = Router();

router.use(auth);

router.post("/", createRequest);
router.get("/", getRequests);
router.patch(
  "/:requestId/status",
  checkRole([UserRole.MANAGER, UserRole.ADMIN]),
  updateRequestStatus
);

export default router; 