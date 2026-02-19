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
  AllowNull,
  Default
} from "sequelize-typescript";
import Ticket from "./Ticket";
import Company from "./Company";
import TicketEvento from "./TicketEvento";

@Table({ tableName: "TicketLembretes" })
class TicketLembrete extends Model<TicketLembrete> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Ticket)
  @Column
  ticketId: number;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @ForeignKey(() => TicketEvento)
  @AllowNull(true)
  @Column
  eventoId: number;

  @BelongsTo(() => TicketEvento)
  evento: TicketEvento;

  @Column
  nome: string;

  @AllowNull(true)
  @Column({ type: "TEXT" })
  descricao: string;

  @Column
  data: string;

  @Column
  hora: string;

  @Default(false)
  @Column
  addGoogle: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default TicketLembrete;
