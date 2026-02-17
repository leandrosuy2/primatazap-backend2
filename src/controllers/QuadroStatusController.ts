import { Request, Response } from "express";
import ListQuadroStatusesService from "../services/QuadroServices/ListQuadroStatusesService";
import UpdateQuadroStatusesService from "../services/QuadroServices/UpdateQuadroStatusesService";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const statuses = await ListQuadroStatusesService(companyId);
  return res.status(200).json({ statuses });
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { statuses } = req.body;
  await UpdateQuadroStatusesService({ statuses, companyId });
  return res.status(200).json({ message: "Status atualizados." });
};
