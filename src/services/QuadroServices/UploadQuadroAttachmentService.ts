import Ticket from "../../models/Ticket";
import TicketQuadroAnexo from "../../models/TicketQuadroAnexo";
import AppError from "../../errors/AppError";
import { buildTicketWhereUuidOrId } from "../../helpers/FindTicketByUuidOrId";

function buildAttachmentUrl(companyId: number, ticketId: number, path: string): string {
  const base = `${process.env.BACKEND_URL}${process.env.PROXY_PORT ? `:${process.env.PROXY_PORT}` : ""}`;
  return `${base}/public/company${companyId}/quadro/${ticketId}/${path}`;
}

const UploadQuadroAttachmentService = async (
  ticketUuid: string,
  companyId: number,
  filename: string
): Promise<{ id: number; name: string; url: string; isCapa: boolean; createdAt: Date }> => {
  const ticket = await Ticket.findOne({
    where: buildTicketWhereUuidOrId(ticketUuid, companyId),
    attributes: ["id"]
  });

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  const count = await TicketQuadroAnexo.count({
    where: { ticketId: ticket.id }
  });

  const isCapa = count === 0;

  const anexo = await TicketQuadroAnexo.create({
    ticketId: ticket.id,
    name: filename,
    path: filename,
    isCapa
  });

  return {
    id: anexo.id,
    name: anexo.name,
    url: buildAttachmentUrl(companyId, ticket.id, anexo.path),
    isCapa: anexo.isCapa,
    createdAt: anexo.createdAt
  };
};

export default UploadQuadroAttachmentService;
