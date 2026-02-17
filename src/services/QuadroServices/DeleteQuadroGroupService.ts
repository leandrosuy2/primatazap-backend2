import AppError from "../../errors/AppError";
import QuadroGroup from "../../models/QuadroGroup";
import Ticket from "../../models/Ticket";

interface Request {
  id: number;
  companyId: number;
}

const DeleteQuadroGroupService = async ({ id, companyId }: Request): Promise<void> => {
  const group = await QuadroGroup.findOne({ where: { id, companyId } });

  if (!group) {
    throw new AppError("Área não encontrada", 404);
  }

  await Ticket.update(
    { quadroGroupId: null },
    { where: { quadroGroupId: id, companyId } }
  );

  await group.destroy();
};

export default DeleteQuadroGroupService;
