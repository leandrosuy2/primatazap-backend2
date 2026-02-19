import Ticket from "../../models/Ticket";
import TicketQuadroAnexo from "../../models/TicketQuadroAnexo";
import AppError from "../../errors/AppError";
import { buildTicketWhereUuidOrId } from "../../helpers/FindTicketByUuidOrId";

const RenameQuadroAttachmentService = async (
  ticketIdOrUuid: string,
  companyId: number,
  attachmentId: number,
  name: string
): Promise<TicketQuadroAnexo> => {
  const ticket = await Ticket.findOne({
    where: buildTicketWhereUuidOrId(ticketIdOrUuid, companyId),
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

  const trimmedName = (name || "").trim();
  if (!trimmedName) {
    throw new AppError("ERR_QUADRO_ATTACHMENT_NAME_REQUIRED", 400);
  }

  await anexo.update({ name: trimmedName });
  return anexo;
};

export default RenameQuadroAttachmentService;
