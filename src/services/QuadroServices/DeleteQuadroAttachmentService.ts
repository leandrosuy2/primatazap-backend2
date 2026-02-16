import Ticket from "../../models/Ticket";
import TicketQuadroAnexo from "../../models/TicketQuadroAnexo";
import AppError from "../../errors/AppError";
import { buildTicketWhereUuidOrId } from "../../helpers/FindTicketByUuidOrId";
import path from "path";
import fs from "fs";
import uploadConfig from "../../config/upload";

const DeleteQuadroAttachmentService = async (
  ticketUuid: string,
  companyId: number,
  attachmentId: number
): Promise<void> => {
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

  const filePath = path.resolve(
    uploadConfig.directory,
    `company${companyId}`,
    "quadro",
    String(ticket.id),
    anexo.path
  );
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await anexo.destroy();
};

export default DeleteQuadroAttachmentService;
