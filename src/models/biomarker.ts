import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "biomarker" })
export class Biomarker {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  programId: string;
  @CreateDateColumn()
  created_at: Date;
  @Column()
  submitterDonorId: string;
  @Column()
  submitterSpecimenId: string;
  @Column()
  submitterPrimaryDiagnosisId: string;
  @Column()
  submitterFollowUpId: string;
  @Column()
  submitterTreatmentId: string;
  @Column()
  testInterval: string;
  @Column()
  entityType: string;
  @Column()
  entityId: string;
}
