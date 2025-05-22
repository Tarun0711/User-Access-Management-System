import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { AccessRequest } from "./AccessRequest";

@Entity()
export class Software {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  version: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => AccessRequest, (request) => request.software)
  accessRequests: AccessRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 