import path from "path";
import multer from "multer";
import fs from "fs";
import Ticket from "../models/Ticket";
import { buildTicketWhereUuidOrId } from "../helpers/FindTicketByUuidOrId";

const publicFolder = path.resolve(__dirname, "..", "..", "public");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const ticketUuid = req.params.ticketUuid;
    const companyId = req.user?.companyId;
    if (!companyId || !ticketUuid) {
      return cb(new Error("ERR_NO_TICKET_OR_COMPANY"), "");
    }
    const ticket = await Ticket.findOne({
      where: buildTicketWhereUuidOrId(ticketUuid, companyId),
      attributes: ["id"]
    });
    if (!ticket) {
      return cb(new Error("ERR_NO_TICKET_FOUND"), "");
    }
    const folder = path.resolve(publicFolder, `company${companyId}`, "quadro", String(ticket.id));
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      fs.chmodSync(folder, 0o777);
    }
    (req as any).ticketIdQuadro = ticket.id;
    return cb(null, folder);
  },
  filename(req, file, cb) {
    const name = file.originalname.replace(/\//g, "-").replace(/ /g, "_");
    return cb(null, name);
  }
});

export default {
  directory: publicFolder,
  storage
};
