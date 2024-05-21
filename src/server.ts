import {beginMigration} from "./migration.js";
import express from 'express';
import {Request, Response } from 'express';
import {triggerDataCorrection} from "./data-correction.js";
const app = express();

app.route('/migrate').get(beginMigration);
app.route('/correct').get(triggerDataCorrection);
app.route('/alive').get(beginMigration);

app.listen(process.env['PORT'], () => {
    console.log(`HTTP REST API SERVER available at http://localhost:${process.env['PORT']}`);
});

console.log('Server started successfully');

function healthCheck(request: Request, response: Response) {
        const healthcheck = {
            message: 'Service Up',
            timestamp: Date.now(),
        };
        return response.send(healthcheck);
    }
