import Ticket from "../../models/Ticket";
import TicketQuadro from "../../models/TicketQuadro";
import AppError from "../../errors/AppError";

const UpdateQuadroValuesService = async (
  ticketId: number,
  companyId: number,
  valorServico: number | null,
  valorEntrada: number | null
): Promise<TicketQuadro> => {
  const ticket = await Ticket.findOne({
    where: { id: ticketId, companyId },
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
      description: null,
      valorServico: valorServico ?? null,
      valorEntrada: valorEntrada ?? null
    });
  } else {
    await quadro.update({
      valorServico: valorServico ?? null,
      valorEntrada: valorEntrada ?? null
    });
  }

  return quadro;
};

export default UpdateQuadroValuesService;
