import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "primary_diagnosis" })
export class PrimaryDiagnosis {
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
  @Column()
  submitterPrimaryDiagnosisId: string;
}
