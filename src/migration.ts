
import {ClinicalDonor, FailedMigrations} from "./models/clinical-donor.js";
import {MongoDataSource, PostgresDataSource} from "./datasources.js";
import {Comorbidity} from "./models/comorbidity.js";
import {Biomarker} from "./models/biomarker.js";
import {Donor} from "./models/donor.js";
import {Exposure} from "./models/exposure.js";
import {FamilyHistory} from "./models/family-history.js";
import {FollowUp} from "./models/follow-up.js";
import {PrimaryDiagnosis} from "./models/primary-diagnosis.js";
import {Treatment} from "./models/treatment.js";
import {Specimen} from "./models/specimen.js";
import {SampleRegistration} from "./models/sample-registration.js";
import * as fs from "fs";
import {Response} from "express";

let logFileStream;
let fileConsole: Console;

let checkpoint = '';
export async function beginMigration(response: Response) {

    logFileStream = fs.createWriteStream("./MigrationConsole.log");
    fileConsole = new console.Console(logFileStream, logFileStream);

    fileConsole.log("");
    fileConsole.log("");
    fileConsole.log("The Great Wildebeest Migration begins....");
    fileConsole.log("");
    fileConsole.log("...3");
    fileConsole.log("......2");
    fileConsole.log(".........1");
    fileConsole.log("............ GO!");
    fileConsole.log("");

    let isInitialized = MongoDataSource.isInitialized;
    if (!isInitialized) {
        await MongoDataSource.initialize();
    }
    isInitialized = PostgresDataSource.isInitialized;
    if (!isInitialized){
        await PostgresDataSource.initialize();
    }
    
    const cdRepo = MongoDataSource.getRepository(ClinicalDonor);
    const failedMigrations = MongoDataSource.getRepository(FailedMigrations);
    const donors = await cdRepo.find();

    for (const donor of donors) {
        fileConsole.log("");
        fileConsole.log(" ------------ Migrating ids for  donor: " + donor.id+" Program Id: "+donor.programId+" -Submitter Id: "+donor.submitterId+" -------------");
        fileConsole.log("");
        try {
            await migrateDonors(donor);
            await migrateBiomarkers(donor);
            await migrateComorbidity(donor);
            await migrateExposure(donor);
            await migrateFamilyHistory(donor);
            await migrateFollowUps(donor);
            await migratePrimaryDiagnosis(donor);
            await migrateTreatments(donor);
            await migrateSpecimens(donor);
            await migrateSamples(donor);
        } catch (e) {
            fileConsole.log("Oops, Croc attack! - migration for donor failed."+" -Checkpoint: "+checkpoint+" -Program Id: "+donor.programId+" -Submitter Id: "+donor.submitterId);
            fileConsole.log("Problem: "+e.message);
            await failedMigrations.save(donor);
            continue;
        }
    }

    fileConsole.log("");
    fileConsole.log('Wildebeests migrated!');
    return;
}


async function migrateDonors(donor: ClinicalDonor){
    checkpoint = 'Donor: '+donor.donorId;

    const dnRepo = PostgresDataSource.getRepository(Donor);
    const submitterDonorId = donor.submitterId?.toString();
    const programId = donor.programId;
    const idDonor = new Donor();
    idDonor.submitterDonorId = submitterDonorId || '-';
    idDonor.programId = programId || '-';
    idDonor.entityId = donor.donorId?.toString() || '-';
    idDonor.entityType = "donor";
    await dnRepo.save(idDonor);

    fileConsole.log("donor id "+ idDonor.entityId + " of clinical donor "+donor.id + " migrated.");

}

async function migrateBiomarkers(donor: ClinicalDonor){
    const bmRepo = PostgresDataSource.getRepository(Biomarker);
        const submitterDonorId = donor.submitterId?.toString();
        const programId = donor.programId;
    for (const bm of donor.biomarker) {
        checkpoint = 'Biomarker: '+bm.biomarkerId;

        const biomarker = new Biomarker();
        biomarker.submitterDonorId = submitterDonorId || '-';
        biomarker.programId = programId || '-';
        biomarker.submitterFollowUpId = bm.clinicalInfo.submitter_follow_up_id?.toString() || '-';
        biomarker.submitterPrimaryDiagnosisId = bm.clinicalInfo.submitter_primary_diagnosis_id?.toString() || '-';
        biomarker.submitterSpecimenId = bm.clinicalInfo.submitter_specimen_id?.toString() || '-';
        biomarker.submitterTreatmentId = bm.clinicalInfo.submitter_treatment_id?.toString() || '-';
        biomarker.testInterval = bm.clinicalInfo.test_interval?.toString() || '-';
        biomarker.entityId = bm.biomarkerId?.toString() || '-';
        biomarker.entityType = "biomarker";
        await bmRepo.save(biomarker);

        fileConsole.log("biomarker id " + biomarker.entityId + " of clinical donor " + donor.id + " migrated.");
    }
}

async function migrateComorbidity(donor: ClinicalDonor){
    const cmRepo = PostgresDataSource.getRepository(Comorbidity);
        const submitterDonorId = donor.submitterId?.toString();
        const programId = donor.programId;
    for (const cm of donor.comorbidity) {
        checkpoint = 'Comorbidity: '+cm.comorbidityId;

        const comorbidity = new Comorbidity();
        comorbidity.submitterDonorId = submitterDonorId || '-';
        comorbidity.programId = programId || '-';
        comorbidity.comorbidityTypeCode = cm.clinicalInfo.comorbidity_type_code?.toString() || '-';
        comorbidity.entityId = cm.comorbidityId?.toString() || '-';
        comorbidity.entityType = "comorbidity";
        await cmRepo.save(comorbidity);

        fileConsole.log("comorbidity id " + comorbidity.entityId + " of clinical donor " + donor.id + " migrated.");
    }
}

async function migrateExposure(donor: ClinicalDonor){
    const exRepo = PostgresDataSource.getRepository(Exposure);
    const submitterDonorId = donor.submitterId?.toString();
    const programId = donor.programId;
    for (const ex of donor.exposure) {
        checkpoint = 'Exposure: '+ex.exposureId;

        const exposure = new Exposure();
        exposure.submitterDonorId = submitterDonorId || '-';
        exposure.programId = programId || '-';
        exposure.entityId = ex.exposureId?.toString() || '-';
        exposure.entityType = "exposure";
        await exRepo.save(exposure);

        fileConsole.log("exposure id " + exposure.entityId + " of clinical donor " + donor.id + " migrated.");
    }
}


async function migrateFamilyHistory(donor: ClinicalDonor){
    const fhRepo = PostgresDataSource.getRepository(FamilyHistory);
    const submitterDonorId = donor.submitterId?.toString();
    const programId = donor.programId;
    for (const fh of donor.familyHistory) {
        checkpoint = 'FamilyHistory: '+fh.familyHistoryId;

        const familyHistory = new FamilyHistory();
        familyHistory.submitterDonorId = submitterDonorId || '-';
        familyHistory.programId = programId || '-';
        familyHistory.familyRelativeId = fh.clinicalInfo.family_relative_id?.toString() || '-';
        familyHistory.entityId = fh.familyHistoryId?.toString() || '-';
        familyHistory.entityType = "family_history";
        await fhRepo.save(familyHistory);

        fileConsole.log("familyHitory id " + familyHistory.entityId + " of clinical donor " + donor.id + " migrated.");
    }
}


async function migrateFollowUps(donor: ClinicalDonor){
    const flRepo = PostgresDataSource.getRepository(FollowUp);
    const submitterDonorId = donor.submitterId?.toString();
    const programId = donor.programId;
    for (const fl of donor.followUps) {
        checkpoint = 'FollowUp: '+fl.followUpId;

        const folowUp = new FollowUp();
        folowUp.submitterDonorId = submitterDonorId || '-';
        folowUp.programId = programId || '-';
        folowUp.submitterFollowUpId = fl.clinicalInfo.submitter_follow_up_id?.toString() || '-';
        folowUp.entityId = fl.followUpId?.toString() || '-';
        folowUp.entityType = "follow_up";
        await flRepo.save(folowUp);

        fileConsole.log("followUp id " + folowUp.entityId + " of clinical donor " + donor.id + " migrated.");
    }
}


async function migratePrimaryDiagnosis(donor: ClinicalDonor){
    const prRepo = PostgresDataSource.getRepository(PrimaryDiagnosis);
    const submitterDonorId = donor.submitterId?.toString();
    const programId = donor.programId;
    for (const pr of donor.primaryDiagnoses) {
        checkpoint = 'PrimaryDiagnosis: '+pr.primaryDiagnosisId;

        const primaryDiagnosis = new PrimaryDiagnosis();
        primaryDiagnosis.submitterDonorId = submitterDonorId || '-';
        primaryDiagnosis.programId = programId || '-';
        primaryDiagnosis.submitterPrimaryDiagnosisId = pr.clinicalInfo.submitter_primary_diagnosis_id?.toString() || '-';
        primaryDiagnosis.entityId = pr.primaryDiagnosisId?.toString() || '-';
        primaryDiagnosis.entityType = "primary_diagnosis";
        await prRepo.save(primaryDiagnosis);

        fileConsole.log("primaryDiagnosis id " + primaryDiagnosis.entityId + " of clinical donor " + donor.id + " migrated.");
    }
}


async function migrateTreatments(donor: ClinicalDonor){
    const trRepo = PostgresDataSource.getRepository(Treatment);
    const submitterDonorId = donor.submitterId?.toString();
    const programId = donor.programId;
    for (const tr of donor.treatments) {
        checkpoint = 'Treatment: '+tr.treatmentId;
        if(!tr.clinicalInfo){
            throw new Error;
        }
        const treatment = new Treatment();
        treatment.submitterDonorId = submitterDonorId || '-';
        treatment.programId = programId || '-';
        treatment.submitterTreatmentId = tr.clinicalInfo?.submitter_treatment_id?.toString() || '-';
        treatment.entityId = tr.treatmentId?.toString() || '-';
        treatment.entityType = "treatment";
        await trRepo.save(treatment);

        fileConsole.log("treatment id " + treatment.entityId + " of clinical donor " + donor.id + " migrated.");
    }
}


async function migrateSpecimens(donor: ClinicalDonor){
    const spcRepo = PostgresDataSource.getRepository(Specimen);
    const submitterDonorId = donor.submitterId?.toString();
    const programId = donor.programId;
    for (const spc of donor.specimens) {
        checkpoint = 'Specimen: '+spc.specimenId;

        const specimen = new Specimen();
        specimen.submitterDonorId = submitterDonorId || '-';
        specimen.programId = programId || '-';
        specimen.submitterSpecimenId = !spc.clinicalInfo.submitter_specimen_id ? spc.submitterId : spc.clinicalInfo.submitter_specimen_id?.toString() || '-';
        specimen.entityId = spc.specimenId?.toString() || '-';
        specimen.entityType = "specimen";
        await spcRepo.save(specimen);

        fileConsole.log("specimen id " + specimen.entityId + " of clinical donor " + donor.id + " migrated.");
    }
}


async function migrateSamples(donor: ClinicalDonor){
    const smRepo = PostgresDataSource.getRepository(SampleRegistration);
    const submitterDonorId = donor.submitterId?.toString();
    const programId = donor.programId;
    for (const spc of donor.specimens) {
        for (const sm of spc.samples) {
            checkpoint = 'Sample: '+sm.sampleId;

            const sample = new SampleRegistration();
            sample.submitterDonorId = submitterDonorId || '-';
            sample.programId = programId || '-';
            sample.submitterSpecimenId = spc.submitterId.toString() || '-';
            sample.submitterSampleId = sm.submitterId.toString() || '-';
            sample.entityId = sm.sampleId?.toString() || '-';
            sample.entityType = "sample_registration";
            await smRepo.save(sample);

            fileConsole.log("sample id " + sample.entityId + " of clinical donor " + donor.id + " migrated.");
        }
    }
}