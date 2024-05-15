import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "family_history" })
export class FamilyHistory {
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
  familyRelativeId: string;
}
