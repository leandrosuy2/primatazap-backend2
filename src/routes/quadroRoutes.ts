import express from "express";
import isAuth from "../middleware/isAuth";

import * as QuadroGroupController from "../controllers/QuadroGroupController";
import * as QuadroStatusController from "../controllers/QuadroStatusController";

const quadroRoutes = express.Router();

// Quadro Groups (Áreas de Trabalho)
quadroRoutes.get("/quadro-groups", isAuth, QuadroGroupController.index);
quadroRoutes.post("/quadro-groups", isAuth, QuadroGroupController.store);
quadroRoutes.put("/quadro-groups/:id", isAuth, QuadroGroupController.update);
quadroRoutes.delete("/quadro-groups/:id", isAuth, QuadroGroupController.remove);

// Quadro Statuses (Status Personalizados)
quadroRoutes.get("/quadro-statuses", isAuth, QuadroStatusController.index);
quadroRoutes.put("/quadro-statuses", isAuth, QuadroStatusController.update);

export default quadroRoutes;
