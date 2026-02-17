import Ticket from "../../models/Ticket";
import TicketQuadro from "../../models/TicketQuadro";
import TicketQuadroAnexo from "../../models/TicketQuadroAnexo";
import Contact from "../../models/Contact";
import Queue from "../../models/Queue";
import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";
import AppError from "../../errors/AppError";
import { buildTicketWhereUuidOrId } from "../../helpers/FindTicketByUuidOrId";

function buildAttachmentUrl(companyId: number, ticketId: number, path: string): string {
  const base = `${process.env.BACKEND_URL}${process.env.PROXY_PORT ? `:${process.env.PROXY_PORT}` : ""}`;
  return `${base}/public/company${companyId}/quadro/${ticketId}/${path}`;
}

export interface QuadroResponse {
  ticket: {
    id: number;
    uuid: string;
    contact: { id: number; name: string; number: string; urlPicture?: string; profilePicUrl?: string };
    queue: { id: number; name: string; color: string };
    user: { id: number; name: string };
    whatsapp: { id: number; name: string };
  };
  quadro: {
    ticketId: number;
    status: string;
    description: string | null;
    valorServico: number | null;
    valorEntrada: number | null;
    nomeProjeto: string | null;
    customFields: any[];
    quadroGroupId: number | null;
    sharedGroupIds: number[];
    updatedAt: Date;
  } | null;
  attachments: Array<{
    id: number;
    name: string;
    url: string;
    isCapa: boolean;
    createdAt: Date;
  }>;
}

const GetQuadroByTicketUuidService = async (
  ticketUuid: string,
  companyId: number
): Promise<QuadroResponse> => {
  const ticket = await Ticket.findOne({
    where: buildTicketWhereUuidOrId(ticketUuid, companyId),
    attributes: ["id", "uuid", "contactId", "queueId", "userId", "whatsappId", "companyId"],
    include: [
      { model: Contact, as: "contact", attributes: ["id", "name", "number", "profilePicUrl", "urlPicture", "companyId"] },
      { model: Queue, as: "queue", attributes: ["id", "name", "color"] },
      { model: User, as: "user", attributes: ["id", "name"] },
      { model: Whatsapp, as: "whatsapp", attributes: ["id", "name"] }
    ]
  });

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  const quadro = await TicketQuadro.findOne({
    where: { ticketId: ticket.id }
  });

  const anexos = await TicketQuadroAnexo.findAll({
    where: { ticketId: ticket.id },
    order: [["createdAt", "ASC"]]
  });

  const c = ticket.contact;
  const contactData = c ? {
    id: c.id,
    name: c.name,
    number: c.number,
    urlPicture: (c as any).urlPicture ?? undefined,
    profilePicUrl: c.profilePicUrl ?? undefined
  } : { id: 0, name: "", number: "", urlPicture: undefined, profilePicUrl: undefined };
  const queue = ticket.queue ? { id: ticket.queue.id, name: ticket.queue.name, color: ticket.queue.color } : { id: 0, name: "", color: "" };
  const user = ticket.user ? { id: ticket.user.id, name: ticket.user.name } : { id: 0, name: "" };
  const whatsapp = ticket.whatsapp ? { id: ticket.whatsapp.id, name: ticket.whatsapp.name } : { id: 0, name: "" };

  const attachments = anexos.map((a) => ({
    id: a.id,
    name: a.name,
    url: buildAttachmentUrl(ticket.companyId, ticket.id, a.path),
    isCapa: a.isCapa,
    createdAt: a.createdAt
  }));

  return {
    ticket: {
      id: ticket.id,
      uuid: ticket.uuid,
      contact: contactData,
      queue,
      user,
      whatsapp
    },
    quadro: quadro
      ? {
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
      : null,
    attachments
  };
};

export default GetQuadroByTicketUuidService;
