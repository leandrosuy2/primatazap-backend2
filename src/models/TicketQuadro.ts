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
  DataType
} from "sequelize-typescript";
import Ticket from "./Ticket";

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

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default TicketQuadro;
