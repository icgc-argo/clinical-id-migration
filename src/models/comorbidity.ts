import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "comorbidity" })
export class Comorbidity {
  @PrimaryGeneratedColumn()
  id: string;
  @CreateDateColumn()
  created_at: Date;
  @Column()
  programId?: string;
  @Column()
  submitterDonorId?: string;
  @Column()
  entityType?: string;
  @Column()
  entityId: string;
  @Column()
  comorbidityTypeCode?: string;
}
