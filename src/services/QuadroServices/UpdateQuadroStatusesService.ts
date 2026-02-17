import QuadroStatus from "../../models/QuadroStatus";
import sequelize from "../../database";

interface StatusInput {
  label: string;
  value?: string;
  color?: string;
}

interface Request {
  statuses: StatusInput[];
  companyId: number;
}

const UpdateQuadroStatusesService = async ({ statuses, companyId }: Request): Promise<void> => {
  const transaction = await sequelize.transaction();

  try {
    await QuadroStatus.destroy({ where: { companyId }, transaction });

    for (let i = 0; i < statuses.length; i++) {
      const s = statuses[i];
      await QuadroStatus.create(
        {
          label: s.label,
          value: s.value || s.label.toLowerCase().replace(/\s+/g, "_"),
          color: s.color || "#9e9e9e",
          sortOrder: i,
          companyId
        },
        { transaction }
      );
    }

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

export default UpdateQuadroStatusesService;
