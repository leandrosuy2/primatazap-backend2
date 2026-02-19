import Ticket from "../../models/Ticket";
import TicketLembrete from "../../models/TicketLembrete";
import AppError from "../../errors/AppError";

interface CreateTicketLembreteData {
  nome: string;
  descricao?: string;
  data: string;
  hora: string;
  eventoId?: number | null;
  addGoogle?: boolean;
}

const CreateTicketLembreteService = async (
  ticketId: number,
  companyId: number,
  data: CreateTicketLembreteData
): Promise<TicketLembrete> => {
  const ticket = await Ticket.findOne({
    where: { id: ticketId, companyId },
    attributes: ["id"]
  });

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  const nome = (data.nome || "").trim();
  if (!nome) {
    throw new AppError("ERR_LEMBRETE_NOME_REQUIRED", 400);
  }
  if (!data.data || !data.hora) {
    throw new AppError("ERR_LEMBRETE_DATA_HORA_REQUIRED", 400);
  }

  const lembrete = await TicketLembrete.create({
    ticketId,
    companyId,
    nome,
    descricao: data.descricao?.trim() || null,
    data: data.data,
    hora: data.hora.trim(),
    eventoId: data.eventoId ?? null,
    addGoogle: data.addGoogle === true
  });

  return lembrete;
};

export default CreateTicketLembreteService;
