import Ticket from "../../models/Ticket";
import QuadroStatusLog from "../../models/QuadroStatusLog";
import User from "../../models/User";
import AppError from "../../errors/AppError";
import { buildTicketWhereUuidOrId } from "../../helpers/FindTicketByUuidOrId";

export interface QuadroLogItem {
  id: number;
  fromLabel: string | null;
  toLabel: string | null;
  userName: string;
  createdAt: Date;
}

const ListQuadroLogsService = async (
  ticketUuid: string,
  companyId: number
): Promise<{ logs: QuadroLogItem[] }> => {
  const ticket = await Ticket.findOne({
    where: buildTicketWhereUuidOrId(ticketUuid, companyId),
    attributes: ["id"]
  });

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  const logs = await QuadroStatusLog.findAll({
    where: { ticketId: ticket.id },
    include: [
      { model: User, as: "user", attributes: ["name"] }
    ],
    order: [["createdAt", "DESC"]]
  });

  const items: QuadroLogItem[] = logs.map((log) => ({
    id: log.id,
    fromLabel: log.fromLabel,
    toLabel: log.toLabel,
    userName: (log as any).user?.name ?? "",
    createdAt: log.createdAt
  }));

  return { logs: items };
};

export default ListQuadroLogsService;
