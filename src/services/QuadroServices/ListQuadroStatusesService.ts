import QuadroStatus from "../../models/QuadroStatus";

const DEFAULT_STATUSES = [
  { label: "Aguardando", value: "aguardando", color: "#fbc02d", sortOrder: 0 },
  { label: "Em andamento", value: "em_andamento", color: "#1976d2", sortOrder: 1 },
  { label: "Concluído", value: "concluido", color: "#388e3c", sortOrder: 2 },
  { label: "Cancelado", value: "cancelado", color: "#d32f2f", sortOrder: 3 }
];

interface StatusResponse {
  label: string;
  value: string;
  color: string;
}

const ListQuadroStatusesService = async (companyId: number): Promise<StatusResponse[]> => {
  let statuses = await QuadroStatus.findAll({
    where: { companyId },
    order: [["sortOrder", "ASC"]]
  });

  if (statuses.length === 0) {
    for (const s of DEFAULT_STATUSES) {
      await QuadroStatus.create({ ...s, companyId });
    }
    statuses = await QuadroStatus.findAll({
      where: { companyId },
      order: [["sortOrder", "ASC"]]
    });
  }

  return statuses.map(s => ({
    label: s.label,
    value: s.value,
    color: s.color
  }));
};

export default ListQuadroStatusesService;
