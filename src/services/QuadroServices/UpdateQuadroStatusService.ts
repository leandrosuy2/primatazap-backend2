import Ticket from "../../models/Ticket";
import TicketQuadro from "../../models/TicketQuadro";
import AppError from "../../errors/AppError";
import { buildTicketWhereUuidOrId } from "../../helpers/FindTicketByUuidOrId";

const STATUS_VALID = ["aguardando", "em_producao", "entregue", "cancelado"];

const UpdateQuadroStatusService = async (
  ticketUuid: string,
  companyId: number,
  status: string
): Promise<TicketQuadro> => {
  if (!STATUS_VALID.includes(status)) {
    throw new AppError("ERR_QUADRO_INVALID_STATUS", 400);
  }

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
      status,
      description: null
    });
  } else {
    await quadro.update({ status });
  }

  return quadro;
};

export default UpdateQuadroStatusService;
