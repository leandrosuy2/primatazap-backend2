import { Request, Response } from "express";
import ListTicketEventosService from "../services/TicketEventoServices/ListTicketEventosService";
import CreateTicketEventoService from "../services/TicketEventoServices/CreateTicketEventoService";
import DeleteTicketEventoService from "../services/TicketEventoServices/DeleteTicketEventoService";
import ListTicketAnotacoesService from "../services/TicketAnotacaoServices/ListTicketAnotacoesService";
import CreateTicketAnotacaoService, {
  buildAnotacaoResponse
} from "../services/TicketAnotacaoServices/CreateTicketAnotacaoService";
import UpdateTicketAnotacaoService from "../services/TicketAnotacaoServices/UpdateTicketAnotacaoService";
import DeleteTicketAnotacaoService from "../services/TicketAnotacaoServices/DeleteTicketAnotacaoService";
import ListTicketLembretesService from "../services/TicketLembreteServices/ListTicketLembretesService";
import CreateTicketLembreteService from "../services/TicketLembreteServices/CreateTicketLembreteService";
import DeleteTicketLembreteService from "../services/TicketLembreteServices/DeleteTicketLembreteService";

// ---- Eventos ----
export const listEventos = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { companyId } = req.user;
  const { eventos } = await ListTicketEventosService(parseInt(ticketId, 10), companyId);
  return res.status(200).json({ eventos });
};

export const createEvento = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { companyId } = req.user;
  const { setor, responsavel, tipo, data, hora, localizacao, descricao } = req.body;
  const evento = await CreateTicketEventoService(parseInt(ticketId, 10), companyId, {
    setor,
    responsavel,
    tipo,
    data,
    hora,
    localizacao,
    descricao
  });
  return res.status(201).json({ evento });
};

export const deleteEvento = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId, eventoId } = req.params;
  const { companyId } = req.user;
  await DeleteTicketEventoService(
    parseInt(ticketId, 10),
    companyId,
    parseInt(eventoId, 10)
  );
  return res.status(204).send();
};

// ---- Anotações ----
export const listAnotacoes = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { companyId } = req.user;
  const { anotacoes } = await ListTicketAnotacoesService(
    parseInt(ticketId, 10),
    companyId
  );
  return res.status(200).json({ anotacoes });
};

export const createAnotacao = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { companyId } = req.user;
  const ticketIdNum = parseInt(ticketId, 10);

  let texto: string;
  let eventoId: number | null = null;
  let status = "aberta";
  let arquivoNome: string | null = null;
  let arquivoPath: string | null = null;

  if (req.file) {
    texto = (req.body.texto || "").trim();
    eventoId =
      req.body.eventoId != null && req.body.eventoId !== ""
        ? parseInt(String(req.body.eventoId), 10)
        : null;
    status = (req.body.status || "aberta").trim() || "aberta";
    arquivoNome = req.file.originalname || req.file.filename;
    arquivoPath = req.file.filename;
  } else {
    const body = req.body;
    texto = (body.texto || "").trim();
    eventoId =
      body.eventoId != null && body.eventoId !== ""
        ? parseInt(String(body.eventoId), 10)
        : null;
    status = (body.status || "aberta").trim() || "aberta";
  }

  const anotacao = await CreateTicketAnotacaoService(ticketIdNum, companyId, {
    texto,
    eventoId,
    status,
    arquivoNome,
    arquivoPath
  });

  const response = buildAnotacaoResponse(anotacao, companyId, ticketIdNum);
  return res.status(201).json({ anotacao: response });
};

export const updateAnotacao = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId, anotacaoId } = req.params;
  const { companyId } = req.user;
  const { status, texto } = req.body;
  const anotacao = await UpdateTicketAnotacaoService(
    parseInt(ticketId, 10),
    companyId,
    parseInt(anotacaoId, 10),
    { status, texto }
  );
  const baseUrl = `${process.env.BACKEND_URL}${process.env.PROXY_PORT ? `:${process.env.PROXY_PORT}` : ""}`;
  const arquivoUrl = anotacao.arquivoPath
    ? `${baseUrl}/public/company${companyId}/anotacoes/${ticketId}/${anotacao.arquivoPath}`
    : null;
  return res.status(200).json({
    anotacao: {
      id: anotacao.id,
      ticketId: anotacao.ticketId,
      eventoId: anotacao.eventoId,
      texto: anotacao.texto,
      arquivoNome: anotacao.arquivoNome,
      arquivoUrl,
      status: anotacao.status,
      createdAt: anotacao.createdAt
    }
  });
};

export const deleteAnotacao = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId, anotacaoId } = req.params;
  const { companyId } = req.user;
  await DeleteTicketAnotacaoService(
    parseInt(ticketId, 10),
    companyId,
    parseInt(anotacaoId, 10)
  );
  return res.status(204).send();
};

// ---- Lembretes ----
export const listLembretes = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { companyId } = req.user;
  const { lembretes } = await ListTicketLembretesService(
    parseInt(ticketId, 10),
    companyId
  );
  return res.status(200).json({ lembretes });
};

export const createLembrete = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { companyId } = req.user;
  const { nome, descricao, data, hora, eventoId, addGoogle } = req.body;
  const lembrete = await CreateTicketLembreteService(
    parseInt(ticketId, 10),
    companyId,
    {
      nome,
      descricao,
      data,
      hora,
      eventoId: eventoId != null ? parseInt(String(eventoId), 10) : null,
      addGoogle: addGoogle === true || addGoogle === "true"
    }
  );
  return res.status(201).json({ lembrete });
};

export const deleteLembrete = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId, lembreteId } = req.params;
  const { companyId } = req.user;
  await DeleteTicketLembreteService(
    parseInt(ticketId, 10),
    companyId,
    parseInt(lembreteId, 10)
  );
  return res.status(204).send();
};
