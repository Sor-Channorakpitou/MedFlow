import type { Request, Response, NextFunction } from "express";
import { getAdminAnalytics } from "../services/adminService.js";

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
    const data = await getAdminAnalytics(startDate, endDate);
    return res.json(data);
  } catch (error) {
    next(error);
  }
};
