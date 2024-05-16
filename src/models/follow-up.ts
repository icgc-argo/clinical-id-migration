import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: 'follow_up' })
export class FollowUp {
    @PrimaryGeneratedColumn()
    id: string;
    @CreateDateColumn()
    created_at: Date ;
    @Column()
    programId: string;
    @Column()
    submitterDonorId: string;
    @Column()
    entityType: string;
    @Column()
    entityId: string;
    @Column()
    submitterFollowUpId: string;
}