import fs from "fs";
import {Response} from "express";
import {MongoDataSource} from "./datasources.js";
import {ClinicalDonor, FailedMigrations, Therapy, Treatment} from "./models/clinical-donor.js";

var myLogFileStream = fs.createWriteStream("./correction.log");
var myConsole = new console.Console(myLogFileStream, myLogFileStream);

let checkpoint = '';

export async function triggerDataCorrection(response: Response) {
    await MongoDataSource.initialize();

    const cdRepo = MongoDataSource.getRepository(ClinicalDonor);
    const corrected_repo = MongoDataSource.getRepository(FailedMigrations)
    const donors = await cdRepo.find();

    for (const donor of donors) {
        let updateDonor=false;
        console.log(donor.donorId);
        const treatments = new Array<Treatment>;
        const therapies = new Array<Therapy>();
        for(const tr of donor.treatments) {
            if(!tr.clinicalInfo){
                updateDonor=true;
                tr.therapies.forEach(th => {
                    console.log(tr.treatmentId);
                    console.log(th.clinicalInfo.submitter_treatment_id);
                    therapies.push(th);
                })
            }
        };
        for(const tr of donor.treatments) {
            if(tr.clinicalInfo){
                console.log(tr.clinicalInfo.submitter_treatment_id);
                const therapy = therapies.filter(th => {
                    return th.clinicalInfo.submitter_treatment_id == tr.clinicalInfo.submitter_treatment_id;
                })
                tr.therapies = therapy;
                treatments.push(tr);
            }
        }
        if(updateDonor){
            myConsole.log('Updating therapies in right treatments: '+" - "+donor.submitterId+" - "+donor.programId);
            donor.treatments = treatments;
            //await cdRepo.save(donor);
            await corrected_repo.save(donor);
        }
    }
    return;

}