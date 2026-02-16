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
  AllowNull
} from "sequelize-typescript";
import Ticket from "./Ticket";
import User from "./User";

@Table({ tableName: "QuadroStatusLogs" })
class QuadroStatusLog extends Model<QuadroStatusLog> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Ticket)
  @Column
  ticketId: number;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @AllowNull(true)
  @Column
  fromLaneId: string;

  @AllowNull(true)
  @Column
  toLaneId: string;

  @AllowNull(true)
  @Column
  fromLabel: string;

  @AllowNull(true)
  @Column
  toLabel: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default QuadroStatusLog;
