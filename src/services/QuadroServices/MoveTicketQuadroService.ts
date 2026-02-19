import { Op } from "sequelize";
import Ticket from "../../models/Ticket";
import TicketQuadro from "../../models/TicketQuadro";
import TicketTag from "../../models/TicketTag";
import Tag from "../../models/Tag";
import AppError from "../../errors/AppError";

interface MoveTicketQuadroRequest {
  ticketId: number;
  companyId: number;
  targetGroupId: number;
  targetTagId?: number;
  userId?: number;
}

interface MoveTicketQuadroResponse {
  ticket: Ticket;
  quadro: TicketQuadro;
}

const MoveTicketQuadroService = async ({
  ticketId,
  companyId,
  targetGroupId,
  targetTagId,
  userId
}: MoveTicketQuadroRequest): Promise<MoveTicketQuadroResponse> => {
  const ticket = await Ticket.findOne({
    where: { id: ticketId, companyId },
    attributes: ["id", "quadroGroupId", "userId", "companyId"]
  });

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  const quadro = await TicketQuadro.findOne({
    where: { ticketId: ticket.id }
  });

  const previousMainGroupId = ticket.quadroGroupId ?? quadro?.quadroGroupId ?? null;

  const updateTicket: { quadroGroupId: number; userId?: number } = {
    quadroGroupId: targetGroupId
  };
  if (userId != null) {
    updateTicket.userId = userId;
  }
  await ticket.update(updateTicket);

  let updatedQuadro: TicketQuadro;
  if (quadro) {
    const newShared = (quadro.sharedGroupIds ?? []).filter(
      (g) => g !== previousMainGroupId
    );
    await quadro.update({
      quadroGroupId: targetGroupId,
      sharedGroupIds: newShared
    });
    updatedQuadro = quadro;
  } else {
    updatedQuadro = await TicketQuadro.create({
      ticketId: ticket.id,
      companyId,
      quadroGroupId: targetGroupId,
      sharedGroupIds: [],
      status: "aguardando"
    });
  }

  if (targetTagId != null) {
    const kanbanTags = await Tag.findAll({
      where: { companyId, kanban: 1 },
      attributes: ["id"]
    });
    const kanbanTagIds = kanbanTags.map((t) => t.id);
    if (kanbanTagIds.length > 0) {
      await TicketTag.destroy({
        where: {
          ticketId: ticket.id,
          tagId: { [Op.in]: kanbanTagIds }
        }
      });
    }
    await TicketTag.findOrCreate({
      where: { ticketId: ticket.id, tagId: targetTagId },
      defaults: { ticketId: ticket.id, tagId: targetTagId }
    });
  }

  return {
    ticket,
    quadro: updatedQuadro
  };
};

export default MoveTicketQuadroService;
