import { Request, Response } from "express";
import GetQuadroByTicketUuidService from "../services/QuadroServices/GetQuadroByTicketUuidService";
import UpdateQuadroStatusService from "../services/QuadroServices/UpdateQuadroStatusService";
import UpdateQuadroDescriptionService from "../services/QuadroServices/UpdateQuadroDescriptionService";
import UploadQuadroAttachmentService from "../services/QuadroServices/UploadQuadroAttachmentService";
import SetQuadroAttachmentCapaService from "../services/QuadroServices/SetQuadroAttachmentCapaService";
import DeleteQuadroAttachmentService from "../services/QuadroServices/DeleteQuadroAttachmentService";
import RenameQuadroAttachmentService from "../services/QuadroServices/RenameQuadroAttachmentService";
import CreateQuadroLogService from "../services/QuadroServices/CreateQuadroLogService";
import ListQuadroLogsService from "../services/QuadroServices/ListQuadroLogsService";
import UpdateQuadroValuesService from "../services/QuadroServices/UpdateQuadroValuesService";
import ShareTicketQuadroService from "../services/QuadroServices/ShareTicketQuadroService";
import MoveTicketQuadroService from "../services/QuadroServices/MoveTicketQuadroService";

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

export const renameAttachment = async (req: Request, res: Response): Promise<Response> => {
  const ticketUuidOrId = req.params.ticketId ?? req.params.ticketUuid;
  const { attachmentId } = req.params;
  const { companyId } = req.user;
  const { name } = req.body;
  if (name == null || String(name).trim() === "") {
    return res.status(400).json({ error: "name é obrigatório" });
  }
  const attachment = await RenameQuadroAttachmentService(
    ticketUuidOrId,
    companyId,
    parseInt(attachmentId, 10),
    name
  );
  const baseUrl = `${process.env.BACKEND_URL}${process.env.PROXY_PORT ? `:${process.env.PROXY_PORT}` : ""}`;
  const url = `${baseUrl}/public/company${companyId}/quadro/${attachment.ticketId}/${attachment.path}`;
  return res.status(200).json({
    attachment: {
      id: attachment.id,
      name: attachment.name,
      url,
      isCapa: attachment.isCapa,
      createdAt: attachment.createdAt
    }
  });
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

export const move = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { companyId } = req.user;
  const { targetGroupId, targetTagId, userId } = req.body;
  if (targetGroupId == null) {
    return res.status(400).json({ error: "targetGroupId é obrigatório" });
  }
  const { ticket, quadro } = await MoveTicketQuadroService({
    ticketId: parseInt(ticketId, 10),
    companyId,
    targetGroupId: Number(targetGroupId),
    targetTagId: targetTagId != null ? Number(targetTagId) : undefined,
    userId: userId != null ? Number(userId) : undefined
  });
  return res.status(200).json({
    ticket: {
      id: ticket.id,
      quadroGroupId: ticket.quadroGroupId,
      userId: ticket.userId
    },
    quadro: {
      ticketId: quadro.ticketId,
      quadroGroupId: quadro.quadroGroupId,
      sharedGroupIds: quadro.sharedGroupIds ?? [],
      status: quadro.status,
      updatedAt: quadro.updatedAt
    }
  });
};

export const share = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { companyId } = req.user;
  const { groupIds, linkType, sharedStagesByGroup } = req.body;
  if (!Array.isArray(groupIds)) {
    return res.status(400).json({ error: "groupIds é obrigatório e deve ser um array" });
  }
  const quadro = await ShareTicketQuadroService({
    ticketId: parseInt(ticketId, 10),
    groupIds,
    companyId,
    linkType: linkType === "unlinked" ? "unlinked" : "linked",
    sharedStagesByGroup:
      sharedStagesByGroup && typeof sharedStagesByGroup === "object"
        ? sharedStagesByGroup
        : undefined
  });
  return res.status(200).json(quadro);
};

export const listLogs = async (req: Request, res: Response): Promise<Response> => {
  const ticketUuidOrId = req.params.ticketUuid ?? req.params.ticketId;
  const { companyId } = req.user;
  const data = await ListQuadroLogsService(ticketUuidOrId, companyId);
  return res.status(200).json(data);
};
