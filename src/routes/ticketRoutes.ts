import express from "express";
import multer from "multer";
import isAuth from "../middleware/isAuth";
import uploadQuadroConfig from "../config/uploadQuadro";

import * as TicketController from "../controllers/TicketController";
import * as QuadroController from "../controllers/QuadroController";

const ticketRoutes = express.Router();
const uploadQuadro = multer(uploadQuadroConfig);

ticketRoutes.get("/tickets", isAuth, TicketController.index);

ticketRoutes.get("/tickets-log/:ticketId", isAuth, TicketController.showLog);

ticketRoutes.get("/ticket/kanban", isAuth, TicketController.kanban);

ticketRoutes.get("/ticketreport/reports", isAuth, TicketController.report);

ticketRoutes.get("/tickets/u/:uuid", isAuth, TicketController.showFromUUID);

ticketRoutes.get("/tickets/:ticketUuid/quadro/logs", isAuth, QuadroController.listLogs);
ticketRoutes.get("/tickets/:ticketUuid/quadro", isAuth, QuadroController.getQuadro);
ticketRoutes.put("/tickets/:ticketUuid/quadro/status", isAuth, QuadroController.updateStatus);
ticketRoutes.put("/tickets/:ticketUuid/quadro/description", isAuth, QuadroController.updateDescription);
ticketRoutes.post("/tickets/:ticketUuid/quadro/attachments", isAuth, uploadQuadro.single("file"), QuadroController.uploadAttachment);
ticketRoutes.patch("/tickets/:ticketUuid/quadro/attachments/:attachmentId/capa", isAuth, QuadroController.setAttachmentCapa);
ticketRoutes.delete("/tickets/:ticketUuid/quadro/attachments/:attachmentId", isAuth, QuadroController.deleteAttachment);

ticketRoutes.post("/tickets", isAuth, TicketController.store);

ticketRoutes.put("/tickets/:ticketId/quadro", isAuth, QuadroController.updateValues);
ticketRoutes.put("/tickets/:ticketId", isAuth, TicketController.update);
ticketRoutes.put("/tickets/:ticketId/contact", isAuth, TicketController.updateContact);
ticketRoutes.post("/tickets/:ticketId/quadro/log", isAuth, QuadroController.createLog);
ticketRoutes.get("/tickets/:ticketId/quadro/logs", isAuth, QuadroController.listLogs);
ticketRoutes.post("/tickets/:ticketId/quadro/share", isAuth, QuadroController.share);

ticketRoutes.get("/tickets/:ticketId", isAuth, TicketController.show);

ticketRoutes.delete("/tickets/:ticketId", isAuth, TicketController.remove);

ticketRoutes.post("/tickets/closeAll", isAuth, TicketController.closeAll);

export default ticketRoutes;
