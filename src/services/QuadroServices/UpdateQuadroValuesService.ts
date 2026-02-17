import Ticket from "../../models/Ticket";
import TicketQuadro from "../../models/TicketQuadro";
import AppError from "../../errors/AppError";

interface UpdateData {
  valorServico?: number | null;
  valorEntrada?: number | null;
  nomeProjeto?: string | null;
  customFields?: any;
}

const UpdateQuadroValuesService = async (
  ticketId: number,
  companyId: number,
  valorServico: number | null,
  valorEntrada: number | null,
  nomeProjeto?: string | null,
  customFields?: any
): Promise<TicketQuadro> => {
  const ticket = await Ticket.findOne({
    where: { id: ticketId, companyId },
    attributes: ["id"]
  });

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  const updateData: UpdateData = {};
  if (valorServico !== undefined) updateData.valorServico = valorServico;
  if (valorEntrada !== undefined) updateData.valorEntrada = valorEntrada;
  if (nomeProjeto !== undefined) updateData.nomeProjeto = nomeProjeto;
  if (customFields !== undefined) updateData.customFields = customFields;

  let quadro = await TicketQuadro.findOne({
    where: { ticketId: ticket.id }
  });

  if (!quadro) {
    quadro = await TicketQuadro.create({
      ticketId: ticket.id,
      companyId,
      status: "aguardando",
      description: null,
      ...updateData
    });
  } else {
    await quadro.update(updateData);
  }

  return quadro;
};

export default UpdateQuadroValuesService;
