import Ticket from "../../models/Ticket";
import TicketQuadro from "../../models/TicketQuadro";
import AppError from "../../errors/AppError";
import { buildTicketWhereUuidOrId } from "../../helpers/FindTicketByUuidOrId";

const UpdateQuadroDescriptionService = async (
  ticketUuid: string,
  companyId: number,
  description: string
): Promise<TicketQuadro> => {
  const ticket = await Ticket.findOne({
    where: buildTicketWhereUuidOrId(ticketUuid, companyId),
    attributes: ["id"]
  });

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  let quadro = await TicketQuadro.findOne({
    where: { ticketId: ticket.id }
  });

  if (!quadro) {
    quadro = await TicketQuadro.create({
      ticketId: ticket.id,
      status: "aguardando",
      description: description || null
    });
  } else {
    await quadro.update({ description: description || null });
  }

  return quadro;
};

export default UpdateQuadroDescriptionService;
