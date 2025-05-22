import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Software } from "../entities/Software";
import { z } from "zod";

const softwareSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  version: z.string().min(1),
  isActive: z.boolean().optional()
});

export const createSoftware = async (req: Request, res: Response) => {
  try {
    const softwareData = softwareSchema.parse(req.body);
    const softwareRepository = AppDataSource.getRepository(Software);

    const software = softwareRepository.create(softwareData);
    await softwareRepository.save(software);

    res.status(201).json(software);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSoftware = async (req: Request, res: Response) => {
  try {
    const softwareRepository = AppDataSource.getRepository(Software);
    const software = await softwareRepository.find({
      where: { isActive: true },
      order: { name: "ASC" }
    });

    res.json(software);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateSoftware = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const softwareData = softwareSchema.parse(req.body);
    const softwareRepository = AppDataSource.getRepository(Software);

    const software = await softwareRepository.findOne({
      where: { id }
    });

    if (!software) {
      return res.status(404).json({ error: "Software not found" });
    }

    Object.assign(software, softwareData);
    await softwareRepository.save(software);

    res.json(software);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteSoftware = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const softwareRepository = AppDataSource.getRepository(Software);

    const software = await softwareRepository.findOne({
      where: { id }
    });

    if (!software) {
      return res.status(404).json({ error: "Software not found" });
    }

    software.isActive = false;
    await softwareRepository.save(software);

    res.json({ message: "Software deactivated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}; 