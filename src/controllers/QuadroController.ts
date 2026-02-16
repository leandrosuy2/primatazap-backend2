import { Request, Response } from "express";
import GetQuadroByTicketUuidService from "../services/QuadroServices/GetQuadroByTicketUuidService";
import UpdateQuadroStatusService from "../services/QuadroServices/UpdateQuadroStatusService";
import UpdateQuadroDescriptionService from "../services/QuadroServices/UpdateQuadroDescriptionService";
import UploadQuadroAttachmentService from "../services/QuadroServices/UploadQuadroAttachmentService";
import SetQuadroAttachmentCapaService from "../services/QuadroServices/SetQuadroAttachmentCapaService";
import DeleteQuadroAttachmentService from "../services/QuadroServices/DeleteQuadroAttachmentService";
import CreateQuadroLogService from "../services/QuadroServices/CreateQuadroLogService";
import ListQuadroLogsService from "../services/QuadroServices/ListQuadroLogsService";

export const getQuadro = async (req: Request, res: Response): Promise<Response> => {
  const { ticketUuid } = req.params;
  const { companyId } = req.user;
  const data = await GetQuadroByTicketUuidService(ticketUuid, companyId);
  return res.status(200).json(data);
};

export const updateStatus = async (req: Request, res: Response): Promise<Response> => {
  const { ticketUuid } = req.params;
  const { companyId } = req.user;
  const { status } = req.body;
  const quadro = await UpdateQuadroStatusService(ticketUuid, companyId, status);
  return res.status(200).json({
    quadro: {
      ticketId: quadro.ticketId,
      status: quadro.status,
      description: quadro.description,
      updatedAt: quadro.updatedAt
    }
  });
};

export const updateDescription = async (req: Request, res: Response): Promise<Response> => {
  const { ticketUuid } = req.params;
  const { companyId } = req.user;
  const { description } = req.body;
  const quadro = await UpdateQuadroDescriptionService(ticketUuid, companyId, description);
  return res.status(200).json({
    quadro: {
      ticketId: quadro.ticketId,
      status: quadro.status,
      description: quadro.description,
      updatedAt: quadro.updatedAt
    }
  });
};

export const uploadAttachment = async (req: Request, res: Response): Promise<Response> => {
  const { ticketUuid } = req.params;
  const { companyId } = req.user;
  const file = req.file;
  if (!file || !file.filename) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }
  const attachment = await UploadQuadroAttachmentService(ticketUuid, companyId, file.filename);
  return res.status(201).json({ attachment });
};

export const setAttachmentCapa = async (req: Request, res: Response): Promise<Response> => {
  const { ticketUuid, attachmentId } = req.params;
  const { companyId } = req.user;
  const attachments = await SetQuadroAttachmentCapaService(
    ticketUuid,
    companyId,
    parseInt(attachmentId, 10)
  );
  return res.status(200).json({ attachments });
};

export const deleteAttachment = async (req: Request, res: Response): Promise<Response> => {
  const { ticketUuid, attachmentId } = req.params;
  const { companyId } = req.user;
  await DeleteQuadroAttachmentService(ticketUuid, companyId, parseInt(attachmentId, 10));
  return res.status(204).send();
};

export const createLog = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { companyId, id: userId } = req.user;
  const { fromLaneId, toLaneId, fromLabel, toLabel } = req.body;
  await CreateQuadroLogService({
    ticketId: parseInt(ticketId, 10),
    companyId,
    userId: Number(userId),
    fromLaneId,
    toLaneId,
    fromLabel,
    toLabel
  });
  return res.status(200).json({ ok: true });
};

export const listLogs = async (req: Request, res: Response): Promise<Response> => {
  const { ticketUuid } = req.params;
  const { companyId } = req.user;
  const data = await ListQuadroLogsService(ticketUuid, companyId);
  return res.status(200).json(data);
};
