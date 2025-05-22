import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { AccessRequest } from "./AccessRequest";

export enum UserRole {
  EMPLOYEE = "employee",
  MANAGER = "manager",
  ADMIN = "admin"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.EMPLOYEE
  })
  role: UserRole;

  @OneToMany(() => AccessRequest, (request) => request.user)
  accessRequests: AccessRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 