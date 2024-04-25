import {Column, Entity, ObjectIdColumn} from "typeorm";

@Entity({ name: 'donors' })
export class ClinicalDonor {
    @ObjectIdColumn()
    id: string;

    @Column()
    donorId?: number;
    @Column()
    submitterId: string;
    @Column()
    programId: string;
    @Column()
    specimens: Specimen[];
    @Column()
    clinicalInfo: ClinicalInfo;
    @Column()
    primaryDiagnoses: PrimaryDiagnosis[];
    @Column()
    familyHistory: FamilyHistory[];
    @Column()
    comorbidity: Comorbidity[];
    @Column()
    followUps: FollowUp[];
    @Column()
    treatments: Treatment[];
    @Column()
    exposure: Exposure[];
    @Column()
    biomarker: Biomarker[];
}


@Entity({ name: 'FailedMigrations' })
export class FailedMigrations {
    @ObjectIdColumn()
    id: string;

    @Column()
    donorId?: number;
    @Column()
    submitterId?: string;
    @Column()
    programId?: string;
    @Column()
    specimens?: Specimen[];
    @Column()
    clinicalInfo?: ClinicalInfo;
    @Column()
    primaryDiagnoses?: PrimaryDiagnosis[];
    @Column()
    familyHistory?: FamilyHistory[];
    @Column()
    comorbidity?: Comorbidity[];
    @Column()
    followUps?: FollowUp[];
    @Column()
    treatments?: Treatment[];
    @Column()
    exposure?: Exposure[];
    @Column()
    biomarker?: Biomarker[];
}

export interface Specimen extends ClinicalEntity {
    samples: Array<Sample>;
    specimenTissueSource: string;
    submitterId: string;
    specimenId?: number;
    tumourNormalDesignation: string;
    specimenType: string;
}

export interface Sample {
    sampleId?: number;
    sampleType: string;
    submitterId: string;
}

export type ClinicalEntity = {
    clinicalInfo: ClinicalInfo;
    [k: string]: any;
};

export interface ClinicalInfo {
    [field: string]: string | number | boolean | string[] | number[] | boolean[] | undefined;
}

export interface Treatment extends ClinicalEntity {
    treatmentId: number | undefined;
    therapies: Array<Therapy>;
}

export interface Therapy extends ClinicalEntity {
    therapyType: string;
}

export interface FollowUp extends ClinicalEntity {
    followUpId: number | undefined;
}

export interface PrimaryDiagnosis extends ClinicalEntity {
    primaryDiagnosisId: number | undefined;
}

export interface FamilyHistory extends ClinicalEntity {
    familyHistoryId: number | undefined;
}

export interface Exposure extends ClinicalEntity {
    exposureId: number | undefined;
}

export interface Biomarker extends ClinicalEntity {
    biomarkerId: number | undefined;
}

export interface Comorbidity extends ClinicalEntity {
    comorbidityId: number | undefined;
}




