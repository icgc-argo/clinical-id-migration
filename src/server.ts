import {beginMigration} from "./migration.js";
import express, {response} from 'express';
import {Request, Response } from 'express';
import {triggerDataCorrection} from "./data-correction.js";
const app = express();

app.route('/migrate').get(migrateData);
app.route('/correct').get(correctData);
app.route('/alive').get(healthCheck);

/*app.listen(process.env['PORT'], () => {
    console.log(`HTTP REST API SERVER available at http://localhost:${process.env['PORT']}`);
});*/

app.listen(process.env['PORT'], () => {
    console.log(`HTTP REST API SERVER available at http://localhost:${process.env['PORT']}`);
});

console.log('Server started successfully');

function healthCheck(request: Request, response: Response) {
    console.log("health check-in....")
        const healthcheck = {
            message: 'Service Up',
            timestamp: Date.now(),
        };
        return response.send(healthcheck);
    }

async function correctData(request: Request, response: Response){
    console.log('data correction triggered');
    await triggerDataCorrection(response);
    response.send('Data correction complete');
}

async function migrateData(request: Request, response: Response){
    console.log('ID migration triggered');
    await beginMigration(response);
    response.send('ID migration complete');
}