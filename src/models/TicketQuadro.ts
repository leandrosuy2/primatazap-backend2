import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  Default,
  DataType,
  AllowNull,
  HasMany
} from "sequelize-typescript";
import Ticket from "./Ticket";
import QuadroGroup from "./QuadroGroup";
import Company from "./Company";
import TicketQuadroAnexo from "./TicketQuadroAnexo";

@Table({ tableName: "TicketQuadros" })
class TicketQuadro extends Model<TicketQuadro> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Ticket)
  @Column
  ticketId: number;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @Default("aguardando")
  @Column
  status: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
  valorServico: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
  valorEntrada: number;

  @AllowNull(true)
  @Column
  nomeProjeto: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  get customFields(): any {
    const raw = this.getDataValue("customFields" as any);
    if (!raw) return [];
    if (typeof raw === "string") {
      try { return JSON.parse(raw); } catch { return []; }
    }
    return raw;
  }
  set customFields(val: any) {
    this.setDataValue("customFields" as any, val ? JSON.stringify(val) : null);
  }

  @ForeignKey(() => QuadroGroup)
  @AllowNull(true)
  @Column
  quadroGroupId: number;

  @BelongsTo(() => QuadroGroup)
  group: QuadroGroup;

  @Column({ type: DataType.TEXT, allowNull: true })
  get sharedGroupIds(): number[] {
    const raw = this.getDataValue("sharedGroupIds" as any);
    if (!raw) return [];
    if (typeof raw === "string") {
      try { return JSON.parse(raw); } catch { return []; }
    }
    return raw as number[];
  }
  set sharedGroupIds(val: number[]) {
    this.setDataValue("sharedGroupIds" as any, val ? JSON.stringify(val) : null);
  }

  @Default("linked")
  @Column({ type: DataType.STRING(20), allowNull: true })
  linkType: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  get sharedStagesByGroup(): Record<string, number[]> {
    const raw = this.getDataValue("sharedStagesByGroup" as any);
    if (!raw) return {};
    if (typeof raw === "string") {
      try { return JSON.parse(raw); } catch { return {}; }
    }
    return raw as Record<string, number[]>;
  }
  set sharedStagesByGroup(val: Record<string, number[]>) {
    this.setDataValue("sharedStagesByGroup" as any, val && Object.keys(val).length ? JSON.stringify(val) : null);
  }

  @ForeignKey(() => Company)
  @AllowNull(true)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @HasMany(() => TicketQuadroAnexo, { foreignKey: "ticketId", sourceKey: "ticketId" })
  attachments: TicketQuadroAnexo[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default TicketQuadro;
