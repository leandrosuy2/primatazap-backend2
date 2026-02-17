import TicketQuadro from "../../models/TicketQuadro";

interface Request {
  ticketId: number;
  groupIds: number[];
  companyId: number;
}

const ShareTicketQuadroService = async ({ ticketId, groupIds, companyId }: Request): Promise<TicketQuadro> => {
  let quadro = await TicketQuadro.findOne({ where: { ticketId } });

  if (!quadro) {
    quadro = await TicketQuadro.create({
      ticketId,
      companyId,
      sharedGroupIds: groupIds,
      status: "aguardando"
    });
  } else {
    await quadro.update({ sharedGroupIds: groupIds });
  }

  return quadro;
};

export default ShareTicketQuadroService;
