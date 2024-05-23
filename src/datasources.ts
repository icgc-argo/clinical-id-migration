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
import {ClinicalDonor, FailedMigrations} from "./models/clinical-donor.js";

import * as dotenv from 'dotenv';

dotenv.config();

export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: process.env['PG_HOST'] || '',
    username: process.env['PG_USERNAME'] || '',
    password: process.env['PG_PASSWORD'] || '',
    port: parseInt(process.env['PG_PORT'] || '0'),
    database: process.env['PG_DATABASE'] || '',
    schema: process.env['PG_SCHEMA'] || '',
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
const password= process.env['MONGO_PASSWORD'] || '';

export const MongoDataSource = new DataSource({
    type: "mongodb",
    host: process.env['MONGO_HOST'] || '',
    password: process.env['MONGO_PASSWORD'] || '',
    username: process.env['MONGO_USERNAME'] || '',
    port: parseInt(process.env['MONGO_PORT'] || '0'),
    database: process.env['MONGO_DATABASE'] || '',
    entities: [
        ClinicalDonor,
        FailedMigrations
    ],
    synchronize: true,
    directConnection:true,
    logging:false
});


