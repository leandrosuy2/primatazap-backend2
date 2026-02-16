import Ticket from "../../models/Ticket";
import TicketQuadroAnexo from "../../models/TicketQuadroAnexo";
import AppError from "../../errors/AppError";
import { buildTicketWhereUuidOrId } from "../../helpers/FindTicketByUuidOrId";

function buildAttachmentUrl(companyId: number, ticketId: number, path: string): string {
  const base = `${process.env.BACKEND_URL}${process.env.PROXY_PORT ? `:${process.env.PROXY_PORT}` : ""}`;
  return `${base}/public/company${companyId}/quadro/${ticketId}/${path}`;
}

const SetQuadroAttachmentCapaService = async (
  ticketUuid: string,
  companyId: number,
  attachmentId: number
): Promise<Array<{ id: number; name: string; url: string; isCapa: boolean; createdAt: Date }>> => {
  const ticket = await Ticket.findOne({
    where: buildTicketWhereUuidOrId(ticketUuid, companyId),
    attributes: ["id"]
  });

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  const anexo = await TicketQuadroAnexo.findOne({
    where: { id: attachmentId, ticketId: ticket.id }
  });

  if (!anexo) {
    throw new AppError("ERR_QUADRO_ATTACHMENT_NOT_FOUND", 404);
  }

  await TicketQuadroAnexo.update(
    { isCapa: false },
    { where: { ticketId: ticket.id } }
  );
  await anexo.update({ isCapa: true });

  const all = await TicketQuadroAnexo.findAll({
    where: { ticketId: ticket.id },
    order: [["createdAt", "ASC"]]
  });

  return all.map((a) => ({
    id: a.id,
    name: a.name,
    url: buildAttachmentUrl(companyId, ticket.id, a.path),
    isCapa: a.isCapa,
    createdAt: a.createdAt
  }));
};

export default SetQuadroAttachmentCapaService;
