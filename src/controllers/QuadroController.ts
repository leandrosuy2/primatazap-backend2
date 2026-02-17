import { Request, Response } from "express";
import GetQuadroByTicketUuidService from "../services/QuadroServices/GetQuadroByTicketUuidService";
import UpdateQuadroStatusService from "../services/QuadroServices/UpdateQuadroStatusService";
import UpdateQuadroDescriptionService from "../services/QuadroServices/UpdateQuadroDescriptionService";
import UploadQuadroAttachmentService from "../services/QuadroServices/UploadQuadroAttachmentService";
import SetQuadroAttachmentCapaService from "../services/QuadroServices/SetQuadroAttachmentCapaService";
import DeleteQuadroAttachmentService from "../services/QuadroServices/DeleteQuadroAttachmentService";
import CreateQuadroLogService from "../services/QuadroServices/CreateQuadroLogService";
import ListQuadroLogsService from "../services/QuadroServices/ListQuadroLogsService";
import UpdateQuadroValuesService from "../services/QuadroServices/UpdateQuadroValuesService";
import ShareTicketQuadroService from "../services/QuadroServices/ShareTicketQuadroService";

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
      valorServico: quadro.valorServico != null ? Number(quadro.valorServico) : null,
      valorEntrada: quadro.valorEntrada != null ? Number(quadro.valorEntrada) : null,
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
      valorServico: quadro.valorServico != null ? Number(quadro.valorServico) : null,
      valorEntrada: quadro.valorEntrada != null ? Number(quadro.valorEntrada) : null,
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
  const ticketUuidOrId = req.params.ticketUuid ?? req.params.ticketId;
  const { attachmentId } = req.params;
  const { companyId } = req.user;
  await DeleteQuadroAttachmentService(ticketUuidOrId, companyId, parseInt(attachmentId, 10));
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

export const updateValues = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { companyId } = req.user;
  const { valorServico, valorEntrada, nomeProjeto, customFields } = req.body;
  const valorServicoNum = valorServico != null ? Number(valorServico) : null;
  const valorEntradaNum = valorEntrada != null ? Number(valorEntrada) : null;
  const quadro = await UpdateQuadroValuesService(
    parseInt(ticketId, 10),
    companyId,
    valorServicoNum,
    valorEntradaNum,
    nomeProjeto,
    customFields
  );
  return res.status(200).json({
    quadro: {
      ticketId: quadro.ticketId,
      status: quadro.status,
      description: quadro.description,
      valorServico: quadro.valorServico != null ? Number(quadro.valorServico) : null,
      valorEntrada: quadro.valorEntrada != null ? Number(quadro.valorEntrada) : null,
      nomeProjeto: quadro.nomeProjeto ?? null,
      customFields: quadro.customFields ?? [],
      quadroGroupId: quadro.quadroGroupId ?? null,
      sharedGroupIds: quadro.sharedGroupIds ?? [],
      updatedAt: quadro.updatedAt
    }
  });
};

export const share = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { companyId } = req.user;
  const { groupIds } = req.body;
  const quadro = await ShareTicketQuadroService({
    ticketId: parseInt(ticketId, 10),
    groupIds,
    companyId
  });
  return res.status(200).json(quadro);
};

export const listLogs = async (req: Request, res: Response): Promise<Response> => {
  const ticketUuidOrId = req.params.ticketUuid ?? req.params.ticketId;
  const { companyId } = req.user;
  const data = await ListQuadroLogsService(ticketUuidOrId, companyId);
  return res.status(200).json(data);
};
