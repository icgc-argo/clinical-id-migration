import fs from "fs";
import {Response} from "express";
import {MongoDataSource} from "./datasources.js";
import {ClinicalDonor, FailedMigrations, Therapy, Treatment} from "./models/clinical-donor.js";

let logFileStream;
let fileConsole: Console;


export const TreatmentTherapyMap: Record<string, string> = {
    'chemotherapy': 'Chemotherapy',
    'radiation': 'Radiation therapy',
    'hormone_therapy': 'Hormonal therapy',
    'immunotherapy': 'Immunotherapy',
    'surgery': 'Surgery',
};


export async function triggerDataCorrection(response: Response) {

     logFileStream = fs.createWriteStream("./DataCorrection.log");
     fileConsole = new console.Console(logFileStream, logFileStream);


    fileConsole.log('starting data correction.....');
    console.log('starting data correction.....');

    let isInitialized = MongoDataSource.isInitialized;
    if (!isInitialized) {
        await MongoDataSource.initialize();
    }

    const cdRepo = MongoDataSource.getRepository(ClinicalDonor);
    const donors = await cdRepo.find();
    fileConsole.log('total donors count: '+cdRepo.count())
    console.log('total donors count: '+cdRepo.count())

    for (const donor of donors) {
        let updateDonor=false;
        const treatments = new Array<Treatment>();
        const therapies = new Array<Therapy>();
        for(const tr of donor.treatments) {
            if(!tr.clinicalInfo){
                updateDonor=true;
                tr.therapies.forEach(th => {
                    fileConsole.log('donor: '+donor.submitterId+' treatment: '+tr.treatmentId);
                    fileConsole.log('therapy treatment: '+th.clinicalInfo.submitter_treatment_id);
                    therapies.push(th);
                })
            }
        };
        for(const tr of donor.treatments) {
            if(tr.clinicalInfo){
                fileConsole.log(tr.clinicalInfo.submitter_treatment_id);
                const therapy = therapies.filter(th => {
                    const treatment_type: string[]=tr.clinicalInfo.treatment_type as string[];
                    return (th.clinicalInfo.submitter_treatment_id == tr.clinicalInfo.submitter_treatment_id)
                })
                tr.therapies.push(...therapy);
                treatments.push(tr);
            }
        }
        if(updateDonor){
            fileConsole.log('Updating therapies in right treatments: '+" - "+donor.submitterId+" - "+donor.programId);
            console.log('Updating therapies in right treatments: '+" - "+donor.submitterId+" - "+donor.programId);
            donor.treatments = treatments;
            await cdRepo.save(donor);
        }
    }

    return;

}