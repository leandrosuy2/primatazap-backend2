import TicketQuadro from "../../models/TicketQuadro";

interface Request {
  ticketId: number;
  groupIds: number[];
  companyId: number;
  linkType?: "linked" | "unlinked";
  sharedStagesByGroup?: Record<string, number[]>;
}

const ShareTicketQuadroService = async ({
  ticketId,
  groupIds,
  companyId,
  linkType = "linked",
  sharedStagesByGroup
}: Request): Promise<TicketQuadro> => {
  let quadro = await TicketQuadro.findOne({ where: { ticketId } });

  const updateData: {
    sharedGroupIds: number[];
    linkType?: string;
    sharedStagesByGroup?: Record<string, number[]>;
  } = { sharedGroupIds: groupIds };
  if (linkType === "unlinked" || linkType === "linked") {
    updateData.linkType = linkType;
  }
  if (sharedStagesByGroup != null && typeof sharedStagesByGroup === "object") {
    updateData.sharedStagesByGroup = sharedStagesByGroup;
  }

  if (!quadro) {
    quadro = await TicketQuadro.create({
      ticketId,
      companyId,
      sharedGroupIds: groupIds,
      status: "aguardando",
      linkType: updateData.linkType ?? "linked",
      sharedStagesByGroup: updateData.sharedStagesByGroup
    });
  } else {
    await quadro.update(updateData);
  }

  return quadro;
};

export default ShareTicketQuadroService;
