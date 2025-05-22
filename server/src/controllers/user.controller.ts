import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";
import { z } from "zod";

const userUpdateSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(UserRole).optional()
});

export const getUsers = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      select: ["id", "firstName", "lastName", "email", "role", "createdAt"],
      order: { createdAt: "DESC" }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id },
      select: ["id", "firstName", "lastName", "email", "role", "createdAt"]
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userData = userUpdateSchema.parse(req.body);
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only admin can change roles
    if (userData.role && req.user?.role !== UserRole.ADMIN) {
      return res.status(403).json({ error: "Only admin can change user roles" });
    }

    Object.assign(user, userData);
    await userRepository.save(user);

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}; 