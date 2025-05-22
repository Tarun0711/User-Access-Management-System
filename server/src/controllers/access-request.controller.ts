import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { AccessRequest, RequestStatus } from "../entities/AccessRequest";
import { Software } from "../entities/Software";
import { User, UserRole } from "../entities/User";
import { z } from "zod";

const requestSchema = z.object({
  softwareId: z.string().uuid(),
  reason: z.string().min(10)
});

export const createRequest = async (req: Request, res: Response) => {
  try {
    const { softwareId, reason } = requestSchema.parse(req.body);
    const requestRepository = AppDataSource.getRepository(AccessRequest);
    const softwareRepository = AppDataSource.getRepository(Software);

    const software = await softwareRepository.findOne({
      where: { id: softwareId }
    });

    if (!software) {
      return res.status(404).json({ error: "Software not found" });
    }

    const request = requestRepository.create({
      user: req.user,
      software,
      reason,
      status: RequestStatus.PENDING
    });

    await requestRepository.save(request);

    res.status(201).json(request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const requestRepository = AppDataSource.getRepository(AccessRequest);
    let requests;

    if (req.user?.role === UserRole.ADMIN) {
      requests = await requestRepository.find({
        relations: ["user", "software"],
        order: { createdAt: "DESC" }
      });
    } else if (req.user?.role === UserRole.MANAGER) {
      requests = await requestRepository.find({
        where: { status: RequestStatus.PENDING },
        relations: ["user", "software"],
        order: { createdAt: "DESC" }
      });
    } else {
      requests = await requestRepository.find({
        where: { user: { id: req.user?.id } },
        relations: ["software"],
        order: { createdAt: "DESC" }
      });
    }

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { status, rejectionReason } = req.body;

    if (!Object.values(RequestStatus).includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const requestRepository = AppDataSource.getRepository(AccessRequest);
    const request = await requestRepository.findOne({
      where: { id: requestId },
      relations: ["user"]
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (status === RequestStatus.REJECTED && !rejectionReason) {
      return res.status(400).json({ error: "Rejection reason is required" });
    }

    request.status = status;
    if (status === RequestStatus.REJECTED) {
      request.rejectionReason = rejectionReason;
    }

    await requestRepository.save(request);
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}; 