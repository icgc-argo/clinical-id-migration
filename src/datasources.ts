import {DataSource} from "typeorm";
import {Biomarker} from "./models/biomarker.js";
import {Comorbidity} from "./models/comorbidity.js";
import {Donor} from "./models/donor.js";
import {Exposure} from "./models/exposure.js";
import {FamilyHistory} from "./models/family-history.js";
import {FollowUp} from "./models/follow-up.js";
import {PrimaryDiagnosis} from "./models/primary-diagnosis.js";
import {SampleRegistration} from "./models/sample-registration.js";
import {Specimen} from "./models/specimen.js";
import {Treatment} from "./models/treatment.js";
import {ClinicalDonor} from "./models/clinical-donor.js";

import * as dotenv from 'dotenv';

dotenv.config();

export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: process.env['PG_HOST'] || '', //"localhost",
    username: process.env['PG_USERNAME'] || '', //"postgres",
    password: process.env['PG_PASSWORD'] || '', //"password",
    port: parseInt(process.env['PG_PORT'] || '0'), //5555,
    database: process.env['PG_DATABASE'] || '', //"postgres",
    schema: process.env['PG_SCHEMA'] || '', //"clinical_migration",
    /*ssl: false,
    extra: {
        ssl : {
            rejectUnauthorized:false
        }
    },*/
    entities:[
        Biomarker,
        Comorbidity,
        Donor,
        Exposure,
        FamilyHistory,
        FollowUp,
        PrimaryDiagnosis,
        SampleRegistration,
        Specimen,
        Treatment
    ],
    synchronize: false,
    logging:false
});


console.log("HOST ---- "+process.env['MONGO_HOST']);


export const MongoDataSource = new DataSource({
    type: "mongodb",
    host: process.env['MONGO_HOST'] || '', //"localhost",
    username: process.env['MONGO_USERNAME'] || '', //"",
    password: process.env['MONGO_PASSWORD'] || '', //"",
    port: parseInt(process.env['MONGO_PORT'] || '0'), //27017,
    database: process.env['MONGO_DATABASE'] || '', //"clinical",
   /* ssl: true,
    extra: {
        ssl : {
            rejectUnauthorized:false
        }
    },*/
    entities: [
        ClinicalDonor
    ],
    synchronize: false,
    logging:false
});
