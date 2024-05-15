import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "exposure" })
export class Exposure {
  @PrimaryGeneratedColumn()
  id: string;
  @CreateDateColumn()
  created_at: Date;
  @Column()
  programId: string;
  @Column()
  submitterDonorId: string;
  @Column()
  entityType: string;
  @Column()
  entityId: string;
}
