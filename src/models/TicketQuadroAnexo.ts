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
  Default
} from "sequelize-typescript";
import Ticket from "./Ticket";

@Table({ tableName: "TicketQuadroAnexos" })
class TicketQuadroAnexo extends Model<TicketQuadroAnexo> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Ticket)
  @Column
  ticketId: number;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @Column
  name: string;

  @Column
  path: string;

  @Default(false)
  @Column
  isCapa: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default TicketQuadroAnexo;
